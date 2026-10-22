import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Gift,
  MessageCircle,
  Sparkles,
  Users,
  Video,
  Star,
} from "lucide-react";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { WebinarRegistrationForm } from "#/components/common/webinar-registration-form";

export const Route = createFileRoute("/invitation/webinar")({
  component: WebinarPage,
});

declare global {
  interface Window {
    Razorpay: any;
  }
}

const audienceList = [
  "Housewives looking for extra income",
  "Students wanting to earn while studying",
  "Working professionals seeking a second income",
  "People who love travelling",
  "Anyone wanting to start a business from home",
  "Anyone looking for a low-investment business opportunity",
];

const problems = [
  "You want to earn more but don't know where to start.",
  "You don't have enough money to open a business.",
  "You don't want to leave your current job.",
  "You're searching for a genuine work-from-home opportunity.",
  "You think starting a business requires lakhs of rupees.",
  "You love travelling but don't know how people earn from it.",
];

const modules = [
  {
    title: "Module 1: Understanding The Travel Industry",
    points: [
      "How the travel business actually works",
      "Different ways people earn in the travel industry",
      "Why the travel industry keeps growing every year",
      "Common myths about starting a travel business",
    ],
  },
  {
    title: "Module 2: Building Your Income Foundation",
    points: [
      "Skills you should develop",
      "Essential tools every travel entrepreneur needs",
      "How to start professionally from home",
      "How to build customer trust",
      "Common beginner mistakes to avoid",
    ],
  },
  {
    title: "Module 3: Getting Customers & Growing",
    points: [
      "How people find travel customers online",
      "Basics of social media marketing for travel",
      "How to build long-term customer relationships",
      "How to increase repeat bookings",
      "Growth roadmap for beginners",
    ],
  },
];

const outcomes = [
  "Understand how the travel business works",
  "Know different earning opportunities",
  "Have clarity on where to begin",
  "Know what skills and tools are required",
  "Understand how successful travel entrepreneurs grow",
  "Be ready to take your first step confidently",
];

const liveReasons = [
  { icon: MessageCircle, text: "Live Q&A Session" },
  { icon: Sparkles, text: "Beginner Roadmap" },
  { icon: Star, text: "Real Examples" },
  { icon: CheckCircle2, text: "Step-by-Step Guidance" },
  { icon: Users, text: "Opportunity to Ask Questions" },
];

const bonuses = [
  "Beginner Checklist",
  "Essential Apps List",
  "Travel Business Starter Guide (PDF)",
];

const DISCOUNTED_AMOUNT = 99;
export const WEBINAR_AMOUNT = DISCOUNTED_AMOUNT * 100;
const ACTUAL_PRICE = 1999;
const DISCOUNT_PERECENTAGE =
  ((ACTUAL_PRICE - DISCOUNTED_AMOUNT) / ACTUAL_PRICE) * 100;

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = React.useState(target.getTime() - Date.now());

  React.useEffect(() => {
    const id = setInterval(
      () => setTimeLeft(target.getTime() - Date.now()),
      1000,
    );
    return () => clearInterval(id);
  }, [target]);

  const clamped = Math.max(timeLeft, 0);
  const days = Math.floor(clamped / (1000 * 60 * 60 * 24));
  const hours = Math.floor((clamped / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((clamped / (1000 * 60)) % 60);
  const seconds = Math.floor((clamped / 1000) % 60);

  return { days, hours, minutes, seconds, expired: clamped === 0 };
}

function WebinarPage() {
  const webinarDate = React.useMemo(
    () => new Date("2026-10-04T11:00:00+05:30"),
    [],
  );
  const webinarEndTime = new Date(webinarDate.getTime() + 2 * 60 * 60 * 1000);
  const countdown = useCountdown(webinarDate);

  const dateFormatter = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const weekdayFormatter = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
  });

  const timeFormatter = new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const formattedDate = `${dateFormatter.format(webinarDate)} (${weekdayFormatter.format(webinarDate)})`;
  const formattedTimeRange = `${timeFormatter.format(webinarDate)} – ${timeFormatter.format(webinarEndTime)}`;

  return (
    <main className="bg-[#faf9f6]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(180,130,40,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_30%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <Badge className="mb-4 border-amber-300/30 bg-amber-500/10 text-amber-300">
            Free Live Webinar
          </Badge>

          <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            Become a Travel Entrepreneur From Home
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Learn how ordinary people are building an extra income of ₹10,000 to
            ₹50,000/month through the travel industry.
          </p>

          <p className="mt-3 text-sm font-medium text-amber-300">
            No Office • No Huge Investment • Part-Time • Just Your Mobile Phone
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <CalendarDays className="size-5 text-amber-300" />
              <div>
                <p className="text-xs text-slate-400">Date</p>
                <p className="text-sm font-semibold">{formattedDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <Clock3 className="size-5 text-amber-300" />
              <div>
                <p className="text-xs text-slate-400">Time</p>
                <p className="text-sm font-semibold">{formattedTimeRange}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <Video className="size-5 text-amber-300" />
              <div>
                <p className="text-xs text-slate-400">Platform</p>
                <p className="text-sm font-semibold">Zoom Live Session</p>
              </div>
            </div>
          </div>

          {!countdown.expired && (
            <div className="mt-8 flex gap-3">
              {[
                { label: "Days", value: countdown.days },
                { label: "Hrs", value: countdown.hours },
                { label: "Min", value: countdown.minutes },
                { label: "Sec", value: countdown.seconds },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl bg-white/10 px-4 py-3 text-center"
                >
                  <p className="text-xl font-bold tabular-nums">{item.value}</p>
                  <p className="text-xs text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex items-center gap-4">
            <div>
              <span className="text-3xl font-bold text-white">
                ₹{DISCOUNTED_AMOUNT}
              </span>
              <span className="ml-2 text-lg text-slate-400 line-through">
                ₹{ACTUAL_PRICE}
              </span>
            </div>
            <Badge className="bg-emerald-500/15 text-emerald-300">
              {DISCOUNT_PERECENTAGE.toFixed(0)}% OFF Today
            </Badge>
          </div>

          <a href="#register">
            <Button variant={"default"} className="mt-6 cursor-pointer">
              Reserve Your Seat Now
            </Button>
          </a>

          <p className="mt-3 text-xs text-slate-500">
            Zoom joining link will be shared one day before the webinar.
          </p>
        </div>
      </section>

      {/* Who is this for */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Who This Webinar Is For
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {audienceList.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-xl border border-border/60 bg-white p-4 shadow-sm"
            >
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
              <p className="text-sm text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Problems */}
      <section className="border-y bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Are You Facing These Problems?
          </h2>
          <div className="mt-6 space-y-3">
            {problems.map((item) => (
              <p
                key={item}
                className="rounded-xl bg-white p-4 text-sm leading-7 text-slate-700 shadow-sm"
              >
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          What You'll Learn
        </h2>
        <div className="mt-6 space-y-5">
          {modules.map((mod, idx) => (
            <Card
              key={mod.title}
              className="rounded-2xl border-border/60 bg-white shadow-sm"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-sm font-bold text-amber-700">
                    {idx + 1}
                  </div>
                  <CardTitle className="text-xl text-slate-900">
                    {mod.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="grid gap-2 sm:grid-cols-2">
                {mod.points.map((point) => (
                  <div key={point} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber-700" />
                    <p className="text-sm text-slate-600">{point}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Outcomes + why live */}
      <section className="border-y bg-slate-950 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">
              After This Webinar You Will
            </h2>
            <div className="mt-6 space-y-3">
              {outcomes.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber-300" />
                  <p className="text-sm leading-7 text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Why Attend Live?</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {liveReasons.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.text}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <Icon className="size-5 text-amber-300" />
                    <p className="text-sm font-medium">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Bonus */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <Card className="rounded-2xl border-amber-200 bg-amber-50/70 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Gift className="size-6 text-amber-700" />
              <CardTitle className="text-2xl text-slate-900">
                Bonus — Every Attendee Will Receive
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {bonuses.map((item) => (
              <div
                key={item}
                className="flex items-start gap-2 rounded-xl bg-white p-4 shadow-sm"
              >
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber-700" />
                <p className="text-sm text-slate-700">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <p className="mt-6 rounded-xl border border-border/60 bg-slate-50 p-4 text-sm leading-7 text-slate-600">
          <strong>Important note:</strong> This webinar is designed for
          educational purposes and is ideal for beginners who want to understand
          the travel industry and explore business opportunities from home.
        </p>
      </section>

      {/* Registration form */}
      <section id="register" className="border-t bg-[#6f5516]">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 ">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Reserve Your Seat Today
            </h2>
            <p className="mt-2 text-sm text-amber-100/90">
              {formattedDate} | {formattedTimeRange} · Zoom Live
            </p>
          </div>

          <Card className="mt-8 rounded-2xl border-none bg-white shadow-xl max-sm:mb-10">
            <CardContent className="p-6 sm:p-8">
              <WebinarRegistrationForm />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white p-3 shadow-lg lg:hidden">
        <a href="#register">
          <Button className="w-full">
            Reserve Seat — ₹{DISCOUNTED_AMOUNT} Only
          </Button>
        </a>
      </div>
    </main>
  );
}
