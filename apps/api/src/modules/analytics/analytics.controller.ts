import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("analytics")
@Controller("analytics")
export class AnalyticsController {
  @Get("dashboard")
  dashboard() {
    return {
      revenue: 12450,
      ordersCount: 87,
      averageOrderValue: 143.1,
      lowStockItems: [
        { id: "stock-1", quantity: 4, product: { name: "Mozzarella" } },
        { id: "stock-2", quantity: 6, product: { name: "Steak hache" } }
      ],
      topProducts: [
        { productId: "Pizza Margherita", _sum: { quantity: 36 } },
        { productId: "Burger Signature", _sum: { quantity: 24 } }
      ]
    };
  }
}
