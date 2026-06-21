import { ScrollText } from "lucide-react";

const PrivacyPolicy = () => {
    return (
        <div className="py-24 px-6 max-w-4xl mx-auto">
            <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
                    <ScrollText size={14} /> Legal
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight mb-4">
                    Privacy <span className="gradient-text">Policy</span>
                </h1>
                <p className="text-muted-foreground font-medium">Last updated: October 2026</p>
            </div>

            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        At EduTrack, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        Please read this privacy policy carefully to understand our policies and practices regarding your information and how we will treat it.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">2. The Data We Collect About You</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        Personal data, or personal information, means any information about an individual from which that person can be identified. It does not include data where the identity has been removed (anonymous data).
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2 ml-4">
                        <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                        <li><strong>Contact Data:</strong> includes billing address, email address and telephone numbers.</li>
                        <li><strong>Financial Data:</strong> includes payment card details. We use third-party payment processors and do not store your raw credit card data.</li>
                        <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
                        <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, and other technology on the devices you use to access this website.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">3. How We Use Your Personal Data</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2 ml-4">
                        <li>Where we need to perform the contract we are about to enter into or have entered into with you (such as enrolling you in a course).</li>
                        <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                        <li>Where we need to comply with a legal or regulatory obligation.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">4. Data Security</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a duty of confidentiality.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">5. Your Legal Rights</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2 ml-4">
                        <li>Request access to your personal data.</li>
                        <li>Request correction of your personal data.</li>
                        <li>Request erasure of your personal data.</li>
                        <li>Object to processing of your personal data.</li>
                        <li>Request restriction of processing your personal data.</li>
                        <li>Request transfer of your personal data.</li>
                        <li>Right to withdraw consent.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">6. Contact Us</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        If you have any questions about this privacy policy or our privacy practices, please contact us at <a href="mailto:privacy@edutrack.app" className="text-primary hover:underline">privacy@edutrack.app</a>.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
