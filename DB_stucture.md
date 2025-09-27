# Пример структуры:
#### Коллекция users:
<pre>{
    "_id": "user123",
    "username": "admin",
    "passwordHash": "hashed_password",
    "role": "Admin"
}</pre>

#### Коллекция products:
<pre>
{
    "_id": "product123",
    "name": "T-shirt",
    "color": "Blue",
    "size": "M",
    "price": 19.99,
    "stock": 50
}
</pre>

### Коллекция product_sizes:

<pre>
{
    "_id": "size123",
    "productId": "product123",
    "size": "M",
    "color": "Red",
    "stock": 7,
    "price": 19.99
}
</pre>

#### Коллекция orders:
<pre>{
    "_id": "order123",
    "userId": "user123",
    "orderDate": "2025-01-24T10:30:00Z",
    "items": [
        {
            "productId": "product123",
            "quantity": 2
        }
    ]
}</pre>


## Примеры:
### Индексация
###### Для ускорения поиска и обновления, добавьте индексы на наиболее часто используемые поля:
<pre>
db.product_sizes.createIndex({ productId: 1 }); // Для связи вариантов с продуктом
db.product_sizes.createIndex({ size: 1, color: 1 }); // Для поиска по размеру и цвету
db.product_sizes.createIndex({ stock: 1 }); // Для проверки остатков

</pre>

### Получение всех вариантов одного продукта:
###### Чтобы получить все размеры и цвета для одного товара::
<pre>
db.product_sizes.find(
    { productId: "product123" },
    { size: 1, color: 1, stock: 1, price: 1, _id: 0 } // Проекция для возврата только нужных полей
);

</pre>
##### Пример результата:
<pre>
[
    { "size": "S", "color": "White", "stock": 10, "price": 19.99 },
    { "size": "M", "color": "Black", "stock": 8, "price": 19.99 },
    { "size": "L", "color": "Red", "stock": 5, "price": 19.99 }
]
</pre>
### Обновление остатка для конкретного варианта
###### Например, покупатель заказал 2 футболки размера M и цвета Red:
<pre>
db.product_sizes.updateOne(
    { productId: "product123", size: "M", color: "Red" }, // Фильтр
    { $inc: { stock: -2 } } // Уменьшение остатка
);
</pre>

### Проверка доступного остатка перед продажей
###### Чтобы убедиться, что нужное количество доступно, можно добавить проверку перед обновлением.
<pre>
db.product_sizes.findOne(
    { productId: "product123", size: "M", color: "Red", stock: { $gte: 2 } } // Убедиться, что остаток >= 2
);
</pre>

### Аналитика (подсчёт всех остатков для одного продукта)
Например, вы хотите узнать общее количество товара (всех размеров и цветов) на складе:

<pre>
db.product_sizes.aggregate([
    { $match: { productId: "product123" } }, // Фильтр по продукту
    { $group: { 
        _id: "$productId", 
        totalStock: { $sum: "$stock" } // Суммируем остатки
    }}
]);
</pre>
###### Пример результата:
<pre>
[
    { "_id": "product123", "totalStock": 50 }
]
</pre>

### Удаление варианта
Если продавец решил удалить вариант (например, размер XL, цвет Black), запрос будет таким:
<pre>
db.product_sizes.deleteOne(
    { productId: "product123", size: "XL", color: "Black" }
);
</pre>

### Массовое обновление цен
Если нужно обновить цену всех вариантов одного товара, запрос будет простым:
<pre>
db.product_sizes.updateMany(
    { productId: "product123" }, // Фильтр по продукту
    { $set: { price: 21.99 } } // Установка новой цены
);
</pre>

### Когда использовать транзакции?
Если вы хотите выполнить несколько операций одновременно, например:

1. Уменьшить остаток в product_sizes.
2. Создать документ заказа в коллекции orders.
<pre>
const session = db.getMongo().startSession();

session.startTransaction();
try {
    // Уменьшение остатка
    db.product_sizes.updateOne(
        { productId: "product123", size: "M", color: "Red" },
        { $inc: { stock: -2 } },
        { session }
    );

    // Создание заказа
    db.orders.insertOne(
        {
            userId: "user123",
            productId: "product123",
            size: "M",
            color: "Red",
            quantity: 2,
            orderDate: new Date()
        },
        { session }
    );

    // Фиксация транзакции
    await session.commitTransaction();
} catch (error) {
    // Откат транзакции в случае ошибки
    await session.abortTransaction();
    throw error;
} finally {
    await session.endSession();
}
</pre>