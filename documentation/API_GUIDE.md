# HMS API Documentation

Base URL: `http://localhost:5000`

## 1. Authentication

### **Login**
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Description**: Authenticates a user and returns a JWT token.
- **Body** (JSON):
  ```json
  {
      "email": "doctor@hms.com",
      "password": "doctor"
  }
  ```

### **Test Auth**
- **URL**: `/api/auth/test`
- **Method**: `GET`
- **Description**: Verify auth module is working.

---

## 2. Patients

### **Get All Patients**
- **URL**: `/api/patients`
- **Method**: `GET`
- **Description**: Returns all registered patients.

### **Get Patient by ID**
- **URL**: `/api/patients/:id`
- **Method**: `GET`
- **Example**: `/api/patients/24`

### **Register Patient**
- **URL**: `/api/patients`
- **Method**: `POST`
- **Body** (JSON):
  ```json
  {
      "name": "Jane Doe",
      "age": "28",
      "gender": "Female",
      "mobile": "9876543210",
      "address": "456 Health St",
      "bloodGroup": "B+",
      "doctor": "Dr. House",
      "opFee": 500
  }
  ```

### **Update Status**
- **URL**: `/api/patients/:id/status`
- **Method**: `PATCH`
- **Body** (JSON):
  ```json
  { "status": "Consultation" }
  ```

---

## 3. Medical Records (Clinical Notes)

### **Create Record**
- **URL**: `/api/medical-records`
- **Method**: `POST`
- **Body** (JSON):
  ```json
  {
      "patientId": "24",
      "doctorId": "1",
      "visitDate": "2023-10-27",
      "symptoms": "Fever, Cough",
      "history": "No major history",
      "physicalExam": "Throat redness",
      "diagnosis": "Viral Infection",
      "plan": "Rest and Fluids",
      "followUp": "2023-10-30",
      "bp": "120/80",
      "heartRate": "75",
      "temperature": "99.1",
      "spo2": "98"
  }
  ```

### **Get Patient History**
- **URL**: `/api/medical-records/:patientId`
- **Method**: `GET`

---

## 4. Prescriptions

### **Save Prescription**
- **URL**: `/api/prescriptions`
- **Method**: `POST`
- **Description**: Supports flat structure for up to 4 medicines.
- **Body** (JSON):
  ```json
  {
      "patientId": "24",
      "patientName": "Jane Doe",
      "age": 28,
      "gender": "Female",
      "date": "2023-10-27",
      "diagnosis": "Viral Infection",
      "notes": "Take after food",
      "vitals": { "temp": "99.1", "bp": "120/80" },
      "medicines": [
          { 
            "name": "Paracetamol", "qty": 10, "food": "After", 
            "morning": 1, "noon": 0, "night": 1, "days": 5 
          }
      ]
  }
  ```

### **Get Patient Prescriptions**
- **URL**: `/api/prescriptions/patient/:id`
- **Method**: `GET`

### **Get All Prescriptions**
- **URL**: `/api/prescriptions`
- **Method**: `GET`

---

## 5. Lab Tests (Test Master)

### **Get All Tests**
- **URL**: `/api/tests`
- **Method**: `GET`

### **Create Test**
- **URL**: `/api/tests`
- **Method**: `POST`
- **Body** (JSON):
  ```json
  {
      "department": "Biochemistry",
      "dCode": "BIO",
      "tCode": "T050",
      "testType": "Blood",
      "subTestName": "Fasting Sugar",
      "subType": "Glucose",
      "amount": 200,
      "normalValues": "70-100",
      "units": "mg/dL",
      "subTCode": "ST050"
  }
  ```

### **Delete Test**
- **URL**: `/api/tests/:id`
- **Method**: `DELETE`

---

## 6. Inventory

### **Get Products**
- **URL**: `/api/inventory/products`
- **Method**: `GET`

### **Create Product**
- **URL**: `/api/inventory/products`
- **Method**: `POST`
- **Body** (JSON):
  ```json
  {
      "pCode": "P100",
      "productName": "Surgical Mask",
      "description": "N95 Mask",
      "amount": 50,
      "stock": 500,
      "reOrder": 100,
      "scale": "pcs"
  }
  ```

### **Get Indents**
- **URL**: `/api/inventory/indents`
- **Method**: `GET`

### **Create Indent**
- **URL**: `/api/inventory/indents`
- **Method**: `POST`
- **Body** (JSON):
  ```json
  {
      "indentID": "IND-001",
      "indentDate": "2023-10-27",
      "pCode": "P100",
      "pname": "Surgical Mask",
      "requireQty": 200,
      "indentRisedby": "Staff Nurse"
  }
  ```

### **Get Issues**
- **URL**: `/api/inventory/issues`
- **Method**: `GET`

### **Create Issue**
- **URL**: `/api/inventory/issues`
- **Method**: `POST`
- **Body** (JSON):
  ```json
  {
      "id": "ISS-001",
      "issueDate": "2023-10-27",
      "pcode": "P100",
      "pname": "Surgical Mask",
      "issuedTo": "Emergency Ward",
      "qty": 50
  }
  ```

### **Get Lab Patients**
- **URL**: `/api/inventory/patients`
- **Method**: `GET`

---

## 7. Postman Import
You can simply copy these URLs into Postman requests. 
Ensure you set `Content-Type: application/json` header for POST/PATCH requests.
