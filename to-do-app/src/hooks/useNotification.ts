import toast from 'react-hot-toast';

export const useNotification = () => {
  const showSuccess = (message: string, options?: any) => {
    return toast.success(message, {
      duration: 4000,
      style: {
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        padding: '16px 20px',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: '0 10px 25px rgba(16, 185, 129, 0.25)',
        minWidth: '300px',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10b981',
      },
      ...options,
    });
  };

  const showError = (message: string, options?: any) => {
    return toast.error(message, {
      duration: 5000,
      style: {
        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        padding: '16px 20px',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: '0 10px 25px rgba(239, 68, 68, 0.25)',
        minWidth: '300px',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#ef4444',
      },
      ...options,
    });
  };

  const showLoading = (message: string, options?: any) => {
    return toast.loading(message, {
      style: {
        background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        padding: '16px 20px',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: '0 10px 25px rgba(59, 130, 246, 0.25)',
        minWidth: '300px',
      },
      ...options,
    });
  };

  const showInfo = (message: string, options?: any) => {
    return toast(message, {
      duration: 4000,
      style: {
        background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        padding: '16px 20px',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: '0 10px 25px rgba(14, 165, 233, 0.25)',
        minWidth: '300px',
      },
      icon: 'ℹ️',
      ...options,
    });
  };

  const showWarning = (message: string, options?: any) => {
    return toast(message, {
      duration: 4500,
      style: {
        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        padding: '16px 20px',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: '0 10px 25px rgba(245, 158, 11, 0.25)',
        minWidth: '300px',
      },
      icon: '⚠️',
      ...options,
    });
  };

  const dismissToast = (toastId: string) => {
    toast.dismiss(toastId);
  };

  const dismissAll = () => {
    toast.dismiss();
  };

  // Función para mostrar notificación con promesa (útil para operaciones async)
  const showPromise = (
    promise: Promise<any>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    options?: any
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        style: {
          borderRadius: '12px',
          padding: '16px 20px',
          fontSize: '14px',
          fontWeight: '600',
          minWidth: '300px',
        },
        success: {
          style: {
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff',
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.25)',
          },
        },
        error: {
          style: {
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: '#fff',
            boxShadow: '0 10px 25px rgba(239, 68, 68, 0.25)',
          },
        },
        loading: {
          style: {
            background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
            color: '#fff',
            boxShadow: '0 10px 25px rgba(59, 130, 246, 0.25)',
          },
        },
        ...options,
      }
    );
  };

  return {
    showSuccess,
    showError,
    showLoading,
    showInfo,
    showWarning,
    showPromise,
    dismissToast,
    dismissAll,
  };
};

export default useNotification;
