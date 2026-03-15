"use client"

import Image from 'next/image';
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Link from 'next/link';

const CONTACTHeroSection = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'contacts'), formData);
            setIsSubmitted(true);
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send your message. Please try again.');
        }
    };

    return (
        <section className="mt-[86px] sm:mt-[90px]">
            <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start rounded-b-[50px] mx-auto BackgroundGradient pt-[60px] sm:pt-[80px] pb-[60px] sm:pb-[80px] px-[24px] sm:px-[48px] lg:px-[80px] gap-[48px] lg:gap-[80px]">
                <div className="flex items-start justify-center w-full flex-col max-w-[560px] lg:mr-[75px]">
                    <div className="flex justify-center items-center border-solid border border-1 border-[#2F2F2F] rounded-full">
                        <div className="flex">
                            <div className="flex items-center my-1.5 mx-4">
                                <div className="sm:w-[16px] w-[14px] mr-3">
                                    <Image
                                        src="/Lucidify Umbrella and L (black gradient).png"
                                        alt="Lucidify Umbrella"
                                        layout="responsive"
                                        width={0}
                                        height={0}
                                    />
                                </div>
                                <h2 className="tracking-[4px] font-medium sm:text-[12px] text-[10px]">CONTACT</h2>
                            </div>
                        </div>
                    </div>
                    <h1 className="TitleFont my-[22px] lg:max-w-[80%] xl:max-w-[100%] max-w-[90%]">Let&apos;s get in <span className="TextGradient">touch</span>.</h1>
                    <div className="max-w-[75%] sm:max-w-[80%] mb-[45px]">
                        <h3 className="TextFont max-w-[95%]">Have questions about our services or just want to say hello? We are here to help.</h3>
                    </div>
                    <div className="flex flex-col items-start">
                        <div className="flex justify-center items-center">
                            <div className="bg-gradient-to-br from-[rgba(255,255,255,0.10)] to-[rgba(255,255,255,0.00)] rounded-full">
                                <div className="w-[25px] h-[25px] m-[12px]">
                                    <Image
                                        src="/Email Icon.png"
                                        alt="LinkedIn Icon"
                                        layout="responsive"
                                        width={0}
                                        height={0}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col ml-[15px]">
                                <h2 className="text-[18px] mb-[5px]">Email</h2>
                                <h3 className="text-[14px] opacity-65">ash@lucidify.agency</h3>
                            </div>
                        </div>

                        <div className="flex justify-center items-center mt-[20px]">
                            <div className="bg-gradient-to-br from-[rgba(255,255,255,0.10)] to-[rgba(255,255,255,0.00)] rounded-full">
                                <div className="w-[25px] h-[25px] m-[12px]">
                                    <Image
                                        src="/Clock Icon.png"
                                        alt="LinkedIn Icon"
                                        layout="responsive"
                                        width={0}
                                        height={0}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col ml-[15px]">
                                <h2 className="text-[18px] mb-[5px]">Hours</h2>
                                <h3 className="text-[14px] opacity-65">24/7 for Emails</h3>
                            </div>
                        </div>
                    </div>
                    <div className="flex mt-[50px]">
                        <Link
                            href="https://www.linkedin.com/company/lucidify/"
                            className="w-[35px] h-[35px] rounded-full flex justify-center items-center border-solid border-[rgba(255,255,255,0.05)] border-[1px] hover:bg-[rgba(255,255,255,0.10)]">
                            <div className="w-[15px] h-[15px]">
                                <Image
                                    src="/LinkedIn Icon.png"
                                    alt="LinkedIn Icon"
                                    layout="responsive"
                                    width={0}
                                    height={0}
                                />
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="flex justify-center items-center w-full lg:w-auto">
                    <div className="py-[40px] px-[24px] sm:px-[30px] rounded-[15px] bg-gradient-to-b from-[rgba(255,255,255,0.15)] to-[rgba(255,255,255,0.05)] w-full max-w-[700px] border-[1px] border-[rgba(255,255,255,0.04)]">
                        {isSubmitted ? (
                            <h3 className="text-[18px] text-white text-center w-full">
                                Thank you for your message! We&apos;ll get back to you shortly.
                            </h3>
                        ) : (
                            <form className="flex flex-col gap-[24px]" onSubmit={handleSubmit}>
                                <div className="flex flex-col sm:flex-row gap-[20px] sm:gap-[24px]">
                                    <div className="flex flex-col flex-1">
                                        <label htmlFor="firstName" className="mb-[13px] text-white text-[18px] font-medium">
                                            First name
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            placeholder="Your first name"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="ContactInput p-3 rounded-lg border-none bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(128,128,128,0.15)] bg-transparent text-white placeholder-[rgba(255,255,255,0.65)] focus:outline-none focus:bg-[rgba(255,255,255,0.05)] focus:ring-[0.5px] focus:ring-[rgba(255,255,255,0.25)] text-[14px]"
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <label htmlFor="lastName" className="mb-[13px] text-white text-[18px] font-medium">
                                            Last name
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            placeholder="Your last name"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="ContactInput p-3 rounded-lg border-none bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(128,128,128,0.15)] bg-transparent text-white placeholder-[rgba(255,255,255,0.65)] focus:outline-none focus:bg-[rgba(255,255,255,0.05)] focus:ring-[0.5px] focus:ring-[rgba(255,255,255,0.25)] text-[14px]"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-[20px] sm:gap-[24px]">
                                    <div className="flex flex-col flex-1">
                                        <label htmlFor="email" className="mb-[13px] text-white text-[18px] font-medium">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            placeholder="Your email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="ContactInput p-3 rounded-lg border-none bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(128,128,128,0.15)] bg-transparent text-white placeholder-[rgba(255,255,255,0.65)] focus:outline-none focus:bg-[rgba(255,255,255,0.05)] focus:ring-[0.5px] focus:ring-[rgba(255,255,255,0.25)] text-[14px]"
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <label htmlFor="phone" className="mb-[13px] text-white text-[18px] font-medium">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            placeholder="Your phone number"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="ContactInput p-3 rounded-lg border-none bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(128,128,128,0.15)] bg-transparent text-white placeholder-[rgba(255,255,255,0.65)] focus:outline-none focus:bg-[rgba(255,255,255,0.05)] focus:ring-[0.5px] focus:ring-[rgba(255,255,255,0.25)] text-[14px]"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="message" className="mb-[13px] text-white text-[18px] font-medium">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        placeholder="Leave us a message..."
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        className="ContactInput p-3 rounded-lg border-none bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(128,128,128,0.15)] bg-transparent text-white placeholder-[rgba(255,255,255,0.65)] h-20 focus:outline-none focus:bg-[rgba(255,255,255,0.05)] focus:ring-[0.5px] focus:ring-[rgba(255,255,255,0.25)] text-[14px] resize-none"
                                        required
                                    />
                                </div>
                                <button type="submit" className="flex justify-center items-center rounded-[8px] bg-[#725CF7] BoxShadow hover:bg-[#5D3AEA]">
                                    <h1 className="sm:mx-[20px] sm:my-[12px] mx-[14px] my-[6px] sm:text-[16px] text-[14px]">Send message</h1>
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CONTACTHeroSection;
