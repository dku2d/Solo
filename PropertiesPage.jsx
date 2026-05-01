import { Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api";
import PageLayout from "../components/PageLayout";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const response = await api.get("/properties");
        setProperties(response.data);
      } catch (error) {
        console.error("Failed to load properties", error);
      }
    };

    loadProperties();
  }, []);

  return (
    <PageLayout title="Properties">
      <div className="property-grid">
        {properties.map((property) => (
          <div key={property.id} className="property-card">
            <div className="property-icon-box">
              <Building2 size={30} />
            </div>

            <div>
              <div className="property-name">{property.address}</div>
              <div className="property-location">
                {property.city}, {property.state}
              </div>
              <div className="property-units">{property.unit_count} units</div>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}