// import { createFileRoute, Link } from "@tanstack/react-router";
// import {
//   ArrowRight,
//   BadgeCheck,
//   Building2,
//   CalendarDays,
//   CheckCircle2,
//   Clock3,
//   Mail,
//   MapPin,
//   MessageCircle,
//   Phone,
//   Send,
//   Shield,
//   Users,
// } from "lucide-react";

// import { Badge } from "#/components/ui/badge";
// import { buttonVariants } from "#/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "#/components/ui/card";

// export const Route = createFileRoute("/hajj-umrah/contact")({
//   component: HajjUmrahContactPage,
// });

// const contactMethods = [
//   {
//     title: "Call our team",
//     description:
//       "Best for urgent travel questions, package comparisons, and quick clarification before booking.",
//     value: "+91 90000 00000",
//     href: "tel:+919000000000",
//     icon: Phone,
//   },
//   {
//     title: "WhatsApp us",
//     description:
//       "Best for fast follow-up, document questions, and family or group inquiries.",
//     value: "Chat on WhatsApp",
//     href: "https://wa.me/919000000000",
//     icon: MessageCircle,
//   },
//   {
//     title: "Email us",
//     description:
//       "Best for detailed requests, document sharing, and non-urgent queries.",
//     value: "support@yourdomain.com",
//     href: "mailto:support@yourdomain.com",
//     icon: Mail,
//   },
// ];

// const officeDetails = [
//   {
//     label: "Office address",
//     value: "Bhuj, Gujarat, India",
//     icon: MapPin,
//   },
//   {
//     label: "Working hours",
//     value: "Mon - Sat, 10:00 AM to 7:00 PM",
//     icon: Clock3,
//   },
//   {
//     label: "Average response time",
//     value: "Within 2 to 6 business hours",
//     icon: BadgeCheck,
//   },
//   {
//     label: "Primary support",
//     value: "Hajj, Umrah, Ramadan & custom family groups",
//     icon: Users,
//   },
// ];

// const inquiryTips = [
//   "Mention whether you need Hajj, Umrah, Ramadan Umrah, or a custom family/group plan.",
//   "Share your preferred travel month and departure city.",
//   "Tell us your approximate group size, especially if elders or children are travelling.",
//   "Mention whether you want economy, standard, premium, or custom support.",
// ];

// const faqPreview = [
//   {
//     question: "How soon will someone contact me?",
//     answer:
//       "We usually respond within business hours, and urgent WhatsApp or phone inquiries are generally handled fastest.",
//   },
//   {
//     question: "Can I ask about visa guidance here?",
//     answer:
//       "Yes. You can contact us for practical guidance on visa pathways, documents, and what official details you should confirm before submission.",
//   },
//   {
//     question: "Can I inquire for my whole family or group?",
//     answer:
//       "Yes. Family and group inquiries are encouraged, especially when elders, women-only groups, or custom travel needs are involved.",
//   },
// ];

// function HajjUmrahContactPage() {
//   return (
//     <main className="bg-[#faf9f6]">
//       {/* Hero */}
//       <section className="relative overflow-hidden border-b">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(180,130,40,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(18,63,69,0.08),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.96),rgba(248,250,252,0.94))]" />
//         <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
//           <div className="max-w-3xl">
//             <Badge
//               variant="outline"
//               className="mb-4 border-amber-200 bg-amber-50 text-amber-700"
//             >
//               Contact Us
//             </Badge>

//             <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
//               Speak with our team about your pilgrimage plans.
//             </h1>

//             <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
//               Whether you are comparing packages, asking about visa guidance, or
//               planning travel for your family or community group, we are here to
//               help you understand the next step with clarity.
//             </p>

//             <div className="mt-6 flex flex-wrap gap-3">
//               <a
//                 href="tel:+919000000000"
//                 className={buttonVariants({
//                   className: "bg-slate-900 text-white hover:bg-slate-800",
//                 })}
//               >
//                 <Phone className="mr-2 size-4" />
//                 Call now
//               </a>

//               <a
//                 href="https://wa.me/919000000000"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className={buttonVariants({
//                   variant: "outline",
//                   className:
//                     "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
//                 })}
//               >
//                 <MessageCircle className="mr-2 size-4" />
//                 WhatsApp us
//               </a>
//             </div>

//             <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 shadow-sm">
//               <div className="flex items-start gap-3">
//                 <Shield className="mt-0.5 size-5 shrink-0 text-amber-700" />
//                 <p className="text-sm leading-7 text-slate-700">
//                   Tourism contact pages convert better when they make contact methods
//                   obvious, clickable, and human, especially on mobile devices. [web:214][web:217][web:216]
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Contact methods */}
//       <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//         <div className="grid gap-4 md:grid-cols-3">
//           {contactMethods.map((item) => {
//             const Icon = item.icon;

//             return (
//               <a
//                 key={item.title}
//                 href={item.href}
//                 target={item.href.startsWith("https://") ? "_blank" : undefined}
//                 rel={
//                   item.href.startsWith("https://")
//                     ? "noopener noreferrer"
//                     : undefined
//                 }
//                 className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
//               >
//                 <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
//                   <Icon className="size-5" />
//                 </div>
//                 <p className="text-base font-semibold text-slate-900">{item.title}</p>
//                 <p className="mt-2 text-sm leading-6 text-slate-600">
//                   {item.description}
//                 </p>
//                 <p className="mt-4 text-sm font-medium text-amber-700">{item.value}</p>
//               </a>
//             );
//           })}
//         </div>
//       </section>

//       {/* Form + office details */}
//       <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
//         <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
//           <Card className="rounded-2xl border-border/60 bg-white shadow-sm">
//             <CardHeader>
//               <CardTitle className="text-2xl text-slate-900">
//                 Send us an inquiry
//               </CardTitle>
//               <CardDescription className="text-sm leading-6 text-slate-600">
//                 Keep the form short and practical. Travel websites perform better
//                 when inquiry forms are simple, easy to complete, and clearly connected
//                 to the next step. [web:214][web:140]
//               </CardDescription>
//             </CardHeader>

//             <CardContent>
//               <form className="grid gap-4 md:grid-cols-2">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-slate-900">
//                     Full name
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="Your full name"
//                     className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-slate-400"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-slate-900">
//                     Phone number
//                   </label>
//                   <input
//                     type="tel"
//                     placeholder="+91 9xxxx xxxxx"
//                     className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-slate-400"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-slate-900">
//                     Email address
//                   </label>
//                   <input
//                     type="email"
//                     placeholder="you@example.com"
//                     className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-slate-400"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-slate-900">
//                     Inquiry type
//                   </label>
//                   <select className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-slate-400">
//                     <option>Hajj</option>
//                     <option>Umrah</option>
//                     <option>Ramadan Umrah</option>
//                     <option>Custom family/group</option>
//                     <option>Visa guidance</option>
//                     <option>General question</option>
//                   </select>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-slate-900">
//                     Preferred month
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="e.g. December 2026"
//                     className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-slate-400"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-slate-900">
//                     Departure city
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="e.g. Ahmedabad"
//                     className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-slate-400"
//                   />
//                 </div>

//                 <div className="space-y-2 md:col-span-2">
//                   <label className="text-sm font-medium text-slate-900">
//                     Message
//                   </label>
//                   <textarea
//                     rows={6}
//                     placeholder="Tell us about your plan, group size, budget range, and any special needs."
//                     className="w-full rounded-xl border border-input bg-background px-3 py-3 text-sm outline-none focus:border-slate-400"
//                   />
//                 </div>

//                 <div className="md:col-span-2">
//                   <button
//                     type="submit"
//                     className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
//                   >
//                     <Send className="mr-2 size-4" />
//                     Send inquiry
//                   </button>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>

//           <div className="space-y-6">
//             <Card className="rounded-2xl border-border/60 bg-white shadow-sm">
//               <CardHeader>
//                 <CardTitle className="text-2xl text-slate-900">
//                   Office details
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {officeDetails.map((item) => {
//                   const Icon = item.icon;

//                   return (
//                     <div
//                       key={item.label}
//                       className="flex items-start gap-3 rounded-xl bg-slate-50 p-4"
//                     >
//                       <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
//                         <Icon className="size-4" />
//                       </div>
//                       <div>
//                         <p className="text-xs text-slate-500">{item.label}</p>
//                         <p className="text-sm font-medium leading-6 text-slate-800">
//                           {item.value}
//                         </p>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </CardContent>
//             </Card>

//             <Card className="rounded-2xl border-border/60 bg-slate-900 text-white shadow-sm">
//               <CardHeader>
//                 <CardTitle className="text-2xl">What to include in your message</CardTitle>
//                 <CardDescription className="text-slate-300">
//                   Clear inquiries help us guide you faster and better.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 {inquiryTips.map((item) => (
//                   <div key={item} className="flex items-start gap-3">
//                     <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber-300" />
//                     <p className="text-sm leading-7 text-white/80">{item}</p>
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* Map + reassurance */}
//       <section className="border-y bg-[#f4efe6]/60">
//         <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
//           <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
//             <Card className="overflow-hidden rounded-2xl border-border/60 bg-white shadow-sm">
//               <div className="aspect-[16/9] w-full">
//                 <iframe
//                   title="Office location"
//                   src="https://www.google.com/maps?q=Bhuj%2C%20Gujarat%2C%20India&z=12&output=embed"
//                   className="h-full w-full border-0"
//                   loading="lazy"
//                   referrerPolicy="no-referrer-when-downgrade"
//                 />
//               </div>
//             </Card>

//             <Card className="rounded-2xl border-amber-100 bg-amber-50/70 shadow-sm">
//               <CardHeader>
//                 <CardTitle className="text-2xl text-slate-900">
//                   Why this page is structured this way
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex items-start gap-3">
//                   <Building2 className="mt-0.5 size-4 shrink-0 text-amber-700" />
//                   <p className="text-sm leading-7 text-slate-700">
//                     Tourism contact pages should show a real business presence, not
//                     just a form hidden at the bottom of the site. [web:214][web:217]
//                   </p>
//                 </div>
//                 <div className="flex items-start gap-3">
//                   <MessageCircle className="mt-0.5 size-4 shrink-0 text-amber-700" />
//                   <p className="text-sm leading-7 text-slate-700">
//                     WhatsApp is valuable because many travel users prefer instant,
//                     familiar communication over formal email. [web:214][web:216]
//                   </p>
//                 </div>
//                 <div className="flex items-start gap-3">
//                   <CalendarDays className="mt-0.5 size-4 shrink-0 text-amber-700" />
//                   <p className="text-sm leading-7 text-slate-700">
//                     Response-time expectations and practical office details reduce
//                     uncertainty and encourage more inquiries. [web:214]
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* FAQ preview */}
//       <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
//         <div className="mb-8 max-w-2xl">
//           <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
//             Before you contact us
//           </p>
//           <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
//             Common contact-related questions.
//           </h2>
//         </div>

//         <div className="grid gap-4 md:grid-cols-3">
//           {faqPreview.map((item) => (
//             <div
//               key={item.question}
//               className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm"
//             >
//               <p className="text-sm font-semibold text-slate-900">
//                 {item.question}
//               </p>
//               <p className="mt-3 text-sm leading-7 text-slate-600">
//                 {item.answer}
//               </p>
//             </div>
//           ))}
//         </div>

//         <div className="mt-6">
//           <Link
//             to="/hajj-umrah/faq"
//             className={buttonVariants({
//               variant: "outline",
//               className:
//                 "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
//             })}
//           >
//             Read full FAQ
//             <ArrowRight className="ml-2 size-4" />
//           </Link>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="border-t bg-[#6f5516]">
//         <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
//           <div className="max-w-2xl text-white">
//             <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
//               Start with a conversation
//             </p>
//             <h2 className="mt-2 text-2xl font-bold tracking-tight">
//               Tell us what kind of pilgrimage you are planning.
//             </h2>
//             <p className="mt-3 text-sm leading-7 text-amber-100/80">
//               We’ll help you compare options, understand the process, and move
//               toward the right package with confidence.
//             </p>
//           </div>

//           <div className="flex flex-wrap gap-3">
//             <Link
//               to="/hajj-umrah/packages"
//               className={buttonVariants({
//                 className: "bg-white text-slate-900 hover:bg-amber-50",
//               })}
//             >
//               Explore packages
//             </Link>

//             <a
//               href="https://wa.me/919000000000"
//               target="_blank"
//               rel="noopener noreferrer"
//               className={buttonVariants({
//                 variant: "outline",
//                 className:
//                   "border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white",
//               })}
//             >
//               <MessageCircle className="mr-2 size-4" />
//               WhatsApp us
//             </a>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Shield,
} from "lucide-react";

import { Badge } from "#/components/ui/badge";
import { buttonVariants } from "#/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";

const contactSearchSchema = z.object({
  intent: z.string().optional(),
  source: z.string().optional(),
  package: z.string().optional(),
});

export const Route = createFileRoute("/hajj-umrah/contact")({
  validateSearch: contactSearchSchema,
  component: HajjUmrahContactPage,
});

const contactMethods = [
  {
    title: "Call our team",
    description:
      "Best for urgent travel questions, package comparisons, and quick clarification before booking.",
    value: "+91 90000 00000",
    href: "tel:+919000000000",
    icon: Phone,
  },
  {
    title: "WhatsApp us",
    description:
      "Best for fast follow-up, document questions, and family or group inquiries.",
    value: "Chat on WhatsApp",
    href: "https://wa.me/919000000000",
    icon: MessageCircle,
  },
  {
    title: "Email us",
    description:
      "Best for detailed requests, document sharing, and non-urgent queries.",
    value: "support@yourdomain.com",
    href: "mailto:support@yourdomain.com",
    icon: Mail,
  },
];

const officeDetails = [
  {
    label: "Office address",
    value: "Bhuj, Gujarat, India",
    icon: MapPin,
  },
  {
    label: "Working hours",
    value: "Mon - Sat, 10:00 AM to 7:00 PM",
    icon: Clock3,
  },
  {
    label: "Average response time",
    value: "Within 2 to 6 business hours",
    icon: BadgeCheck,
  },
  {
    label: "Primary support",
    value: "Hajj, Umrah, Ramadan & custom family groups",
    icon: Users,
  },
];

const inquiryTips = [
  "Mention whether you need Hajj, Umrah, Ramadan Umrah, or a custom family/group plan.",
  "Share your preferred travel month and departure city.",
  "Tell us your approximate group size, especially if elders or children are travelling.",
  "Mention whether you want economy, standard, premium, or custom support.",
];

const faqPreview = [
  {
    question: "How soon will someone contact me?",
    answer:
      "We usually respond within business hours, and urgent WhatsApp or phone inquiries are generally handled fastest.",
  },
  {
    question: "Can I ask about visa guidance here?",
    answer:
      "Yes. You can contact us for practical guidance on visa pathways, documents, and what official details you should confirm before submission.",
  },
  {
    question: "Can I inquire for my whole family or group?",
    answer:
      "Yes. Family and group inquiries are encouraged, especially when elders, women-only groups, or custom travel needs are involved.",
  },
];

function HajjUmrahContactPage() {
  const search = Route.useSearch();

  const isNavbarEnquiry =
    search.intent === "enquiry" && search.source === "navbar";

  const defaultInquiryType =
    search.intent === "enquiry" ? "General question" : "Hajj";

  return (
    <main className="bg-[#faf9f6]">
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(180,130,40,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(18,63,69,0.08),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.96),rgba(248,250,252,0.94))]" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <div className="max-w-3xl">
            <Badge
              variant="outline"
              className="mb-4 border-amber-200 bg-amber-50 text-amber-700"
            >
              Contact Us
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Speak with our team about your pilgrimage plans.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Whether you are comparing packages, asking about visa guidance, or
              planning travel for your family or community group, we are here to
              help you understand the next step with clarity.
            </p>

            {isNavbarEnquiry ? (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <p className="text-sm font-medium text-emerald-800">
                  You’re starting a new enquiry. Share your travel plan below and
                  our team will guide you to the right package.
                </p>
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="tel:+919000000000"
                className={buttonVariants({
                  className: "bg-slate-900 text-white hover:bg-slate-800",
                })}
              >
                <Phone className="mr-2 size-4" />
                Call now
              </a>

              <a
                href="https://wa.me/919000000000"
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({
                  variant: "outline",
                  className:
                    "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
                })}
              >
                <MessageCircle className="mr-2 size-4" />
                WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {contactMethods.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.title}
                href={item.href}
                target={item.href.startsWith("https://") ? "_blank" : undefined}
                rel={
                  item.href.startsWith("https://")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                  <Icon className="size-5" />
                </div>
                <p className="text-base font-semibold text-slate-900">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
                <p className="mt-4 text-sm font-medium text-amber-700">{item.value}</p>
              </a>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="rounded-2xl border-border/60 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900">
                Send us an inquiry
              </CardTitle>
              <CardDescription className="text-sm leading-6 text-slate-600">
                Keep the form short and practical so it is easy to complete and
                clearly connected to the next step.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">
                    Full name
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 9xxxx xxxxx"
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">
                    Email address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">
                    Inquiry type
                  </label>
                  <select
                    defaultValue={defaultInquiryType}
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-slate-400"
                  >
                    <option>Hajj</option>
                    <option>Umrah</option>
                    <option>Ramadan Umrah</option>
                    <option>Custom family/group</option>
                    <option>Visa guidance</option>
                    <option>General question</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">
                    Preferred month
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. December 2026"
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">
                    Departure city
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ahmedabad"
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-slate-400"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-900">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Tell us about your plan, group size, budget range, and any special needs."
                    className="w-full rounded-xl border border-input bg-background px-3 py-3 text-sm outline-none focus:border-slate-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                  >
                    <Send className="mr-2 size-4" />
                    Send inquiry
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-2xl border-border/60 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900">
                  Office details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {officeDetails.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="flex items-start gap-3 rounded-xl bg-slate-50 p-4"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">{item.label}</p>
                        <p className="text-sm font-medium leading-6 text-slate-800">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/60 bg-slate-900 text-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">What to include in your message</CardTitle>
                <CardDescription className="text-slate-300">
                  Clear inquiries help us guide you faster and better.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {inquiryTips.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber-300" />
                    <p className="text-sm leading-7 text-white/80">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-y bg-[#f4efe6]/60">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <Card className="overflow-hidden rounded-2xl border-border/60 bg-white shadow-sm">
              <div className="aspect-[16/9] w-full">
                <iframe
                  title="Office location"
                  src="https://www.google.com/maps?q=Bhuj%2C%20Gujarat%2C%20India&z=12&output=embed"
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Card>

            <Card className="rounded-2xl border-amber-100 bg-amber-50/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900">
                  Why this page is structured this way
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building2 className="mt-0.5 size-4 shrink-0 text-amber-700" />
                  <p className="text-sm leading-7 text-slate-700">
                    Showing clear contact methods and office details helps reduce friction and makes the page feel more trustworthy. [web:214][web:244]
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <MessageCircle className="mt-0.5 size-4 shrink-0 text-amber-700" />
                  <p className="text-sm leading-7 text-slate-700">
                    WhatsApp and direct-contact options are especially useful for travel users who prefer fast, familiar communication. [web:216][web:214]
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 size-4 shrink-0 text-amber-700" />
                  <p className="text-sm leading-7 text-slate-700">
                    A clear CTA and short form reduce decision friction and support better conversion. [web:263][web:260]
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            Before you contact us
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Common contact-related questions.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {faqPreview.map((item) => (
            <div
              key={item.question}
              className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-semibold text-slate-900">
                {item.question}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {item.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Link
            to="/hajj-umrah/faq"
            className={buttonVariants({
              variant: "outline",
              className:
                "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
            })}
          >
            Read full FAQ
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
      </section>

      <section className="border-t bg-[#6f5516]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
              Start with a conversation
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Tell us what kind of pilgrimage you are planning.
            </h2>
            <p className="mt-3 text-sm leading-7 text-amber-100/80">
              We’ll help you compare options, understand the process, and move
              toward the right package with confidence.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/hajj-umrah/packages"
              className={buttonVariants({
                className: "bg-white text-slate-900 hover:bg-amber-50",
              })}
            >
              Explore packages
            </Link>

            <a
              href="https://wa.me/919000000000"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({
                variant: "outline",
                className:
                  "border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white",
              })}
            >
              <MessageCircle className="mr-2 size-4" />
              WhatsApp us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}