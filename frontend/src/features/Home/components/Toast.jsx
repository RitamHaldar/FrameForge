import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { removeToast } from '../slices/toastSlice';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastItem = ({ id, message, type = 'info', duration = 4500 }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(removeToast(id));
        }, duration);
        return () => clearTimeout(timer);
    }, [id, duration, dispatch]);

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
        error: <AlertCircle className="w-5 h-5 text-rose-400" />,
        info: <Info className="w-5 h-5 text-blue-400" />
    };

    const borderColors = {
        success: 'border-emerald-500/30',
        error: 'border-rose-500/30',
        info: 'border-blue-500/30'
    };

    const bgGlow = {
        success: 'bg-emerald-500/10',
        error: 'bg-rose-500/10',
        info: 'bg-blue-500/10'
    };

    const barColors = {
        success: 'bg-emerald-400',
        error: 'bg-rose-400',
        info: 'bg-blue-400'
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 50, scale: 0.95, filter: 'blur(4px)' }}
            animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 20, scale: 0.95, filter: 'blur(4px)' }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`relative w-80 mb-3 overflow-hidden rounded-xl border ${borderColors[type]} bg-surface/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] ${bgGlow[type]} group`}
        >
            <div className="p-4 flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                    {icons[type] || icons.info}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface leading-snug">
                        {message}
                    </p>
                </div>
                <button
                    onClick={() => dispatch(removeToast(id))}
                    className="shrink-0 p-1 rounded-md text-on-surface/50 hover:text-on-surface hover:bg-surface-variant/50 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Timer Bar */}
            <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: duration / 1000, ease: "linear" }}
                style={{ originX: 0 }}
                className={`absolute bottom-0 left-0 right-0 h-1 ${barColors[type]}`}
            />
        </motion.div>
    );
};

export default function Toast() {
    const messages = useSelector((state) => state.toast.messages);

    return (
        <div className="fixed top-6 right-6 z-[100] flex flex-col items-end pointer-events-none">
            <div className="pointer-events-auto">
                <AnimatePresence>
                    {messages.map((toast) => (
                        <ToastItem key={toast.id} {...toast} />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
