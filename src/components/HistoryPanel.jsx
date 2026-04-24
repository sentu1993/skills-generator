import { Clock, Trash2, ExternalLink } from 'lucide-react'

export default function HistoryPanel({ history, onLoadItem, onDeleteItem, onClearHistory, isOpen, onClose }) {
  if (!isOpen) return null

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl z-40 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <h2 className="font-semibold text-gray-900">History</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {history.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No history yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-3 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <button
                    onClick={() => onLoadItem(item)}
                    className="flex-1 text-left"
                  >
                    <h3 className="font-medium text-gray-900 text-sm truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(item.createdAt)}
                    </p>
                  </button>
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onClearHistory}
            className="w-full btn-secondary text-sm"
          >
            Clear All History
          </button>
        </div>
      )}
    </div>
  )
}