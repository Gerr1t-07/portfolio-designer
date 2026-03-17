import { useState } from "react"
import { Mail, ArrowUpRight, X, Send } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import HoverFillButton from "./HoverFillButton"

const PROJECT_TYPES = ["Logo Design", "Branding Kit", "Poster / Print", "Moodboard", "3D / Blender", "Other"]
const BUDGETS = ["Under €100", "€100–300", "€300+"]

export default function ContactButton({className, text = "", firstIcon, lastIcon}) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState("")
  const [title, setTitle] = useState("")
  const [name, setName] = useState("")

  const FirstIcon = firstIcon
  const LastIcon = lastIcon

  function handleOpen() {
  window.location.href = `mailto:sachergerrit@gmail.com?subject=${encodeURIComponent(
    (type ? `[${type}] ` : "") + (title || "Project Inquiry")
  )}&body=${encodeURIComponent(
    [name && `Name: ${name}`, title && `Project: ${title}`,  "\n---\n"]
      .filter(Boolean).join("\n")
  )}`
  setOpen(false)
  window.dispatchEvent(new CustomEvent("contact-modal", { detail: { open: false } }))
}

  return (
    <>
      {/* Trigger button — your existing HoverFillButton */}
      <HoverFillButton
        onClick={() => {
        setOpen(true)
        window.dispatchEvent(new CustomEvent("contact-modal", { detail: { open: true } }))
        }}
        className={`border uppercase ${className || ''}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        {FirstIcon && <FirstIcon size={16} />}
        {text}  
        {LastIcon && <LastIcon size={15} />}
      </HoverFillButton>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center bg-bg/80 backdrop-blur-sm px-4"
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 120 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 120 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-[40vw] h-fit bg-bg border border-white/10 rounded-xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-end" style={{paddingTop: '2rem', paddingRight:'2rem'}}>
                <button onClick={() => {
                    setOpen(false)
                    window.dispatchEvent(new CustomEvent("contact-modal", { detail: { open: false } }))
                    }}
                    className="text-white hover:text-white/60 cursor-pointer transition-colors"
                >
                    <X size={16} />
                </button>
              </div>
              <div className="flex items-start justify-center select-none">
                <div>
                  <h2 className="text-3xl font-display text-white text-center tracking-tight" style={{ marginTop: '0.5rem', marginBottom: '2rem'}}>Let's work <span className="text-gold">together.</span></h2>
                </div>
              </div>
                
              <div className="p-8 space-y-6" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
                {/* Name */}
              <div>
                <label className="block text-[10px] tracking-[0.15em] text-white/30 uppercase mb-3 text-start" style={{ paddingBottom: '0.75rem'}}>Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Apple Inc. or John Doe"
                  className="w-full bg-transparent border border-gold/20 hover:border-gold/50 text-white placeholder:text-white/20 focus:placeholder:text-white/0 rounded-md text-sm focus:outline-none focus:border-gold transition-colors duration-300 ease-in-out"
                  style={{ padding: '0.5rem', marginBottom: '1rem'}}
                />
              </div>

                {/* Title */}
              <div>
                <label className="block text-[10px] tracking-[0.15em] text-white/30 uppercase mb-3 text-start" style={{ paddingBottom: '0.75rem'}}>Project title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Logo for a Berlin café"
                  className="w-full bg-transparent border border-gold/20 hover:border-gold/50 text-white placeholder:text-white/20 focus:placeholder:text-white/0 rounded-md text-sm focus:outline-none focus:border-gold transition-colors duration-300 ease-in-out"
                  style={{ padding: '0.5rem', marginBottom: '1rem'}}
                />
              </div>
                {/* Project type */}
                <div>
                  <label className="block text-[10px] tracking-[0.15em] text-white/30 uppercase mb-3 text-start" style={{ paddingBottom: '0.75rem'}}>Project type</label>
                  <div className="grid grid-cols-2 gap-2" style={{ paddingBottom: '1rem'}}>
                    {PROJECT_TYPES.map((t) => (
                      <HoverFillButton
                        key={t}
                        onClick={() => setType(t)}
                        className={`py-2.5 px-3 text-xs tracking-wide border rounded-md transition-all ${
                          type === t
                            ? "border-gold text-gold bg-white/5"
                            : "border-gold/20 hover:text-gold/70 hover:cursor-pointer"
                        }`}
                        style={{ padding: '0.5rem' }}
                      >
                        {t}
                      </HoverFillButton>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <p className="text-[0.5rem] text-white/20 uppercase tracking-wider" style={{ paddingTop: '2rem'}}>clicking send will redirect you to your mail app of choice.</p>
                <div className="grid grid-cols-2 gap-2" style={{ paddingBottom: '2rem', paddingTop: '0.5rem'}}>
                <HoverFillButton
                  onClick={() => {
                            setOpen(false)
                            window.dispatchEvent(new CustomEvent("contact-modal", { detail: { open: false } }))
                          }}
                  className="w-full opacity-90 bg-transparent border border-gold cursor-pointer text-black text-xs font-bold tracking-[0.15em] uppercase rounded-md hover:bg-gold/90 transition-colors flex items-center justify-center gap-2"
                  style={{ padding: '1rem'}}
                >
                  Cancel
                </HoverFillButton>
                <HoverFillButton
                  inverted
                  onClick={handleOpen}
                  className="w-full bg-transparent border border-gold cursor-pointer text-black text-xs font-bold tracking-[0.15em] uppercase rounded-md hover:bg-gold/90 transition-colors flex items-center justify-center gap-2"
                >
                  Send
                  <Send size={13} />
                </HoverFillButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}