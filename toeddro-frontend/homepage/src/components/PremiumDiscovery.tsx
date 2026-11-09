import { useMemo, useState } from "react";
import { ArrowUpRight, Compass, MapPin, Mountain, Waves, Wind, Tent, Bike, Leaf, Heart, Sparkles, Sun, Users, Clock3 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const photos = {
  ladakh: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=85",
  mountains: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85",
  coast: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=85",
  forest: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85",
  lake: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85",
  desert: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1200&q=85",
  river: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=85",
  tropical: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=85",
  valley: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=85",
  snow: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85",
};

const activities = [
  { name: "Trekking", note: "Find your next summit", icon: Mountain, image: photos.mountains },
  { name: "Rafting", note: "Follow the current", icon: Waves, image: photos.river },
  { name: "Paragliding", note: "See the world differently", icon: Wind, image: photos.valley },
  { name: "Camping", note: "Sleep under open skies", icon: Tent, image: photos.forest },
  { name: "Biking", note: "Take the scenic route", icon: Bike, image: photos.lake },
  { name: "Wellness & Retreat", note: "Make room to reset", icon: Leaf, image: photos.coast },
];

const moods = [
  { name: "Adventure", icon: Compass, activity: "Trekking", description: "Big views, bold plans and trails worth waking up for." },
  { name: "Relaxing", icon: Sun, activity: "Wellness & Retreat", description: "Slow down, breathe deeply and find your quiet." },
  { name: "Nature", icon: Leaf, activity: "Camping", description: "Trade the noise for forests, rivers and open skies." },
  { name: "Water", icon: Waves, activity: "Rafting", description: "Make a splash and let the river set the pace." },
  { name: "Solo", icon: Sparkles, activity: "Trekking", description: "A little distance, a lot of perspective." },
  { name: "Together", icon: Heart, activity: "Camping", description: "Shared stories start outside the usual." },
];

const inspiration = [
  { title: "Chase the high country", place: "Himalayan escapes", image: photos.snow, activity: "Trekking" },
  { title: "Find your blue", place: "Coastal adventures", image: photos.coast, activity: "Scuba" },
  { title: "Into the green", place: "Forest hideaways", image: photos.forest, activity: "Camping" },
  { title: "Follow the water", place: "River country", image: photos.river, activity: "Rafting" },
];

type Props = {
  locations: string[];
  onActivitySelect: (activity: string) => void;
  onLocationSelect: (location: string) => void;
};

export function PremiumDiscovery({ locations, onActivitySelect, onLocationSelect }: Props) {
  const reduce = useReducedMotion();
  const [mood, setMood] = useState("Adventure");
  const [tripStyle, setTripStyle] = useState("Any adventure");
  const availableLocations = useMemo(() => locations.slice(0, 8), [locations]);
  const selectedMood = moods.find((item) => item.name === mood) ?? moods[0];
  const tripStyles = ["Any adventure", "Quick escape", "Long weekend", "Big expedition"];

  return (
    <div className="premium-discovery">
      <section className="container premium-section premium-destinations" aria-labelledby="premium-destinations-title">
        <div className="premium-heading-row">
          <div>
            <p className="premium-eyebrow">THE WORLD IS WIDE OPEN</p>
            <h2 id="premium-destinations-title" className="premium-title">Find a place to <span>feel alive.</span></h2>
            <p className="premium-subtitle">A little inspiration for wherever your curiosity takes you.</p>
          </div>
          <span className="premium-side-note"><Compass size={16}/> YOUR NEXT STORY STARTS HERE</span>
        </div>
        <div className="premium-destination-grid">
          {availableLocations.length ? availableLocations.map((place, index) => {
            const images = [photos.ladakh, photos.lake, photos.forest, photos.desert, photos.coast, photos.valley, photos.snow, photos.tropical];
            return (
              <motion.button key={place} type="button" className={`premium-destination-card destination-${index % 8}`} onClick={() => onLocationSelect(place)} whileHover={reduce ? undefined : { y: -5 }} whileTap={{ scale: .985 }}>
                <img src={images[index % images.length]} alt="" loading="lazy" />
                <span className="premium-image-shade" />
                <span className="premium-card-arrow"><ArrowUpRight size={19}/></span>
                <span className="premium-destination-copy"><small><MapPin size={12}/>{index % 2 === 0 ? "INDIA" : "EXPLORE INDIA"}</small><strong>{place}</strong><em>Explore destination</em></span>
              </motion.button>
            );
          }) : (
            <div className="premium-empty">Destinations will appear as operator locations become available.</div>
          )}
        </div>
      </section>

      <section className="premium-activity-band" aria-labelledby="premium-activities-title">
        <div className="container premium-section">
          <div className="premium-heading-row">
            <div>
              <p className="premium-eyebrow">PICK YOUR PLAYGROUND</p>
              <h2 id="premium-activities-title" className="premium-title">What moves <span>you?</span></h2>
              <p className="premium-subtitle">From first-time thrills to the kind of adventure you never forget.</p>
            </div>
            <span className="premium-side-note">GO AT YOUR OWN PACE <ArrowUpRight size={16}/></span>
          </div>
          <div className="premium-activity-grid">
            {activities.map(({ name, note, icon: Icon, image }, index) => (
              <motion.button key={name} type="button" className="premium-activity-card" onClick={() => onActivitySelect(name)} whileHover={reduce ? undefined : { y: -6 }} whileTap={{ scale: .985 }}>
                <img src={image} alt="" loading="lazy"/>
                <span className="premium-image-shade"/>
                <span className="premium-activity-icon"><Icon size={19}/></span>
                <span className="premium-activity-copy"><strong>{name}</strong><small>{note}</small></span>
                <span className="premium-card-arrow"><ArrowUpRight size={18}/></span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section className="container premium-section premium-mood-section" aria-labelledby="premium-mood-title">
        <div className="premium-mood-panel">
          <div className="premium-mood-intro">
            <p className="premium-eyebrow">STILL DECIDING?</p>
            <h2 id="premium-mood-title" className="premium-title">Pick a mood.<br/><span>Find your wild.</span></h2>
            <p className="premium-subtitle">No fixed itinerary? No problem. Start with how you want to feel.</p>
            <div className="premium-mood-pills">
              {moods.map(({ name, icon: Icon }) => (
                <button key={name} type="button" onClick={() => setMood(name)} className={mood === name ? "active" : ""}><Icon size={15}/>{name}</button>
              ))}
            </div>
          </div>
          <motion.div key={selectedMood.name} className="premium-mood-result" initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}>
            <img src={selectedMood.activity === "Rafting" ? photos.river : selectedMood.activity === "Camping" ? photos.forest : selectedMood.activity === "Wellness & Retreat" ? photos.coast : photos.mountains} alt="" loading="lazy"/>
            <span className="premium-image-shade"/>
            <div className="premium-mood-result-copy">
              <span>YOUR MOOD: {selectedMood.name.toUpperCase()}</span>
              <h3>{selectedMood.description}</h3>
              <button type="button" onClick={() => onActivitySelect(selectedMood.activity)}>Explore {selectedMood.activity} <ArrowUpRight size={16}/></button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container premium-section premium-trip-section" aria-label="Choose your trip style">
        <div className="premium-trip-heading">
          <div><p className="premium-eyebrow">A QUICK TRIP OR A BIG GETAWAY?</p><h2 className="premium-title">Make it <span>your kind of trip.</span></h2></div>
          <div className="premium-trip-tabs">{tripStyles.map((style) => <button key={style} type="button" className={tripStyle === style ? "active" : ""} onClick={() => setTripStyle(style)}>{style}</button>)}</div>
        </div>
        <div className="premium-trip-note"><Clock3 size={18}/><span><strong>{tripStyle}</strong> — browse real operators and choose an experience that fits your plans.</span><button type="button" onClick={() => document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" })}>Browse operators <ArrowUpRight size={16}/></button></div>
      </section>

      <section className="premium-live-section" aria-labelledby="premium-live-title">
        <div className="container premium-live-inner">
          <div className="premium-live-copy">
            <p className="premium-eyebrow">OUT THERE, WAITING FOR YOU</p>
            <h2 id="premium-live-title">The best stories<br/>happen <span>outside.</span></h2>
            <p>Explore the places, landscapes and experiences that make you want to take the long way home.</p>
            <button type="button" onClick={() => document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" })}>Explore adventures <ArrowUpRight size={17}/></button>
            <small><span className="premium-live-dot"/> DESTINATION INSPIRATION · NOT LIVE TRIP TRACKING</small>
          </div>
          <div className="premium-live-collage">
            <div className="premium-live-photo live-photo-one"><img src={photos.valley} alt="Green mountain valley" loading="lazy"/><span>THE GREAT OUTDOORS</span></div>
            <div className="premium-live-photo live-photo-two"><img src={photos.tropical} alt="Tropical travel landscape" loading="lazy"/><span>FIND YOUR BLUE</span></div>
            <div className="premium-live-photo live-photo-three"><img src={photos.snow} alt="Snowy mountain peaks" loading="lazy"/><span>TAKE THE HIGH ROAD</span></div>
          </div>
        </div>
      </section>

      <section className="container premium-section premium-inspiration" aria-labelledby="premium-inspiration-title">
        <div className="premium-heading-row">
          <div><p className="premium-eyebrow">A LITTLE TRAVEL INSPIRATION</p><h2 id="premium-inspiration-title" className="premium-title">Places that stay <span>with you.</span></h2><p className="premium-subtitle">A visual moodboard for your next escape.</p></div>
        </div>
        <div className="premium-inspiration-grid">
          {inspiration.map((item) => (
            <button type="button" key={item.title} onClick={() => onActivitySelect(item.activity)} className="premium-inspiration-card">
              <img src={item.image} alt="" loading="lazy"/><span className="premium-image-shade"/><span className="premium-inspiration-copy"><small>{item.place}</small><strong>{item.title}</strong></span><span className="premium-card-arrow"><ArrowUpRight size={18}/></span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
