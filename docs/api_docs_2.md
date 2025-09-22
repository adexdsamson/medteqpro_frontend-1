## API Endpoints

### 1. Create Pickup Record

**Endpoint**: `POST /api/drugmgt/hospital/pickups/`

Records a new drug pickup when a patient collects their medication.

#### Request Body
```json
{
    "drug_order_id": "uuid-string",
    "pickup_date": "2025-09-20T10:30:00Z"
}
```

#### Request Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `drug_order_id` | UUID | Yes | ID of the drug order being picked up |
| `pickup_date` | DateTime | No | Pickup timestamp (defaults to current time) |

#### Success Response (201 Created)
```json
{
    "id": "pickup-uuid",
    "drug_order": {
        "id": "order-uuid",
        "patient": "John Doe",
        "pickup_date": "2025-09-20T15:00:00Z",
        "status": "pending_pickup",
        "items": [
            {
                "id": "item-uuid",
                "drug": {
                    "id": "drug-uuid",
                    "drug_name": "Paracetamol",
                    "drug_type": "tablet",
                    "drug_price": "5.50"
                },
                "quantity": 20
            }
        ],
        "created_at": "2025-09-20T09:00:00Z"
    },
    "pickup_date": "2025-09-20T10:30:00Z",
    "patient": "John Doe",
    "created_at": "2025-09-20T10:30:00Z",
    "updated_at": "2025-09-20T10:30:00Z"
}
```

#### Error Responses
```json
// Drug order not found
{
    "error": "Drug order with id {drug_order_id} not found in this hospital."
}

// Invalid order status
{
    "error": "Drug order status must be 'pending_pickup' to record a pickup. Current status: picked_up"
}

// Validation errors
{
    "drug_order_id": ["This field is required."]
}
```

#### Notes
- Automatically updates the associated drug order status from `pending_pickup` to `picked_up`
- Patient information is automatically derived from the drug order
- Only orders with status `pending_pickup` can have pickups recorded

---

### 2. List Pickup Records

**Endpoint**: `GET /api/drugmgt/hospital/pickups/`

Retrieves a list of pickup records with optional filtering.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `start_date` | Date | No | Filter pickups from this date (YYYY-MM-DD) |
| `end_date` | Date | No | Filter pickups until this date (YYYY-MM-DD) |
| `search` | String | No | Search by patient name, patient ID, or family name |

#### Example Requests
```bash
# Get all pickups
GET /api/drugmgt/hospital/pickups/

# Get pickups for a date range
GET /api/drugmgt/hospital/pickups/?start_date=2025-09-01&end_date=2025-09-30

# Search for specific patient
GET /api/drugmgt/hospital/pickups/?search=John

# Combined filters
GET /api/drugmgt/hospital/pickups/?start_date=2025-09-01&search=Doe
```

#### Success Response (200 OK)
```json
[
    {
        "id": "pickup-uuid-1",
        "drug_order": {
            "id": "order-uuid-1",
            "patient": "John Doe",
            "pickup_date": "2025-09-20T15:00:00Z",
            "status": "picked_up",
            "items": [
                {
                    "id": "item-uuid-1",
                    "drug": {
                        "id": "drug-uuid-1",
                        "drug_name": "Paracetamol",
                        "drug_type": "tablet",
                        "drug_price": "5.50"
                    },
                    "quantity": 20
                }
            ]
        },
        "pickup_date": "2025-09-20T10:30:00Z",
        "patient": "John Doe",
        "created_at": "2025-09-20T10:30:00Z",
        "updated_at": "2025-09-20T10:30:00Z"
    }
]
```

#### Error Response
```json
// Invalid date format
{
    "error": "Invalid date format. Use YYYY-MM-DD"
}
```

---

### 3. Update Pickup Record

**Endpoint**: `PATCH /api/drugmgt/hospital/pickups/{pickup_id}/`

Updates an existing pickup record (partial updates supported).

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pickup_id` | UUID | Yes | ID of the pickup record to update |

#### Request Body
```json
{
    "pickup_date": "2025-09-20T11:00:00Z"
}
```

#### Success Response (200 OK)
```json
{
    "id": "pickup-uuid",
    "drug_order": {
        "id": "order-uuid",
        "patient": "John Doe",
        "pickup_date": "2025-09-20T15:00:00Z",
        "status": "picked_up",
        "items": [...]
    },
    "pickup_date": "2025-09-20T11:00:00Z",
    "patient": "John Doe",
    "created_at": "2025-09-20T10:30:00Z",
    "updated_at": "2025-09-20T11:00:00Z"
}
```

#### Error Responses
```json
// Pickup not found
{
    "error": "Pickup record not found"
}

// Validation errors
{
    "pickup_date": ["Enter a valid date/time."]
}
```

---

### 4. Delete Pickup Record

**Endpoint**: `DELETE /api/drugmgt/hospital/pickups/{pickup_id}/`

Deletes a pickup record and optionally reverts the drug order status.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pickup_id` | UUID | Yes | ID of the pickup record to delete |

#### Success Response (204 No Content)
```
No response body
```

#### Error Response
```json
// Pickup not found
{
    "error": "Pickup record not found"
}
```

#### Notes
- If the associated drug order status is `picked_up`, it will be reverted to `pending_pickup`
- This allows for correction of accidental pickup recordings

---

### 5. Pickup Overview Statistics

**Endpoint**: `GET /api/drugmgt/hospital/pickups/overview/`

Provides overview statistics for pickup management.

#### Success Response (200 OK)
```json
{
    "total_picked_up_orders": 45,
    "total_pending_pickup_orders": 12,
    "total_cancelled_orders": 3
}
```

#### Response Fields
| Field | Type | Description |
|-------|------|-------------|
| `total_picked_up_orders` | Integer | Count of orders that have been picked up |
| `total_pending_pickup_orders` | Integer | Count of orders awaiting pickup |
| `total_cancelled_orders` | Integer | Count of cancelled orders |

---