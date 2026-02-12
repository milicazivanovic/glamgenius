import Link from "next/link";
import {
    ArrowLeft, Cpu, Activity, Zap, GitBranch, Database, Shield,
    Layers, ArrowDown, Settings, MessageSquare, ListChecks
} from "lucide-react";

export default function AgentPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-3xl mx-auto px-4 py-8">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 mb-8 transition-colors">
                    <ArrowLeft size={16} className="mr-1.5" /> Back to App
                </Link>

                <header className="mb-12">
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-950 mb-3">How the Stylist Works</h1>
                    <p className="text-lg text-neutral-600 leading-relaxed">
                        This isn't magic. It's a deterministic system that uses your real wardrobe data and basic rules to find the right outfit.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <Card
                        icon={<MessageSquare size={20} className="text-neutral-500" />}
                        title="1. What you say"
                        description="We search for keywords like 'cold', 'date', or 'work' in your message along with explicit commands."
                    />
                    <Card
                        icon={<Database size={20} className="text-neutral-500" />}
                        title="2. Your Wardrobe"
                        description="We fetch all your clothes and filter them. For example, if it's 'summer', we hide winter coats."
                    />
                    <Card
                        icon={<ListChecks size={20} className="text-neutral-500" />}
                        title="3. Valid Outfits"
                        description="We try every combination of Top + Bottom + Shoes and score them based on matching colors and occasion."
                    />
                    <Card
                        icon={<Zap size={20} className="text-neutral-500" />}
                        title="4. Selection"
                        description="The top 3 highest-scored outfits are shown to you. Explainability rules tell you why they were picked."
                    />
                </div>

                <section className="mb-12 border-t border-neutral-100 pt-8">
                    <h2 className="text-xl font-bold text-neutral-900 mb-6">Scoring Rules</h2>
                    <p className="text-sm text-neutral-600 mb-6">
                        We prioritize outfits based on a simple point system.
                    </p>

                    <div className="border border-neutral-200 rounded-lg overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-neutral-50 border-b border-neutral-200">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-neutral-700">Rule</th>
                                    <th className="px-4 py-3 font-semibold text-neutral-700 w-24">Points</th>
                                    <th className="px-4 py-3 font-semibold text-neutral-700">Reason</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 bg-white">
                                <Row factor="Matches Season" weight="+3" positive logic="Comfortable for the weather" />
                                <Row factor="Good Colors" weight="+2" positive logic="Colors look good together" />
                                <Row factor="Wear Frequency" weight="+2" positive highlight logic="You haven't worn this lately" />
                                <Row factor="Wrong Season" weight="-5" positive={false} logic="Too hot or too cold" />
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="bg-neutral-50 p-6 rounded-xl border border-neutral-200">
                    <h2 className="font-bold text-neutral-900 mb-2 flex items-center gap-2">
                        <Shield size={18} />
                        Why Rule-Based?
                    </h2>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                        For an MVP, we use rules instead of a Chatbot LLM to ensure the app is fast, cheap to run, and never hallucinates clothes you don't own. It's a reliable tool, not a conversation partner.
                    </p>
                </section>
            </div>
        </div>
    );
}

function Card({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-5 rounded-lg border border-neutral-200 bg-white">
            <div className="mb-3">{icon}</div>
            <h3 className="font-semibold text-neutral-900 mb-1">{title}</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">{description}</p>
        </div>
    );
}

function Row({ factor, weight, logic, positive, highlight }: { factor: string, weight: string, logic: string, positive: boolean, highlight?: boolean }) {
    return (
        <tr className="group hover:bg-neutral-50 transition-colors">
            <td className="px-4 py-3 font-medium text-neutral-900">{factor}</td>
            <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-mono font-medium ${highlight ? "bg-amber-100 text-amber-700" :
                        positive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                    {weight}
                </span>
            </td>
            <td className="px-4 py-3 text-neutral-500">{logic}</td>
        </tr>
    );
}
