import express from "express";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrlRaw = process.env.SUPABASE_URL || "";
const supabaseUrl = supabaseUrlRaw.replace(/\/rest\/v1\/?$/, "");
const supabaseKey = process.env.SUPABASE_ANON_KEY || "";

let supabase: any;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Middleware to check for supabase config
  const checkConfig = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!supabase) {
      return res.status(503).json({ 
        error: "Supabase not configured", 
        message: "Por favor, configure as variáveis SUPABASE_URL e SUPABASE_ANON_KEY nas configurações do app." 
      });
    }
    next();
  };

  // --- API Routes ---

  // Health check & DB Test
  app.get("/api/test-db", checkConfig, async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("supporters")
        .select("id")
        .limit(1);
      
      if (error) {
        if (error.code === '42P01') {
          return res.status(404).json({ 
            status: "error", 
            message: "Tabela 'supporters' não encontrada. Você executou o script SQL no Supabase?",
            code: error.code
          });
        }
        throw error;
      }

      res.json({ 
        status: "success", 
        message: "Conexão com Supabase estabelecida com sucesso!",
        dataFound: data.length > 0
      });
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
  });

  // Get all supporters
  app.get("/api/supporters", checkConfig, async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("supporters")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      console.error("Supabase error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Add a supporter
  app.post("/api/supporters", checkConfig, async (req, res) => {
    try {
      const supporter = req.body;
      const { data, error } = await supabase
        .from("supporters")
        .insert([supporter])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error: any) {
      console.error("Supabase error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // --- Vite Integration ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
