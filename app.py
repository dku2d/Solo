from datetime import timedelta
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from config import Config
from models import db, User, Property, Unit, Tenant, Lease, Payment, MaintenanceRequest
from seed import seed_database

app = Flask(__name__)
app.config.from_object(Config)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=8)

db.init_app(app)
jwt = JWTManager(app)
CORS(app, resources={r"/*": {"origins": "*"}})

def property_to_dict(p):
    return {
        "id": p.id,
        "name": p.name,
        "address": p.address,
        "city": p.city,
        "state": p.state,
        "zip_code": p.zip_code,
        "unit_count": len(p.units),
    }

def tenant_to_dict(t):
    return {
        "id": t.id,
        "first_name": t.first_name,
        "last_name": t.last_name,
        "name": f"{t.first_name} {t.last_name}",
        "email": t.email,
        "phone": t.phone,
    }

def payment_to_dict(p):
    return {
        "id": p.id,
        "lease_id": p.lease_id,
        "amount": p.amount,
        "payment_date": p.payment_date,
        "status": p.status,
    }

def maintenance_to_dict(m):
    return {
        "id": m.id,
        "description": m.description,
        "status": m.status,
        "created_at": m.created_at,
        "tenant_name": f"{m.tenant.first_name} {m.tenant.last_name}" if m.tenant else "",
        "unit_number": m.unit.unit_number if m.unit else "",
    }

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"message": "PropertyHub API is running"})

@app.route("/auth/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    full_name = (data.get("full_name") or "").strip() or "User"

    if not email or not password:
        return jsonify({"message": "Email and password are required."}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists."}), 409

    user = User(email=email, full_name=full_name)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created successfully."}), 201

@app.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid email or password."}), 401

    token = create_access_token(identity={"id": user.id, "email": user.email, "full_name": user.full_name})
    return jsonify({
        "token": token,
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
        }
    })

@app.route("/auth/me", methods=["GET"])
@jwt_required()
def me():
    return jsonify(get_jwt_identity())

@app.route("/dashboard/stats", methods=["GET"])
@jwt_required()
def dashboard_stats():
    total_properties = Property.query.count()
    active_tenants = Tenant.query.count()
    monthly_revenue = sum(payment.amount for payment in Payment.query.filter_by(status="paid").all())

    return jsonify({
        "total_properties": total_properties,
        "active_tenants": active_tenants,
        "monthly_revenue": monthly_revenue,
    })

@app.route("/properties", methods=["GET"])
@jwt_required()
def get_properties():
    properties = Property.query.order_by(Property.id.asc()).all()
    return jsonify([property_to_dict(p) for p in properties])

@app.route("/properties", methods=["POST"])
@jwt_required()
def create_property():
    data = request.get_json() or {}
    required_fields = ["name", "address", "city", "state", "zip_code"]
    if any(not data.get(field) for field in required_fields):
        return jsonify({"message": "All property fields are required."}), 400

    prop = Property(
        name=data["name"],
        address=data["address"],
        city=data["city"],
        state=data["state"],
        zip_code=data["zip_code"],
    )
    db.session.add(prop)
    db.session.commit()
    return jsonify(property_to_dict(prop)), 201

@app.route("/tenants", methods=["GET"])
@jwt_required()
def get_tenants():
    tenants = Tenant.query.order_by(Tenant.id.asc()).all()
    return jsonify([tenant_to_dict(t) for t in tenants])

@app.route("/tenants", methods=["POST"])
@jwt_required()
def create_tenant():
    data = request.get_json() or {}
    required_fields = ["first_name", "last_name", "email", "phone"]
    if any(not data.get(field) for field in required_fields):
        return jsonify({"message": "All tenant fields are required."}), 400

    if Tenant.query.filter_by(email=data["email"].strip().lower()).first():
        return jsonify({"message": "A tenant with that email already exists."}), 409

    tenant = Tenant(
        first_name=data["first_name"],
        last_name=data["last_name"],
        email=data["email"].strip().lower(),
        phone=data["phone"],
    )
    db.session.add(tenant)
    db.session.commit()
    return jsonify(tenant_to_dict(tenant)), 201

@app.route("/payments", methods=["GET"])
@jwt_required()
def get_payments():
    payments = Payment.query.order_by(Payment.id.desc()).all()
    return jsonify([payment_to_dict(p) for p in payments])

@app.route("/maintenance", methods=["GET"])
@jwt_required()
def get_maintenance():
    requests = MaintenanceRequest.query.order_by(MaintenanceRequest.id.desc()).all()
    return jsonify([maintenance_to_dict(r) for r in requests])

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        seed_database()
    app.run(debug=True)
