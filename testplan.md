# Sample Testplan

## Setup: Fill database with test values

### Create test trainlines

Send `POST` to `http://localhost:8080/train-line` with the following body:

```json
{
    "stations": ["Finch", "Sheppard", "Eglinton", "Bloor", "Dundas", "Union", "Osgoode", "Spadina",  "Vaughan"],
    "name": "Yellow",
    "fare": 3.00
}
```

Alternatively, run the following cURL command:

```
curl --location 'http://localhost:8080/train-line' \
--header 'Content-Type: application/json' \
--data '{
    "stations": ["Finch", "Sheppard", "Eglinton", "Bloor", "Dundas", "Union", "Osgoode", "Spadina",  "Vaughan"],
    "name": "Yellow",
    "fare": 3.00
}'
```

---

Send `POST` to `http://localhost:8080/train-line` with the following body:

```json
{
    "stations": ["Jane", "Keele", "Dufferin", "Bathurst",  "Spadina",  "Bloor",  "Woodbine", "Kennedy"],
    "name": "Green",
    "fare": 2.00
}
```

Alternatively, run the following cURL command:

```
curl --location 'http://localhost:8080/train-line' \
--header 'Content-Type: application/json' \
--data '{
    "stations": ["Jane", "Keele", "Dufferin", "Bathurst",  "Spadina",  "Bloor",  "Woodbine", "Kennedy"],
    "name": "Green",
    "fare": 2.00
}'
```

---

Send `POST` to `http://localhost:8080/train-line` with the following body:

```json
{
    "stations": ["Sheppard", "Leslie", "DonMills"],
    "name": "Purple",
    "fare": 1.00
}
```

Alternatively, run the following cURL command:

```
curl --location 'http://localhost:8080/train-line' \
--header 'Content-Type: application/json' \
--data '{
    "stations": ["Sheppard", "Leslie", "DonMills"],
    "name": "Purple",
    "fare": 1.00
}'
```

### Create test card

Send `POST` to `http://localhost:8080/card` with the following body:

```json
{
    "number": 12345,
    "amount": 50.00
}
```

Alternatively, run the following cURL command:

```
curl --location 'http://localhost:8080/card' \
--header 'Content-Type: application/json' \
--data '{
    "number": 12345,
    "amount": 50.00
}'
```


## Test 1: Correct route is displayed between stops on same line

Send `GET` to `http://localhost:8080/route?origin=Sheppard&destination=DonMills`

Alternatively, run the following cURL command:

```
curl --location 'http://localhost:8080/route?origin=Sheppard&destination=DonMills'
```

**Expected Result**

```json
{
	"route": ["Sheppard", "Leslie", "DonMills"]
}
```

## Test 2: Correct route is displayed when multiple lines are required

Send `GET` to `http://localhost:8080/route?origin=Leslie&destination=Kennedy`

Alternatively, run the following cURL command:

```
curl --location 'http://localhost:8080/route?origin=Leslie&destination=Kennedy'
```

**Expected Result**

```json
{
    "route": ["Leslie", "Sheppard", "Eglinton", "Bloor", "Woodbine", "Kennedy"]
}
```

## Test 3: Correct route is displayed when there is a quicker route (less stops) if multiple lines are used

Send `GET` to `http://localhost:8080/route?origin=Finch&destination=Vaughan`

Alternatively, run the following cURL command:

```
curl --location 'http://localhost:8080/route?origin=Finch&destination=Vaughan'
```

**Expected Result**

```json
{
	"route": ["Finch", "Sheppard", "Eglinton", "Bloor",  "Spadina",  "Vaughan"]
}
```

## Test 4: Error message is received when no route exists

Send `POST` to `http://localhost:8080/train-line` with the following body:

```json
{
    "stations": ["Unreachable"],
    "name": "Black",
    "fare": 5.00
}
```

Alternatively, run the following cURL command:

```
curl --location 'http://localhost:8080/train-line' \
--header 'Content-Type: application/json' \
--data '{
    "stations": ["Unreachable"],
    "name": "Black",
    "fare": 5.00
}'
```

---

Send `GET` to `http://localhost:8080/route?origin=Unreachable&destination=Vaughan`

Alternatively, run the following cURL command:

```
curl --location 'http://localhost:8080/route?origin=Unreachable&destination=Vaughan'
```

**Expected Result**

```json
{
	"message": "could not calculate shortest route between Unreachable and Vaughan"
}
```

## Test 5: Correct fare is deducted on a single line ride

Send `POST` to `http://localhost:8080/station/Sheppard/enter` with the following body:

```json
{
	"card_number": 12345
}
```

Alternatively, run the following cURL command:

```
curl --location 'http://localhost:8080/station/Sheppard/enter' \
--header 'Content-Type: application/json' \
--data '{
    "card_number": 12345
}'
```

**Expected Result**

```json
{
	"amount": 50.00
}
```

---

Send `POST` to `http://localhost:8080/station/Leslie/exit` with the following body:

```json
{
	"card_number": 12345
}
```

Alternatively, run the following cURL command:

```
curl --location 'http://localhost:8080/station/Leslie/exit' \
--header 'Content-Type: application/json' \
--data '{
    "card_number": 12345
}'
```

**Expected Result**

```json
{
	"amount": 49.00
}
```


## Test 6: Correct fare is deducted on a multiple line ride

Send `POST` to `http://localhost:8080/station/Leslie/enter` with the following body:

```json
{
	"card_number": 12345
}
```

Alternatively, run the following cURL command:

```
curl --location 'http://localhost:8080/station/Leslie/enter' \
--header 'Content-Type: application/json' \
--data '{
    "card_number": 12345
}'
```

**Expected Result**

```json
{
	"amount": 49.00
}
```

---

Send `POST` to `http://localhost:8080/station/Kennedy/exit` with the following body:

```json
{
	"card_number": 12345
}
```

Alternatively, run the following cURL command:

```
curl --location 'http://localhost:8080/station/Kennedy/exit' \
--header 'Content-Type: application/json' \
--data '{
    "card_number": 12345
}'
```

**Expected Result**

```json
{
	"amount": 43.00
}
```

## Test 7: Error message is received when card has already entered a station

Send `POST` to `http://localhost:8080/station/Leslie/enter` with the following body:

```json
{
	"card_number": 12345
}
```

Alternatively, run the following cURL command:

```
curl --location 'http://localhost:8080/station/Leslie/enter' \
--header 'Content-Type: application/json' \
--data '{
    "card_number": 12345
}'
```

**Expected Result**

```json
{
	"amount": 43.00
}
```

Send `POST` to `http://localhost:8080/station/Leslie/enter` with the following body:

```json
{
	"card_number": 12345
}
```

Alternatively, run the following cURL command:

```
curl --location 'http://localhost:8080/station/Leslie/enter' \
--header 'Content-Type: application/json' \
--data '{
    "card_number": 12345
}'
```

**Expected Result**

```json
{
    "message": "card with id 12345 is already on a ride, must exit first"
}
```


## Test 8: Error message is received when card has insufficient funds

Send `POST` to `http://localhost:8080/card` with the following body:

```json
{
    "number": 54321,
    "amount": 0.00
}
```

Alternatively, run the following cURL command:

```
curl --location 'http://localhost:8080/card' \
--header 'Content-Type: application/json' \
--data '{
    "number": 54321,
    "amount": 0.00
}'
```

---

Send `POST` to `http://localhost:8080/station/Bathurst/enter` with the following body:

```json
{
	"card_number": 54321
}
```

Alternatively, run the following cURL command:

```
curl --location 'http://localhost:8080/station/Bathurst/enter' \
--header 'Content-Type: application/json' \
--data '{
    "card_number": 54321
}'
```

**Expected Result**

```json
{
	"message": "card with id 54321 does not have sufficient funds, refill before riding"
}
```
