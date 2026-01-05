
export interface ServiceCardProps {
  title: string;
  price: string;
  benefits: string[];
  description: string;
  type: 'Usui' | 'Kundalini';
}

export interface IdealProps {
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  author: string;
  text: string;
  role: string;
}
