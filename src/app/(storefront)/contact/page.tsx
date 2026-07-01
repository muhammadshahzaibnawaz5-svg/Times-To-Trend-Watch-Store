'use client';
import { useState, useTransition } from 'react';
import { Mail, Phone, MapPin, Clock, ChevronDown, MessageCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Breadcrumbs } from '@/components/storefront/breadcrumbs';
import { toast } from 'sonner';
import { sendContactEmail } from '@/actions/contact-actions';
const CONTACT_INFO = [
  {
    icon: Mail,
    title: 'Email Us',
    content: 'info@timestotrend.com',
    href: 'mailto:info@timestotrend.com',
  },
  { icon: Phone, title: 'Call Us', content: '+92 300 1234567', href: 'tel:+923001234567' },
  { icon: MapPin, title: 'Visit Us', content: '123 Watch Avenue, Saddar, Karachi, Pakistan' },
  { icon: Clock, title: 'Business Hours', content: 'Mon \u2013 Sat: 10:00 AM \u2013 8:00 PM' },
] as const;
const FAQ_ITEMS = [
  {
    question: 'What is your return policy?',
    answer:
      'We offer a 30-day return policy on all unworn watches in their original packaging. Please contact our support team to initiate a return.',
  },
  {
    question: 'How long does shipping take?',
    answer:
      'Domestic orders are typically delivered within 3\u20135 business days. International shipping may take 7\u201314 business days depending on the destination.',
  },
  {
    question: 'Do you offer warranty on watches?',
    answer:
      'Yes, all our watches come with a 1-year international warranty against manufacturing defects.',
  },
  {
    question: 'Can I track my order?',
    answer: 'Once your order is dispatched, you will receive a tracking number via email.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit/debit cards, bank transfers, and cash on delivery (COD) for select locations.',
  },
] as const;
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isPending, startTransition] = useTransition();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    startTransition(async () => {
      const fd = new FormData();
      fd.set('name', formData.name);
      fd.set('email', formData.email);
      fd.set('phone', formData.phone);
      fd.set('subject', formData.subject);
      fd.set('message', formData.message);
      const result = await sendContactEmail(fd);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Thank you! Your message has been sent. Our team will contact you shortly.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    });
  }
  return (
    <main>
      {' '}
      <section className="bg-muted/40 border-b">
        {' '}
        <div className="container mx-auto px-4 py-14 md:py-18">
          {' '}
          <Breadcrumbs items={[{ label: 'Contact Us' }]} />{' '}
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.24em] uppercase">
            Support
          </p>{' '}
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            We Are Here To Help You
          </h1>{' '}
          <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-7">
            {' '}
            Get in touch with our team for watch recommendations, order support, or styling
            guidance.{' '}
          </p>{' '}
        </div>{' '}
      </section>{' '}
      <section className="container mx-auto px-4 py-12 md:py-16">
        {' '}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {' '}
          {CONTACT_INFO.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.title}
                className="group border-border/60 bg-card hover:border-foreground/20 cursor-pointer rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {' '}
                <CardContent className="flex flex-col p-6 md:p-6">
                  {' '}
                  <div className="border-border bg-muted/50 group-hover:bg-foreground group-hover:text-background mb-4 flex h-12 w-12 items-center justify-center rounded-full border transition-colors duration-300">
                    {' '}
                    <Icon className="h-5 w-5 transition-colors duration-300" />{' '}
                  </div>{' '}
                  <h3 className="text-foreground mb-1 text-sm font-semibold">{item.title}</h3>{' '}
                  {'href' in item ? (
                    <a
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {' '}
                      {item.content}{' '}
                    </a>
                  ) : (
                    <div className="text-muted-foreground text-sm">{item.content}</div>
                  )}{' '}
                </CardContent>{' '}
              </Card>
            );
          })}{' '}
        </div>{' '}
      </section>{' '}
      <Separator className="container mx-auto" />{' '}
      <section className="container mx-auto grid gap-12 px-4 py-12 lg:grid-cols-[1fr_0.85fr] lg:py-16">
        {' '}
        <div className="border-border/60 bg-card rounded-xl border p-6 shadow-sm transition-all duration-300 hover:shadow-lg md:p-8 cursor-pointer">
          {' '}
          <div className="flex items-center gap-3">
            {' '}
            <span className="bg-foreground/20 inline-block h-6 w-0.5 rounded-full" />{' '}
            <p className="text-label text-muted-foreground">Get In Touch</p>{' '}
          </div>{' '}
          <h2
            className="mt-4 text-3xl font-black tracking-tight md:text-4xl"
            style={{ fontFamily: "'Brandon Grotesque Regular', sans-serif" }}
          >
            {' '}
            Send Us a Message{' '}
          </h2>{' '}
          <p className="text-muted-foreground mt-3 text-sm leading-6">
            {' '}
            Fill out the form below and we will get back to you within 24 hours.{' '}
          </p>{' '}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {' '}
            <div className="grid gap-5 sm:grid-cols-2">
              {' '}
              <div className="space-y-2">
                {' '}
                <Label
                  htmlFor="name"
                  className="text-foreground text-xs font-semibold tracking-[0.12em] uppercase"
                >
                  Name *
                </Label>{' '}
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  className="border-border/60 bg-background/30 placeholder:text-muted-foreground/50 focus:border-foreground/30 focus:bg-background transition-all duration-200"
                />{' '}
              </div>{' '}
              <div className="space-y-2">
                {' '}
                <Label
                  htmlFor="email"
                  className="text-foreground text-xs font-semibold tracking-[0.12em] uppercase"
                >
                  Email *
                </Label>{' '}
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="border-border/60 bg-background/30 placeholder:text-muted-foreground/50 focus:border-foreground/30 focus:bg-background transition-all duration-200"
                />{' '}
              </div>{' '}
            </div>{' '}
            <div className="grid gap-5 sm:grid-cols-2">
              {' '}
              <div className="space-y-2">
                {' '}
                <Label
                  htmlFor="phone"
                  className="text-foreground text-xs font-semibold tracking-[0.12em] uppercase"
                >
                  Phone *
                </Label>{' '}
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+92 300 1234567"
                  required
                  className="border-border/60 bg-background/30 placeholder:text-muted-foreground/50 focus:border-foreground/30 focus:bg-background transition-all duration-200"
                />{' '}
              </div>{' '}
              <div className="space-y-2">
                {' '}
                <Label
                  htmlFor="subject"
                  className="text-foreground text-xs font-semibold tracking-[0.12em] uppercase"
                >
                  Subject
                </Label>{' '}
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className="border-border/60 bg-background/30 placeholder:text-muted-foreground/50 focus:border-foreground/30 focus:bg-background transition-all duration-200"
                />{' '}
              </div>{' '}
            </div>{' '}
            <div className="space-y-2">
              {' '}
              <Label
                htmlFor="message"
                className="text-foreground text-xs font-semibold tracking-[0.12em] uppercase"
              >
                Message *
              </Label>{' '}
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us more about your inquiry..."
                rows={6}
                required
                className="border-border/60 bg-background/30 placeholder:text-muted-foreground/50 focus:border-foreground/30 focus:bg-background transition-all duration-200"
              />{' '}
            </div>{' '}
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full text-xs font-bold tracking-[0.16em] uppercase transition-all duration-300 hover:shadow-lg md:w-auto"
              disabled={isPending}
            >
              {' '}
              {isPending ? 'Sending...' : 'Send Message'}{' '}
            </Button>{' '}
          </form>{' '}
        </div>{' '}
        <div className="space-y-8">
          {' '}
          <div>
            {' '}
            <div className="flex items-center gap-3">
              {' '}
              <span className="bg-foreground/20 inline-block h-6 w-0.5 rounded-full" />{' '}
              <p className="text-label text-muted-foreground">Quick Answers</p>{' '}
            </div>{' '}
            <h2
              className="mt-4 text-3xl font-black tracking-tight md:text-4xl"
              style={{ fontFamily: "'Brandon Grotesque Regular', sans-serif" }}
            >
              {' '}
              Frequently Asked Questions{' '}
            </h2>{' '}
            <p className="text-muted-foreground mt-3 text-sm leading-6">
              {' '}
              Quick answers to common questions about our store and services.{' '}
            </p>{' '}
            <div className="mt-8 space-y-3">
              {' '}
              {FAQ_ITEMS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="group border-border/60 bg-card hover:border-foreground/20 overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer"
                  >
                    {' '}
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className={cn(
                        'text-foreground flex w-full cursor-pointer items-center justify-between px-5 py-4 text-left text-sm font-medium transition-colors duration-200 md:px-6 md:py-5',
                        isOpen && 'text-foreground',
                      )}
                    >
                      {' '}
                      <span className="pr-4">{faq.question}</span>{' '}
                      <ChevronDown
                        className={cn(
                          'text-muted-foreground h-4 w-4 shrink-0 transition-transform duration-300',
                          isOpen && 'rotate-180',
                        )}
                      />{' '}
                    </button>{' '}
                    <div
                      className={cn(
                        'grid transition-all duration-300 ease-in-out',
                        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                      )}
                    >
                      {' '}
                      <div className="overflow-hidden">
                        {' '}
                        <div className="border-border/60 text-muted-foreground border-t px-5 py-4 text-sm leading-6 md:px-6 md:py-5">
                          {' '}
                          {faq.answer}{' '}
                        </div>{' '}
                      </div>{' '}
                    </div>{' '}
                  </div>
                );
              })}{' '}
            </div>{' '}
          </div>{' '}
        </div>{' '}
      </section>{' '}
      <section className="container mx-auto px-4 pb-16 md:pb-20">
        {' '}
        <div className="border-border/60 bg-card mx-auto max-w-lg rounded-xl border p-8 text-center shadow-sm transition-all duration-300 hover:shadow-lg md:p-10 cursor-pointer">
          {' '}
          <div className="border-border bg-muted/50 mx-auto flex h-12 w-12 items-center justify-center rounded-full border transition-colors duration-300">
            {' '}
            <MessageCircle className="h-5 w-5 text-green-500" />{' '}
          </div>{' '}
          <p className="text-muted-foreground mt-4 text-xs font-semibold tracking-[0.24em] uppercase">
            {' '}
            Need Quick Help?{' '}
          </p>{' '}
          <h3
            className="mt-2 text-2xl font-black tracking-tight md:text-3xl"
            style={{ fontFamily: "'Brandon Grotesque Regular', sans-serif" }}
          >
            {' '}
            Chat with us on WhatsApp.{' '}
          </h3>{' '}
          <p className="text-muted-foreground mt-3 text-sm leading-6">
            {' '}
            We typically respond within minutes and can assist with sizing, stock availability,
            delivery, and payment queries.{' '}
          </p>{' '}
          <a
            href="https://wa.me/923240034524"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-6 inline-flex h-12 items-center gap-3 rounded-full bg-green-600 px-8 text-xs font-bold tracking-[0.18em] text-white uppercase transition-all duration-300 hover:bg-green-700 hover:shadow-lg"
          >
            {' '}
            <MessageCircle className="h-4 w-4" /> Chat on WhatsApp{' '}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />{' '}
          </a>{' '}
        </div>{' '}
      </section>{' '}
    </main>
  );
}
