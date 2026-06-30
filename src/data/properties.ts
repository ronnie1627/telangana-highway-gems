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
import shadnagar1 from "@/assets/shadnagar-1.jpg.asset.json";
import shadnagar2 from "@/assets/shadnagar-2.jpg.asset.json";
import shadnagar3 from "@/assets/shadnagar-3.jpg.asset.json";
import shadnagar4 from "@/assets/shadnagar-4.jpg.asset.json";
import shadnagar5 from "@/assets/shadnagar-5.jpg.asset.json";
import iconic1 from "@/assets/iconic9-1.jpeg.asset.json";
import iconic2 from "@/assets/iconic9-2.jpeg.asset.json";
import iconic3 from "@/assets/iconic9-3.jpeg.asset.json";
import iconic4 from "@/assets/iconic9-4.jpeg.asset.json";
import dreamValley3 from "@/assets/dream-valley-3.jpg.asset.json";

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
    title: "HMDA Open Plots —keesaragutta, Bibinagar (Near AIIMS)",
    category: "Open Plots",
    location: "keesaragutta, Bibinagar • Warangal Highway • Near AIIMS Hospital",
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
    location: "Shadnagar Town, Bangalore Highway",
    approvals: ["HMDA", "Loan Available"],
    features: ["HMDA Approved", "Shadnagar Town Location", "Highway Connectivity", "Gated Layout"],
    price: "₹ 25,299 / sq.yd",
    image: shadnagar1.url,
    highlight: "HMDA Approved",
  },
  {
    id: "iconic-9-burgula",
    title: "Iconic-9 — Open Plots, Burgula (Shadnagar)",
    category: "Open Plots",
    location: "Burgula Village, Shadnagar",
    approvals: ["HMDA", "Loan Available"],
    features: ["HMDA Approved (LP No. 1681/HMDA/SWDL/2026)", "Flexible Payment Options", "Gated Layout", "Wide Black-top Roads"],
    price: "₹ 16,299 / sq.yd",
    image: iconic2.url,
    highlight: "HMDA Approved",
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
    id: "dream-valley-3",
    title: "Dream Valley-3 — Premium Farm Plots",
    category: "Farm Land",
    location: "Nagulapally Village, Near Shadnagar",
    approvals: ["Premium Farmlands"],
    features: ["100 Acres Mega Project", "Mini Resort & Cottages", "24/7 Security", "CCTV Surveillance", "Gated Community", "Clear Legal Titles", "EMI Facility Available"],
    price: "₹ 13,299 / sq.yd",
    image: dreamValley3.url,
    highlight: "Premium Farmlands",
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
  { src: warangal1.url, tag: "Warangal Highway", caption: "keesaragutta Layout — Avenue" },
  { src: warangal2.url, tag: "Warangal Highway", caption: "Project Entrance Arch" },
  { src: warangal3.url, tag: "Warangal Highway", caption: "Gated Entry — Day View" },
  { src: warangal4.url, tag: "Warangal Highway", caption: "Master Layout Plan" },
  { src: warangal5.url, tag: "Warangal Highway", caption: "Internal Roads — Night" },
  { src: warangal6.url, tag: "Warangal Highway", caption: "Entrance Arch — Evening" },
  { src: warangal7.url, tag: "Warangal Highway", caption: "Wide Black-top Road" },
  { src: warangal8.url, tag: "Warangal Highway", caption: "Tree-lined Pathway" },
  { src: warangal9.url, tag: "Warangal Highway", caption: "Children's Play Area" },
  { src: warangal10.url, tag: "Warangal Highway", caption: "Aerial View — Night" },
  { src: shadnagar1.url, tag: "Open Plots", caption: "Shadnagar — Highway-facing Layout" },
  { src: shadnagar2.url, tag: "Open Plots", caption: "Shadnagar — Plotted Avenue" },
  { src: shadnagar3.url, tag: "Open Plots", caption: "Shadnagar — Landscaped Borders" },
  { src: shadnagar4.url, tag: "Open Plots", caption: "Shadnagar — Project Signage" },
  { src: shadnagar5.url, tag: "Open Plots", caption: "Shadnagar — Road Development" },
  { src: iconic1.url, tag: "Open Plots", caption: "Iconic-9 Burgula — Project Brochure" },
  { src: iconic2.url, tag: "Open Plots", caption: "Iconic-9 Burgula — Site Visit" },
  { src: iconic3.url, tag: "Open Plots", caption: "Iconic-9 Burgula — Plotted Layout" },
  { src: iconic4.url, tag: "Open Plots", caption: "Iconic-9 Burgula — Road Development" },
  { src: openplots, tag: "Open Plots", caption: "Mumbai Highway Layout" },
  { src: shadnagar, tag: "Open Plots", caption: "Shadnagar Township" },
  { src: villas, tag: "Villas", caption: "HMDA Villa Community" },
  { src: interior, tag: "Villas", caption: "Luxury Interiors" },
  { src: farmland, tag: "Farm Lands", caption: "Green Acreage" },
  { src: dreamValley3.url, tag: "Farm Lands", caption: "Dream Valley-3 — Nagulapally Village" },
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