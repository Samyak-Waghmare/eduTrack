import { Scale } from "lucide-react";

const TermsOfService = () => {
    return (
        <div className="py-24 px-6 max-w-4xl mx-auto">
            <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
                    <Scale size={14} /> Legal
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight mb-4">
                    Terms of <span className="gradient-text">Service</span>
                </h1>
                <p className="text-muted-foreground font-medium">Last updated: October 2026</p>
            </div>

            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">1. Agreement to Terms</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        By accessing or using the EduTrack website, mobile application, and related services (collectively, the "Services"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the Service.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">2. Intellectual Property Rights</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        Other than the content you own, under these Terms, EduTrack and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted a limited license only for purposes of viewing the material contained on this Website and participating in the educational courses provided.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        You are specifically restricted from all of the following:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2 ml-4 mt-2">
                        <li>Publishing any Website material in any other media without prior consent.</li>
                        <li>Selling, sublicensing and/or otherwise commercializing any Website material.</li>
                        <li>Using this Website in any way that is or may be damaging to this Website.</li>
                        <li>Using this Website contrary to applicable laws and regulations.</li>
                        <li>Engaging in any data mining, data harvesting, data extracting or any other similar activity.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">3. User Accounts</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service. You agree not to disclose your password to any third party.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">4. Course Content and Refund Policy</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        We reserve the right to cancel, interrupt, or reschedule any course or to modify its content or the point value or weight of any assignment, quiz, or other assessment. Courses offered are subject to the Disclaimers and Limitation of Liability sections below.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        Purchases made on EduTrack are subject to a 30-day refund policy, provided that the user has not completed more than 30% of the course material or downloaded course certificates.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">5. Limitation of Liability</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        In no event shall EduTrack, nor any of its officers, directors and employees, shall be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. EduTrack, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">6. Governing Law & Jurisdiction</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        These Terms will be governed by and interpreted in accordance with the laws of the State/Country in which EduTrack operates, and you submit to the non-exclusive jurisdiction of the state and federal courts located there for the resolution of any disputes.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">7. Contact Us</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        If you have any questions about these Terms, please contact us at <a href="mailto:legal@edutrack.app" className="text-primary hover:underline">legal@edutrack.app</a>.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default TermsOfService;
