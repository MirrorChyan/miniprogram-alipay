export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).length === 1 ? '0' + String(date.getMonth() + 1) : String(date.getMonth() + 1);
  const day = String(date.getDate()).length === 1 ? '0' + String(date.getDate()) : String(date.getDate());
  const hours = String(date.getHours()).length === 1 ? '0' + String(date.getHours()) : String(date.getHours());
  const minutes = String(date.getMinutes()).length === 1 ? '0' + String(date.getMinutes()) : String(date.getMinutes());
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function getRemainingTimeText(expiredTime: number): string {
  const now = Date.now();
  const diff = expiredTime - now;

  if (diff <= 0) {
    return '已过期';
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}天${hours}小时`;
  } else if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  } else {
    return `${minutes}分钟`;
  }
} 