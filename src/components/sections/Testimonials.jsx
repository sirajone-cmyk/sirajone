import React from "react";
import { Star } from "lucide-react";
import { TESTIMONIALS } from "../../data/testimonials";
import { Section } from "../layout/Section";
import { PageWrapper } from "../layout/PageWrapper";
import { Card } from "../ui/Card";

export function TestimonialsSection() {
  return (
    <Section id="testimonials" variant="pattern" py="py-20 md:py-24">
      <PageWrapper>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p className="decor-divider">شهادات</p>
          <h2 className="section-title">What Students Say</h2>
        </div>

        <div className="testimonial-grid">
          {TESTIMONIALS.map((item) => (
            <Card key={item.id} className="testimonial-card hover-lift">
              <div className="testimonial-stars">
                {Array.from({ length: item.stars || 5 }).map((_, idx) => (
                  <Star key={idx} size={14} fill="#D4A843" color="#D4A843" />
                ))}
              </div>
              <p className="testimonial-quote">“{item.quote}”</p>
              <p className="testimonial-author">{item.name}</p>
              <p className="testimonial-location">{item.city}</p>
            </Card>
          ))}
        </div>
      </PageWrapper>
    </Section>
  );
}
