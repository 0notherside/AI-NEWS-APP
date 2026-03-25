export interface Reminder {
  id: string
  /** Local calendar day `YYYY-MM-DD` */
  dateKey: string
  /** 24h `HH:mm` */
  time: string
  /** Related article or resource URL */
  link: string
  /** AI news headline, tool, or topic to follow up on */
  topic: string
  description: string
}
