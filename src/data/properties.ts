import openplots from "@/assets/prop-openplots.jpg";
import villas from "@/assets/prop-villas.jpg";
import farmland from "@/assets/prop-farmland.jpg";
import lakeview from "@/assets/prop-lakeview.jpg";
import shadnagar from "@/assets/prop-shadnagar.jpg";
import highway from "@/assets/prop-highway.jpg";
import interior from "@/assets/prop-interior.jpg";
import warangal1 from "@/assets/warangal-kesaraguta-1.jpg.asset.json";
import warangal2 from "@/assets/warangal-kesaraguta-2.jpg.asset.json";
import warangal3 from "@/assets/warangal-kesaraguta-3.jpg.asset.json";
import warangal4 from "@/assets/warangal-kesaraguta-4.jpg.asset.json";
import warangal5 from "@/assets/warangal-kesaraguta-5.jpg.asset.json";
import warangal6 from "@/assets/warangal-kesaraguta-6.jpg.asset.json";
import warangal7 from "@/assets/warangal-kesaraguta-7.jpg.asset.json";
import warangal8 from "@/assets/warangal-kesaraguta-8.jpg.asset.json";
import warangal9 from "@/assets/warangal-kesaraguta-9.jpg.asset.json";
import warangal10 from "@/assets/warangal-kesaraguta-10.jpg.asset.json";

export type Property = {
  id: string;
  title: string;
  category: string;
  location: string;
  approvals: string[];
  features: string[];
  price: string;
  image: string;
  highlight?: string;
};

export const properties: Property[] = [
  {
    id: "warangal-kesaraguta-bibinagar",
    title: "HMDA Open Plots — Kesaraguta, Bibinagar (Near AIIMS)",
    category: "Open Plots",
    location: "Kesaraguta, Bibinagar • Warangal Highway • Near AIIMS Hospital",
    approvals: ["HMDA", "Loan Available"],
    features: ["Near AIIMS Hospital", "Warangal Highway Frontage", "Gated Layout", "Black-top Roads"],
    price: "Starting ₹ 13,999 / sq.yd",
    image: warangal1.url,
    highlight: "HMDA Approved",
  },
  {
    id: "budhera-mumbai-hwy",
    title: "Low Budget Open Plots — Mumbai Highway",
    category: "Open Plots",
    location: "Budhera, Mumbai Highway",
    approvals: ["DTCP", "LRS", "Loan Available"],
    features: ["Low Budget Plots", "Highway Connectivity", "Bank Loan Available", "Clear Title"],
    price: "Starting ₹ 8.5L",
    image: openplots,
    highlight: "Limited Plots",
  },
  {
    id: "zaheerabad-corridor",
    title: "Open Plots — Telangana Corridors",
    category: "Open Plots",
    location: "Zaheerabad • East / West / North / South Telangana",
    approvals: ["Clear Documentation"],
    features: ["Investment Friendly", "Future Growth Potential", "Verified Layouts"],
    price: "Starting ₹ 6.9L",
    image: highway,
  },
  {
    id: "shadnagar-plots",
    title: "Open Plots for Sale — Shadnagar",
    category: "Open Plots",
    location: "Shadnagar, Bangalore Highway",
    approvals: ["DTCP", "LRS"],
    features: ["Affordable Investment", "Highway Connectivity", "Loan Facility Available"],
    price: "Starting ₹ 9.2L",
    image: shadnagar,
    highlight: "Best Price",
  },
  {
    id: "hmda-villas",
    title: "HMDA Approved Villas & Plots",
    category: "Villas & Plots",
    location: "Vijayawada • Bangalore • Srisailam Highway",
    approvals: ["HMDA", "Bank Loan"],
    features: ["Premium Community Living", "Ready Infrastructure", "Gated Security"],
    price: "Starting ₹ 1.25 Cr",
    image: villas,
    highlight: "HMDA Approved",
  },
  {
    id: "farm-lands",
    title: "Farm Lands Near Major Highways",
    category: "Farm Land",
    location: "Across Telangana",
    approvals: ["Verified Documents"],
    features: ["Large Land Options", "Peaceful Environment", "Investment Potential"],
    price: "On Request",
    image: farmland,
  },
  {
    id: "sagar-lakeview",
    title: "Lake View Gated Community — 2/3 BHK",
    category: "Gated Community",
    location: "Sagar Road",
    approvals: ["HMDA", "RERA"],
    features: ["Lake View Living", "2BHK & 3BHK Homes", "Premium Amenities", "Clubhouse"],
    price: "Starting ₹ 78L",
    image: lakeview,
    highlight: "Lake View",
  },
  {
    id: "shadnagar-villas",
    title: "Open Villas & Plots — Low Budget",
    category: "Villas & Plots",
    location: "Shadnagar",
    approvals: ["DTCP", "Loan Available"],
    features: ["Affordable Villas", "Residential Plots", "Future Appreciation"],
    price: "Starting ₹ 42L",
    image: interior,
  },
];

export const galleryImages = [
  { src: warangal1.url, tag: "Warangal Highway", caption: "Kesaraguta Layout — Avenue" },
  { src: warangal2.url, tag: "Warangal Highway", caption: "Project Entrance Arch" },
  { src: warangal3.url, tag: "Warangal Highway", caption: "Gated Entry — Day View" },
  { src: warangal4.url, tag: "Warangal Highway", caption: "Master Layout Plan" },
  { src: warangal5.url, tag: "Warangal Highway", caption: "Internal Roads — Night" },
  { src: warangal6.url, tag: "Warangal Highway", caption: "Entrance Arch — Evening" },
  { src: warangal7.url, tag: "Warangal Highway", caption: "Wide Black-top Road" },
  { src: warangal8.url, tag: "Warangal Highway", caption: "Tree-lined Pathway" },
  { src: warangal9.url, tag: "Warangal Highway", caption: "Children's Play Area" },
  { src: warangal10.url, tag: "Warangal Highway", caption: "Aerial View — Night" },
  { src: warangal1.url, tag: "Location Photos", caption: "Kesaraguta Layout — Avenue" },
  { src: warangal2.url, tag: "Location Photos", caption: "Project Entrance Arch" },
  { src: warangal3.url, tag: "Location Photos", caption: "Gated Entry — Day View" },
  { src: warangal4.url, tag: "Location Photos", caption: "Master Layout Plan" },
  { src: warangal5.url, tag: "Location Photos", caption: "Internal Roads — Night" },
  { src: warangal6.url, tag: "Location Photos", caption: "Entrance Arch — Evening" },
  { src: warangal7.url, tag: "Location Photos", caption: "Wide Black-top Road" },
  { src: warangal8.url, tag: "Location Photos", caption: "Tree-lined Pathway" },
  { src: warangal9.url, tag: "Location Photos", caption: "Children's Play Area" },
  { src: warangal10.url, tag: "Location Photos", caption: "Aerial View — Night" },
  { src: openplots, tag: "Open Plots", caption: "Mumbai Highway Layout" },
  { src: shadnagar, tag: "Open Plots", caption: "Shadnagar Township" },
  { src: villas, tag: "Villas", caption: "HMDA Villa Community" },
  { src: interior, tag: "Villas", caption: "Luxury Interiors" },
  { src: farmland, tag: "Farm Lands", caption: "Green Acreage" },
  { src: lakeview, tag: "Gated Communities", caption: "Lake View Homes" },
  { src: highway, tag: "Location Photos", caption: "Highway Corridor" },
];

export const testimonials = [
  { name: "Ravi Kumar", rating: 5, text: "Smooth buying process from start to finish. KK Realtors handled every document professionally." },
  { name: "Sneha Reddy", rating: 5, text: "Got an HMDA villa on Vijayawada highway at a fair price. The site visit was very informative." },
  { name: "Mohammed Imran", rating: 5, text: "Transparent paperwork and honest pricing exactly what I was looking for." },
  { name: "Lakshmi Prasad", rating: 4, text: "Helpful team during site visits, no pushy sales. I bought two plots in Shadnagar." },
  { name: "Anjali Verma", rating: 5, text: "Best price guaranteed they delivered. Loan was processed quickly through their banking partner." },
  { name: "Suresh Babu", rating: 5, text: "Already seeing appreciation on my Mumbai highway plot. A genuinely good investment decision." },
  { name: "Priya Sharma", rating: 5, text: "Lake view 3BHK is a dream. Premium amenities and great neighbours." },
  { name: "Karthik Naidu", rating: 5, text: "Documentation was crystal clear. DTCP and LRS approvals were all in order." },
  { name: "Divya Rao", rating: 4, text: "Affordable farm land near the highway — perfect weekend getaway and a sound investment." },
  { name: "Rajesh Goud", rating: 5, text: "Trusted real estate partner. Will recommend KK Realtors to my family and friends." },
  { name: "Neha Iyer", rating: 5, text: "Quick response on WhatsApp, organized site visit the same week. Bought my first plot at 25." },
  { name: "Vikram Singh", rating: 5, text: "Bangalore highway corridor plots are a steal at this price. Glad I invested early." },
];