import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const features = [
    {
        icon: '/Web Design Icon.png',
        title: 'Free premium web designs.',
        description: 'We offer free web designs until you\'re satisfied. Only then do we move onto the next step.',
    },
    {
        icon: '/Web Hosting Icon.png',
        title: 'Free website hosting.',
        description: 'Reliable, secure, and fast hosting at no cost. We take care of everything so you can focus on your business.',
    },
    {
        icon: '/Dollar Icon.png',
        title: 'High quality, affordable prices.',
        description: 'Other web dev companies cost a lot. We deliver high-quality solutions that fit your budget.',
    },
];

const FeaturesSection = () => {
    return (
        <section className="items-center">
            <div className="my-[200px]">
                <div className="flex flex-col items-center">
                    <div className="UmbrellaBackgroundGradient 2xl:min-w-[75%] xl:min-w-[85%] lg:min-w-[90%] min-w-[100%] rounded-t-[100%] sm:h-[900px] h-[400px] absolute -z-10" />

                    <div className="flex flex-col items-center sm:mt-[200px] mt-[100px] sm:max-w-[100%] max-w-[80%]">
                        <h1 className="HeadingFont sm:text-start text-center">
                            Why businesses choose <span className="TextGradient">Lucidify</span>.
                        </h1>
                        <h3 className="TextFont mt-[15px] sm:text-start text-center">
                            We don&apos;t just build websites, we build <span className="font-medium">relationships</span>.
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-[20px] sm:mt-[100px] mt-[50px] px-[20px] sm:px-0 max-w-[900px] w-full">
                        {features.map((f) => (
                            <div
                                key={f.title}
                                className="BlackGradient ContentCardShadow rounded-[20px] flex flex-col px-[40px] py-[45px] hover:-translate-y-[6px] hover:shadow-[0_20px_60px_rgba(114,92,247,0.12)] cursor-default"
                            >
                                <div className="flex mb-[30px]">
                                    <div className="bg-[#232426] rounded-[10px]">
                                        <div className="w-[50px] m-[4px]">
                                            <Image
                                                src={f.icon}
                                                alt={f.title}
                                                layout="responsive"
                                                width={0}
                                                height={0}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <h3 className="font-medium mb-[10px] max-w-[220px]">{f.title}</h3>
                                <h3 className="text-[14px] opacity-60 mb-[30px] font-light flex-1">{f.description}</h3>
                                <div className="flex">
                                    <Link className="TextGradient flex items-center" href="/">
                                        Learn More
                                        <div className="w-[13px] -rotate-45 ml-[5px]">
                                            <Image
                                                src="/Purple Top Right Arrow.png"
                                                alt="Arrow"
                                                layout="responsive"
                                                width={0}
                                                height={0}
                                            />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection
