"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrderController = exports.editOrderController = exports.createOrderController = exports.getOrderDetailsController = exports.getOrdersController = void 0;
const tsyringe_1 = require("tsyringe");
const logger_1 = __importDefault(require("../utils/logger"));
const orderService = tsyringe_1.container.resolve('OrderService');
const getOrdersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerName, orderDate, page = 1, limit = 10 } = req.query;
    try {
        const { total, pages, orders } = yield orderService.getOrders(customerName, orderDate, parseInt(page), parseInt(limit));
        logger_1.default.info('Orders fetched successfully', { customerName, orderDate, total, pages });
        res.status(200).json({ total, pages, data: orders });
    }
    catch (error) {
        if (error instanceof Error) {
            logger_1.default.error('Error fetching orders', { error: error.message });
            res.status(500).json({ error: error.message || 'Failed to fetch orders' });
        }
        else {
            res.status(500).json({ error: 'Failed to fetch orders' });
        }
    }
});
exports.getOrdersController = getOrdersController;
const getOrderDetailsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const order = yield orderService.getOrderDetails(parseInt(id));
        if (!order) {
            logger_1.default.warn('Order not found', { orderId: id });
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        logger_1.default.info('Order details fetched successfully', { orderId: id });
        res.json(order);
    }
    catch (error) {
        if (error instanceof Error) {
            logger_1.default.error('Failed to fetch order details', { error: error.message });
            res.status(500).json({ error: error.message || 'Failed to fetch order details' });
        }
        else {
            res.status(500).json({ error: 'Failed to fetch order details' });
        }
    }
});
exports.getOrderDetailsController = getOrderDetailsController;
const createOrderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createOrderDto = req.body;
    try {
        const order = yield orderService.createNewOrder(createOrderDto.customerName, createOrderDto.products);
        logger_1.default.info('Order created successfully', { orderId: order.id, customerName: createOrderDto.customerName });
        res.status(201).json(order);
    }
    catch (error) {
        if (error instanceof Error) {
            logger_1.default.error('Error creating order', { error: error.message });
            res.status(400).json({ error: error.message || 'Failed to create order' });
        }
        else {
            res.status(400).json({ error: 'Failed to create order' });
        }
    }
});
exports.createOrderController = createOrderController;
const editOrderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updateOrderDto = req.body;
    try {
        const order = yield orderService.updateExistingOrder(parseInt(id), updateOrderDto.products);
        logger_1.default.info('Order updated successfully', { orderId: id });
        res.json(order);
    }
    catch (error) {
        if (error instanceof Error) {
            logger_1.default.error('Failed to update order', { error: error.message });
            res.status(500).json({ error: error.message || 'Failed to update order' });
        }
        else {
            res.status(500).json({ error: 'Failed to update order' });
        }
    }
});
exports.editOrderController = editOrderController;
const deleteOrderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield orderService.deleteExistingOrder(parseInt(id));
        logger_1.default.info('Order deleted successfully', { orderId: id });
        res.json(result);
    }
    catch (error) {
        if (error instanceof Error) {
            logger_1.default.error('Failed to delete order', { error: error.message });
            res.status(500).json({ error: error.message || 'Failed to delete order' });
        }
        else {
            res.status(500).json({ error: 'Failed to delete order' });
        }
    }
});
exports.deleteOrderController = deleteOrderController;
