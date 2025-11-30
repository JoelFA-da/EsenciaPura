import { Router } from 'express';
import axios from 'axios';
import { authenticate } from '../../common/middleware/authenticate';
import { logger } from '../../common/utils/logger';

const router = Router();

// Subir imagen a ImgBB (solo admin)
router.post('/image', authenticate, async (req, res) => {
  try {
    const { image } = req.body; // Base64 image data

    if (!image) {
      return res.status(400).json({ error: 'No se proporcionó imagen' });
    }

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      logger.error('IMGBB_API_KEY no configurada');
      return res.status(500).json({ error: 'Servicio de imágenes no configurado' });
    }

    // Subir a ImgBB
    const formData = new URLSearchParams();
    formData.append('key', apiKey);
    formData.append('image', image.split(',')[1]); // Remover data:image/...;base64,

    const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (response.data.success) {
      logger.info(`✅ Imagen subida a ImgBB: ${response.data.data.url}`);
      return res.json({
        success: true,
        url: response.data.data.url,
        displayUrl: response.data.data.display_url,
        deleteUrl: response.data.data.delete_url
      });
    } else {
      throw new Error('Error al subir imagen a ImgBB');
    }
  } catch (error: any) {
    logger.error({ error }, '❌ Error al subir imagen');
    return res.status(500).json({
      error: 'Error al subir imagen',
      details: error.response?.data?.error?.message || error.message
    });
  }
});

export default router;
