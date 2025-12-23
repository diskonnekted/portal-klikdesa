"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Clock, Heart, ExternalLink } from "lucide-react";
import { siFacebook, siWhatsapp, siInstagram, siYoutube, type SimpleIcon } from "simple-icons";

import { useTranslation } from "@/lib/useTranslation";
import { Logo, LogoVariant } from "@/components/ui/custom/Logo";

export function Footer() {
    const { t } = useTranslation();

    const quickLinks = [
        { href: "/berita", label: t("navigation.berita") },
        { href: "https://sijenggung-banjarnegara.desa.id/layanan-mandiri", label: t("navigation.layanan"), external: true },
        { href: "/profil/sejarah", label: "Sejarah Desa" },
        { href: "/pemerintahan", label: t("navigation.pemerintahan") },
        { href: "/keuangan", label: t("navigation.keuangan") },
        { href: "/pengaduan", label: t("navigation.pengaduan") },
    ];

    const layananLinks = [
        { href: "https://sijenggung-banjarnegara.desa.id/layanan-mandiri", label: "Layanan Mandiri", external: true },
        { href: "/pengaduan", label: "Pengaduan Masyarakat" },
        { href: "/iot", label: "IoT Monitoring" },
        { href: "/statistik", label: "Data Statistik" },
    ];

    // Simple icon wrapper component for simple-icons
    const SimpleIcon = ({ icon, className, color }: { icon: SimpleIcon; className?: string; color?: string }) => {
        // Remove width and height from the original SVG to make it responsive
        const svgContent = icon.svg.replace(/width="[^"]*"/, "").replace(/height="[^"]*"/, "");

        // Add color to the SVG content
        const coloredSvgContent = svgContent.replace(/<path/g, `<path fill="${color || "currentColor"}"`);

        return <span className={className} dangerouslySetInnerHTML={{ __html: coloredSvgContent }} />;
    };

    const socialLinks = [
        {
            href: "https://www.facebook.com/Desapondokrejo.sid",
            icon: siFacebook,
            label: "Facebook",
            color: "#0866FF",
        },
        {
            href: "https://api.whatsapp.com/send?phone=6287742203602",
            icon: siWhatsapp,
            label: "WhatsApp",
            color: "#2bb517",
        },
        {
            href: "https://www.instagram.com/Desapondokrejo.sid",
            icon: siInstagram,
            label: "Instagram",
            color: "#FF0069",
        },
        { href: "https://www.youtube.com/@TIMMEDIAPONDOKREJO", icon: siYoutube, label: "YouTube", color: "#FF0000" },
    ];

    return (
        <footer className="bg-[#00363A] text-white">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* About Section */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <Logo {...LogoVariant.footer} />
                            <div>
                                <h3 className="text-lg font-bold text-white">Desa Sijenggung</h3>
                                <p className="text-xs text-white">Kabupaten Banjarnegara, Jateng</p>
                            </div>
                        </div>
                        <p className="text-sm text-white leading-relaxed">
                            Portal resmi Pemerintah Desa Sijenggung yang menyediakan informasi dan layanan publik
                            digital untuk warga desa.
                        </p>
                        <div className="flex space-x-3">
                            {socialLinks.map((social) => (
                                <Link
                                    key={social.label}
                                    href={social.href}
                                    className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-secondary-950 hover:bg-secondary-200 hover:text-secondary-900 transition-colors"
                                    aria-label={social.label}
                                >
                                    <SimpleIcon icon={social.icon} className="h-5 w-5" color={social.color} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">{t("footer.quickLinks")}</h4>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    {link.external ? (
                                        <a
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-white hover:text-primary transition-colors flex items-center"
                                        >
                                            <ExternalLink className="h-3 w-3 mr-2" />
                                            {link.label}
                                        </a>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            className="text-sm text-white hover:text-primary transition-colors flex items-center"
                                        >
                                            <ExternalLink className="h-3 w-3 mr-2" />
                                            {link.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">{t("footer.layanan")}</h4>
                        <ul className="space-y-2">
                            {layananLinks.map((link) => (
                                <li key={link.href}>
                                    {link.external ? (
                                        <a
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-white hover:text-primary transition-colors flex items-center"
                                        >
                                            <ExternalLink className="h-3 w-3 mr-2" />
                                            {link.label}
                                        </a>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            className="text-sm text-white hover:text-primary transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Hubungi Kami</h4>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                <div className="text-sm text-white">
                                    <p>{t("footer.alamat")}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-primary shrink-0" />
                                <a
                                    href={`tel:${t("footer.telepon").replace(/[^\d+]/g, "")}`}
                                    className="text-sm text-white hover:text-primary transition-colors"
                                >
                                    {t("footer.telepon")}
                                </a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-primary shrink-0" />
                                <a
                                    href={`mailto:${t("footer.email")}`}
                                    className="text-sm text-white hover:text-primary transition-colors"
                                >
                                    {t("footer.email")}
                                </a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Clock className="h-5 w-5 text-primary shrink-0" />
                                <span className="text-sm text-white">{t("footer.jamOperasional")}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-white/10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-sm text-white text-center md:text-left">
                            <p>{t("footer.copyright")}</p>
                        </div>

                        <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4">
                            <div className="flex items-center space-x-2 text-xs sm:text-sm text-white">
                                <span>Made with</span>
                                <Heart className="h-4 w-4 text-[#f87171]" />
                                <span>by</span>
                                <a href="https://www.clasnet.co.id" target="_blank" rel="noopener noreferrer">
                                    Clasnet
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

