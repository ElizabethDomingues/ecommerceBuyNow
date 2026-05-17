import express from 'express'
import { getProducts, addProduct, updateProduct, deleteProduct, decreaseStock } from '../controllers/productController.js'

const router = express.Router()

router.get('/', getProducts)
router.post('/', addProduct)
router.post('/decrease-stock', decreaseStock)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

export default router
