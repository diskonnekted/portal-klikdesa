"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Clock, Heart, ExternalLink } from "lucide-react";
import { siFacebook, siWhatsapp, siInstagram, siYoutube, type SimpleIcon } from "simple-icons";

import { useTranslation } from "@/lib/useTranslation";
import { Logo, LogoVariant } from "@/components/ui/custom/Logo";

export function Footer() {
    const { t } = useTranslation();

    interface FooterLink {
        href: string;
        label: string;
        external?: boolean;
    }

    const quickLinks: FooterLink[] = [
        { href: "/", label: "Beranda" },
        { href: "/klikdesa/kesehatan", label: "Kesehatan" },
        { href: "/klikdesa/kemiskinan", label: "Pengentasan Kemiskinan" },
        { href: "/klikdesa/pemberdayaan", label: "Pemberdayaan Masyarakat" },
        { href: "/klikdesa/tata-kelola", label: "Tata Kelola Pemerintahan" },
        { href: "/klikdesa/bencana", label: "Ketahanan Bencana" },
    ];

    const layananLinks: FooterLink[] = [
        { href: "/klikdesa/kesehatan", label: "Posyandu & KB" },
        { href: "/klikdesa/kemiskinan", label: "Pemetaan Desil" },
        { href: "/klikdesa/pemberdayaan?tab=sidara", label: "Sidara (Potensi Desa)" },
        { href: "/klikdesa/pemberdayaan?tab=ttg", label: "Teknologi Tepat Guna (TTG)" },
        { href: "/klikdesa/tata-kelola", label: "Layanan Mandiri Desa" },
        { href: "/pengaduan", label: "Disiplin Aparatur (Gadis Desa)" },
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
                                <h3 className="text-lg font-bold text-white">Klikdesa</h3>
                                <p className="text-xs text-white">Dispermades PPKB Banjarnegara</p>
                            </div>
                        </div>
                        <p className="text-sm text-white leading-relaxed">
                            Portal resmi Klikdesa (Katalog Layanan Interaktif & Kolaborasi Desa) Dinas Dispermades PPKB
                            Kabupaten Banjarnegara yang menyediakan informasi dan layanan publik digital terintegrasi.
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
                        <div className="flex items-center space-x-3 text-xs sm:text-sm text-white">
                            <span>Mitra Digital:</span>
                            <div className="flex items-center bg-white/5 hover:bg-white/10 transition px-3 py-1.5 rounded-lg border border-white/15">
                                <img src="/images/despin.png" alt="DesaPintar" className="h-8 w-auto object-contain brightness-0 invert" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

