const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

// 🔐 CORS ayarları
const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3001'; // Netlify URL will be placed here in production


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS hatası: Erişim reddedildi.'));
    }
  }
}));

app.use(express.json()); // Gelen JSON body'lerini parse et

// 📮 Tüm yayınlanmış postları getir
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: 'Mesajları alırken bir hata oluştu.' });
  }
});

// 🆕 Yeni bir post oluştur
app.post('/api/posts', async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Başlık gereklidir.' });
    }
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        published: true,
      },
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: 'Mesaj oluşturulurken bir hata oluştu.' });
  }
});

// ✅ GET /todos – tüm görevleri getir
app.get('/todos', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    console.error("Görevler alınamadı:", error);
    res.status(500).json({ error: 'Görevler alınırken hata oluştu.' });
  }
});

// ✅ POST /todos – yeni görev ekle
app.post('/todos', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Başlık gerekli.' });

    const newTask = await prisma.task.create({
      data: { title }
    });
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Görev eklenemedi:", error);
    res.status(500).json({ error: 'Görev eklenirken hata oluştu.' });
  }
});

// ✅ PUT /todos/:id – görev tamamlandı durumunu değiştir
app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: { completed }
    });
    res.json(updatedTask);
  } catch (error) {
    console.error("Görev güncellenemedi:", error);
    res.status(500).json({ error: 'Görev güncellenirken hata oluştu.' });
  }
});

// ✅ DELETE /todos/:id – görev sil
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({
      where: { id: Number(id) }
    });
    res.status(204).send();
  } catch (error) {
    console.error("Görev silinemedi:", error);
    res.status(500).json({ error: 'Görev silinirken hata oluştu.' });
  }
});

// 🎧 Sunucuyu başlat
app.listen(port, () => {
  console.log(`Backend sunucusu http://localhost:${port} adresinde çalışıyor.`);
});

// 🛑 Sunucu kapanırken Prisma bağlantısını kes
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
