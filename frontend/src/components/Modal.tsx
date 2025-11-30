import { motion, AnimatePresence } from "framer-motion";

function Modal({ show, message, onClose, children }) {
return (
<AnimatePresence>
{show && (
<motion.div
className="modal-backdrop"
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
>
<motion.div
className="modal-content"
initial={{ scale: 0.9, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
exit={{ scale: 0.9, opacity: 0 }}
>
{message && <p className="modal-message">{message}</p>}

{children && <div className="modal-actions">{children}</div>}

<button className="modal-close" onClick={onClose}>
Close
</button>
</motion.div>
</motion.div>
)}
</AnimatePresence>
);
}

export default Modal;