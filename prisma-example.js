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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var prisma_1 = require("./src/lib/prisma");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var category, product, order;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('--- Creating Sample Data ---');
                    return [4 /*yield*/, prisma_1.prisma.category.create({
                            data: {
                                name: 'Pneumatic Tools',
                                slug: 'pneumatic-tools',
                                image: '/images/pneumatic-cat.png',
                            },
                        })];
                case 1:
                    category = _a.sent();
                    console.log('1. Created category:', category);
                    return [4 /*yield*/, prisma_1.prisma.product.create({
                            data: {
                                name: 'High-Power Impact Wrench',
                                subtitle: 'Industrial Grade',
                                description: 'Heavy duty pneumatic impact wrench for industrial applications.',
                                price: 299.99,
                                inStock: true,
                                power: 8.5,
                                categoryId: category.id,
                                images: {
                                    create: [
                                        { url: '/images/impact-wrench-main.jpg' },
                                        { url: '/images/impact-wrench-side.jpg' }
                                    ]
                                }
                            },
                            include: {
                                images: true,
                            }
                        })];
                case 2:
                    product = _a.sent();
                    console.log('\n2. Created product with images:', product);
                    return [4 /*yield*/, prisma_1.prisma.order.create({
                            data: {
                                customerName: 'Alice Engineer',
                                phone: '+1-555-0198',
                                email: 'alice@industry.com',
                                address: '789 Manufacturing Blvd, Factory City',
                                total: 599.98,
                                status: 'CONFIRMED',
                                items: {
                                    create: [
                                        {
                                            productId: product.id,
                                            quantity: 2,
                                            price: 299.99
                                        }
                                    ]
                                }
                            },
                            include: {
                                items: {
                                    include: {
                                        product: true
                                    }
                                }
                            }
                        })];
                case 3:
                    order = _a.sent();
                    console.log('\n3. Created order with items:', JSON.stringify(order, null, 2));
                    console.log('\n--- Done ---');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma_1.prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
