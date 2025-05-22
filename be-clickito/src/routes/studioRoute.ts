import { Router } from 'express';
import { getAllStudio,  createStudio, updateStudio, deleteStudio} from '../controllers/studioController';
import uploadFile from "../middleware/uploadStudio";


const router = Router();

router.get('/', getAllStudio);
router.post('/',  uploadFile.single("picture"), createStudio);
router.put('/:id', uploadFile.single("picture"), updateStudio);
router.delete('/:id', deleteStudio);

export default router;