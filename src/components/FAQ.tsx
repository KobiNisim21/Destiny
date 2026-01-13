import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "כמה זמן לוקח המשלוח?",
    answer: "משלוח רגיל לוקח 3-5 ימי עסקים בישראל. משלוח בינלאומי לוקח בדרך כלל 7-14 ימי עסקים. תקבלו מספר מעקב ברגע שההזמנה תצא!",
  },
  {
    question: "מה מדיניות ההחזרות שלכם?",
    answer: "אנחנו מציעים מדיניות החזרה של 30 יום לכל הפריטים שלא נלבשו, לא נשטפו ועם התגיות עדיין מחוברות. אם אתם לא מרוצים מהרכישה, פנו לצוות התמיכה שלנו כדי להתחיל בהחזרה.",
  },
  {
    question: "איך אני יודע איזה מידה להזמין?",
    answer: "בכל עמוד מוצר יש טבלת מידות מפורטת. אנחנו ממליצים למדוד בגד שמתאים לכם היטב ולהשוות לטבלאות שלנו. אם אתם בין מידות, מומלץ לקחת מידה גדולה יותר לגזרה רפויה יותר.",
  },
  {
    question: "האם המוצרים במהדורה מוגבלת?",
    answer: "הרבה מהפריטים שלנו יוצאים במהדורות מוגבלות וברגע שנגמרים, הם לא חוזרים. אנחנו משיקים קולקציות חדשות באופן קבוע, אז הירשמו לניוזלטר כדי להישאר מעודכנים!",
  },
  {
    question: "איך אני יכול לעקוב אחרי ההזמנה שלי?",
    answer: "ברגע שההזמנה נשלחה, תקבלו מייל עם מספר מעקב. אתם יכולים גם לבדוק את סטטוס ההזמנה בכל עת דרך החשבון שלכם באתר.",
  },
  {
    question: "האם אתם שולחים לחו״ל?",
    answer: "כן! אנחנו שולחים לרוב המדינות בעולם. עלויות המשלוח וזמני האספקה משתנים לפי מיקום ויחושבו בקופה. שימו לב שהזמנות בינלאומיות עשויות להיות כפופות לעמלות מכס.",
  },
];

const FAQ = () => {
  return (
    <section className="py-16 md:py-24" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            שאלות נפוצות
          </h2>
          <p className="text-lg text-muted-foreground">
            כל מה שצריך לדעת על הזמנות, משלוחים והחזרות
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="gradient-card rounded-2xl px-6 shadow-soft border-none animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <AccordionTrigger className="text-right hover:no-underline py-6 text-lg font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact CTA */}
        <div className="text-center mt-12 animate-fade-in">
          <p className="text-muted-foreground mb-4">
            עדיין יש שאלות? אנחנו כאן לעזור!
          </p>
          <Button size="lg" variant="outline" className="border-2 font-semibold hover:bg-muted">
            צרו קשר
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
