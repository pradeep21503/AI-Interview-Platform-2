
import { useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "motion/react"
import { Bot, CreditCard, LineChart, ShieldCheck, TrendingUp, X } from "lucide-react"


const features = [
  { icon: Bot, label: "AI Mock Interviews" },
  { icon: LineChart, label: "Performance Reports" },
  { icon: CreditCard, label: "Buy & Manage Credits" },
  { icon: TrendingUp, label: "Track Interview Progress" },
]

export default function AuthModal({ showAuthModal, setShowAuthModal }) {
const navigate = useNavigate()

  const close = () => setShowAuthModal(false)

  return (
    <AnimatePresence>
      {showAuthModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close dialog"
            onClick={close}
            className="absolute inset-0 h-full w-full cursor-default bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.2 }}
            className="relative z-10 w-full max-w-md rounded-3xl border border-border/60 bg-card/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-5" />
            </button>

            {/* Header */}
            <div className="flex flex-col items-center text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                <ShieldCheck className="size-8" />
              </div>
              <h2 id="auth-modal-title" className="mt-4 text-2xl font-semibold tracking-tight text-balance">
                Login Required
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                Please login or create an account to unlock all InterviewIQ features.
              </p>
            </div>

            {/* Features */}
            <ul className="mt-6 grid gap-3">
              {features.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 px-4 py-3"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-sm font-medium">{label}</span>
                </li>
              ))}
            </ul>

            {/* Buttons */}
            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={() => {setShowAuthModal(false); navigate("/auth");}}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:from-emerald-500 hover:to-emerald-400 hover:shadow-md active:scale-[0.98]"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => router.push("/auth?mode=register")}onClick={() => { setShowAuthModal(false);navigate("/auth");}}className="w-full rounded-xl border border-emerald-500 bg-card px-4 py-3 text-sm font-semibold text-emerald-600 transition-all hover:bg-emerald-50 active:scale-[0.98] dark:text-emerald-400 dark:hover:bg-emerald-500/10"
              >
                Create Account
              </button>
            </div>

            {/* Maybe later */}
            <button
              type="button"
              onClick={close}
              className="mx-auto mt-4 block text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Maybe Later
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
