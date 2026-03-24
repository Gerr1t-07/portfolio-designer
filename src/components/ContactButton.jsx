import { useState, useContext } from "react"
import { Mail, ArrowUpRight, X, Send, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import HoverFillButton from "./HoverFillButton"
import { ErrorContext } from "../context/ErrorContext"
import { ErrorCategory, ErrorSeverity } from "../lib/errorHandler"
import errorHandler from "../lib/errorHandler"

const PROJECT_TYPES = ["Logo Design", "Branding Kit", "Poster / Print", "Moodboard", "3D / Blender", "Other"]

export default function ContactButton({className, text = "", firstIcon, lastIcon}) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState("")
  const [title, setTitle] = useState("")
  const [name, setName] = useState("")
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showToast } = useContext(ErrorContext) || {}

  const FirstIcon = firstIcon
  const LastIcon = lastIcon

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {}
    
    if (!name.trim()) {
      newErrors.name = "Name is required"
    }
    if (!title.trim()) {
      newErrors.title = "Project title is required"
    }
    if (!type) {
      newErrors.type = "Please select a project type"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleOpen() {
    try {
      // Validate before submitting
      if (!validateForm()) {
        showToast?.({
          type: 'warning',
          message: 'Please fill in all required fields',
          duration: 3000,
        })
        errorHandler.log(
          new Error('Form validation failed'),
          ErrorCategory.FORM_VALIDATION,
          ErrorSeverity.LOW,
          { fields: Object.keys(errors) }
        )
        return
      }

      setIsSubmitting(true)

      // Build mailto URL
      const subject = (type ? `[${type}] ` : "") + (title || "Project Inquiry")
      const body = [
        name && `Name: ${name}`,
        title && `Project: ${title}`,
        "\n---\n"
      ]
        .filter(Boolean)
        .join("\n")

      const mailtoUrl = `mailto:sachergerrit@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

      // Try to open mailto link
      if (!window.location.href.startsWith('http://localhost')) {
        // Verify the mailto protocol is available
        try {
          window.location.href = mailtoUrl
          
          // Show success toast
          showToast?.({
            type: 'success',
            message: 'Opening email client...',
            duration: 2000,
          })

          // Close modal after brief delay
          setTimeout(() => {
            setOpen(false)
            setErrors({})
            setIsSubmitting(false)
            window.dispatchEvent(new CustomEvent("contact-modal", { detail: { open: false } }))
          }, 500)
          
        } catch (err) {
          throw err
        }
      } else {
        // Dev mode: just close without actually opening
        showToast?.({
          type: 'info',
          message: 'Form would be sent (dev mode)',
          duration: 2000,
        })

        setTimeout(() => {
            setOpen(false)
            setErrors({})
            setIsSubmitting(false)
            window.dispatchEvent(new CustomEvent("contact-modal", { detail: { open: false } }))
          }, 500)
      }
    } catch (err) {
      setIsSubmitting(false)
      
      errorHandler.log(
        err instanceof Error ? err : new Error(String(err)),
        ErrorCategory.FORM_VALIDATION,
        ErrorSeverity.MEDIUM,
        { action: 'mailto_submission' }
      )

      showToast?.({
        type: 'error',
        message: 'Failed to open email. Please copy the fields and send manually.',
        duration: 5000,
      })
    }
  }

  const closeModal = () => {
    setOpen(false)
    setErrors({})
    setIsSubmitting(false)
    window.dispatchEvent(new CustomEvent("contact-modal", { detail: { open: false } }))
  }

  return (
    <>
      {/* Trigger button — your existing HoverFillButton */}
      <HoverFillButton
        onClick={() => {
          try {
            setOpen(true)
            window.dispatchEvent(new CustomEvent("contact-modal", { detail: { open: true } }))
          } catch (err) {
            errorHandler.log(err instanceof Error ? err : new Error(String(err)), ErrorCategory.RUNTIME_ERROR, ErrorSeverity.LOW)
          }
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
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <motion.div
              initial={{ opacity: 0, y: 120 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 120 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-[80vw] md:max-w-[40vw] h-fit bg-bg border border-white/10 rounded-xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-end" style={{paddingTop: '2rem', paddingRight:'2rem'}}>
                <button 
                  onClick={closeModal}
                  className="text-white hover:text-white/60 cursor-pointer transition-colors"
                  aria-label="Close form"
                >
                    <X size={16} />
                </button>
              </div>
              <div className="flex items-start justify-center select-none">
                <div>
                  <h2 className="text-xl md:text-3xl font-display text-white text-center tracking-tight" style={{ marginTop: '0.5rem', marginBottom: '2rem'}}>Let's work <span className="text-gold">together.</span></h2>
                </div>
              </div>
                
              <div className="p-8 space-y-6" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
                {/* Name */}
              <div>
                <label className="block text-[10px] tracking-[0.15em] text-white/30 uppercase mb-3 text-start" style={{ paddingBottom: '0.75rem'}}>
                  Name <span className="text-red-400">*</span>
                </label>
                <div>
                  <input
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (errors.name) setErrors({ ...errors, name: undefined })
                    }}
                    placeholder="e.g. Apple Inc. or John Doe"
                    disabled={isSubmitting}
                    className={`w-full bg-transparent border ${errors.name ? 'border-red-500/50' : 'border-gold/20 hover:border-gold/50'} text-white placeholder:text-white/20 focus:placeholder:text-white/0 rounded-md text-sm focus:outline-none focus:border-gold transition-colors duration-300 ease-in-out disabled:opacity-50`}
                    style={{ padding: '0.5rem', marginBottom: '0.5rem'}}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.name}
                    </p>
                  )}
                </div>
              </div>

                {/* Title */}
              <div>
                <label className="block text-[10px] tracking-[0.15em] text-white/30 uppercase mb-3 text-start" style={{ paddingBottom: '0.75rem'}}>
                  Project title <span className="text-red-400">*</span>
                </label>
                <div>
                  <input
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value)
                      if (errors.title) setErrors({ ...errors, title: undefined })
                    }}
                    placeholder="e.g. Logo for a Berlin café"
                    disabled={isSubmitting}
                    className={`w-full bg-transparent border ${errors.title ? 'border-red-500/50' : 'border-gold/20 hover:border-gold/50'} text-white placeholder:text-white/20 focus:placeholder:text-white/0 rounded-md text-sm focus:outline-none focus:border-gold transition-colors duration-300 ease-in-out disabled:opacity-50`}
                    style={{ padding: '0.5rem', marginBottom: '0.5rem'}}
                    aria-invalid={!!errors.title}
                  />
                  {errors.title && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.title}
                    </p>
                  )}
                </div>
              </div>
                
                {/* Project type */}
                <div>
                  <label className="block text-[10px] tracking-[0.15em] text-white/30 uppercase mb-3 text-start" style={{ paddingBottom: '0.75rem'}}>
                    Project type <span className="text-red-400">*</span>
                  </label>
                  <div>
                    <div className="grid grid-cols-2 gap-2" style={{ paddingBottom: '0.5rem'}}>
                      {PROJECT_TYPES.map((t) => (
                        <HoverFillButton
                          key={t}
                          onClick={() => {
                            setType(t)
                            if (errors.type) setErrors({ ...errors, type: undefined })
                          }}
                          disabled={isSubmitting}
                          className={`py-2.5 px-3 text-xs tracking-wide border rounded-md transition-all disabled:opacity-50 ${
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
                    {errors.type && (
                      <p className="text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.type}
                      </p>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <p className="text-[0.4rem] md:text-[0.5rem] text-white/20 uppercase tracking-wider" style={{ paddingTop: '2rem'}}>clicking send will redirect you to your standard mail app.</p>
                <div className="grid grid-cols-2 gap-2" style={{ paddingBottom: '2rem', paddingTop: '0.5rem'}}>
                <HoverFillButton
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="w-full opacity-90 bg-transparent border border-gold cursor-pointer text-black text-xs font-bold tracking-[0.15em] uppercase rounded-md hover:bg-gold/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ padding: '1rem'}}
                >
                  Cancel
                </HoverFillButton>
                <HoverFillButton
                  inverted
                  onClick={handleOpen}
                  disabled={isSubmitting}
                  className="w-full bg-transparent border border-gold cursor-pointer text-black text-xs font-bold tracking-[0.15em] uppercase rounded-md hover:bg-gold/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send'}
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