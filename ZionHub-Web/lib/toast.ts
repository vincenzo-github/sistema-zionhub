import { toast as sonnerToast } from 'sonner'

export const toast = {
  success: (title: string, description?: string) => {
    return sonnerToast.success(title, {
      description,
      duration: 4000,
    })
  },

  error: (title: string, description?: string) => {
    return sonnerToast.error(title, {
      description,
      duration: 4000,
    })
  },

  warning: (title: string, description?: string) => {
    return sonnerToast.warning(title, {
      description,
      duration: 4000,
    })
  },

  info: (title: string, description?: string) => {
    return sonnerToast.info(title, {
      description,
      duration: 4000,
    })
  },

  loading: (title: string, description?: string) => {
    return sonnerToast.loading(title, {
      description,
    })
  },

  promise: <T,>(
    promise: Promise<T>,
    options: {
      loading: string
      success: string
      error: string
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading: options.loading,
      success: options.success,
      error: options.error,
    })
  },
}
