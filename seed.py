from datetime import datetime
from models import db, User, Property, Unit, Tenant, Lease, Payment, MaintenanceRequest

def seed_database():
    if User.query.first():
        return

    admin = User(email="admin@propertyhub.com", full_name="PropertyHub Admin", role="admin")
    admin.set_password("Password123!")

    prop1 = Property(
        name="Cedar Heights",
        address="110 Cedar Ave",
        city="Murfreesboro",
        state="TN",
        zip_code="37130",
    )
    prop2 = Property(
        name="Maple Square",
        address="225 Maple St",
        city="Nashville",
        state="TN",
        zip_code="37203",
    )

    db.session.add_all([admin, prop1, prop2])
    db.session.flush()

    units = [
        Unit(property_id=prop1.id, unit_number="A101", bedrooms=2, bathrooms=2, rent=1450, status="occupied"),
        Unit(property_id=prop1.id, unit_number="A102", bedrooms=1, bathrooms=1, rent=1200, status="available"),
        Unit(property_id=prop2.id, unit_number="B201", bedrooms=3, bathrooms=2, rent=1850, status="occupied"),
        Unit(property_id=prop2.id, unit_number="B202", bedrooms=2, bathrooms=1, rent=1500, status="available"),
    ]
    db.session.add_all(units)
    db.session.flush()

    tenants = [
        Tenant(first_name="Jordan", last_name="Smith", email="jordan@example.com", phone="615-555-0101"),
        Tenant(first_name="Avery", last_name="Brown", email="avery@example.com", phone="615-555-0102"),
    ]
    db.session.add_all(tenants)
    db.session.flush()

    leases = [
        Lease(tenant_id=tenants[0].id, unit_id=units[0].id, start_date="2026-01-01", end_date="2026-12-31", monthly_rent=1450),
        Lease(tenant_id=tenants[1].id, unit_id=units[2].id, start_date="2026-02-01", end_date="2027-01-31", monthly_rent=1850),
    ]
    db.session.add_all(leases)
    db.session.flush()

    payments = [
        Payment(lease_id=leases[0].id, amount=1450, payment_date="2026-04-01", status="paid"),
        Payment(lease_id=leases[1].id, amount=1850, payment_date="2026-04-03", status="paid"),
    ]
    db.session.add_all(payments)

    maintenance = [
        MaintenanceRequest(
            unit_id=units[0].id,
            tenant_id=tenants[0].id,
            description="Kitchen sink is leaking under the cabinet.",
            status="open",
            created_at=datetime.utcnow().isoformat(),
        ),
        MaintenanceRequest(
            unit_id=units[2].id,
            tenant_id=tenants[1].id,
            description="AC unit is making loud noise at night.",
            status="in progress",
            created_at=datetime.utcnow().isoformat(),
        ),
    ]
    db.session.add_all(maintenance)
    db.session.commit()
