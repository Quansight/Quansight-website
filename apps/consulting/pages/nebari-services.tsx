import React, { FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import { GetStaticProps } from 'next';
import Image from 'next/future/image';
import Link from 'next/link';
import { A11y, Keyboard, Navigation } from 'swiper';

import 'swiper/css/bundle';
import 'swiper/css/navigation';

import { ISlugParams, DomainVariant } from '@quansight/shared/types';
import { Layout, SEO, Footer, Header } from '@quansight/shared/ui-components';

import { PageItem } from '../api/types/basic';
import { getFooter } from '../api/utils/getFooter';
import { getHeader } from '../api/utils/getHeader';
import confluencyLogo from '../public/nebari-services/confluency-logo.png';
import earthBigDataLogo from '../public/nebari-services/earth-big-data-logo.png';
import esipLogo from '../public/nebari-services/esip-logo.png';
import morningstarLogo from '../public/nebari-services/morningstar-logo.png';
import nebariLogo from '../public/nebari-services/nebari-logo.svg';
import { TContainerProps } from '../types/containerProps';

// This is kinda hacky. It runs a loop for up to 8 seconds checking every 400 ms
// for the contact form. If it finds the contact form, it fills in the message
// field.
const prefillContactFormMessage = function (msg) {
  let count = 20;
  const intervalId = setInterval(() => {
    if (!count--) {
      clearInterval(intervalId);
    }
    const messageField: HTMLTextAreaElement | void = document.querySelector(
      '#bookacallform [name=message]',
    ) as HTMLTextAreaElement;
    if (!messageField) {
      return;
    }
    clearInterval(intervalId);
    // Fill in the message field only if it hasn't already been filled in.
    if (!messageField.value) {
      messageField.value = msg;
    }
  }, 400);
};

/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* Disable these eslint rules for this file. These rules are unhappy with the
  links that have an onClick handler, but these are fine because the handler
  doesn't circumvent the default behavior of the link, plus onClick also works
  with keyboards (enter key). So I think these rules are falsely flagging this
  file. */

export const NebariServicesPage: FC<TContainerProps> = ({
  header,
  footer,
  preview,
}) => (
  <Layout
    footer={<Footer {...footer.content} />}
    header={
      <Header
        {...header.content}
        domainVariant={DomainVariant.Quansight}
        preview={preview}
      />
    }
  >
    <SEO
      title="Nebari Services"
      description="Nebari is designed to be deployed and managed without DevOps expertise. However, if you need support, we offer flexible service options. Learn about Nebari."
      variant={DomainVariant.Quansight}
    />

    <div className="overflow-hidden w-full h-[100px] bg-[#000]"></div>

    <div className="relative mx-auto max-w-full h-[52.4rem] sm:h-[calc(780px_-_40vw)] lg:h-[36.7rem] nebari-hero-background">
      <div className="flex relative flex-col items-center px-[2rem] pt-[13rem] w-full h-full sm:pt-[calc(280px_-_23.4vw)] md:absolute md:px-0 lg:pt-[4rem]">
        <Image className="mb-[20px]" alt="Nebari logo" src={nebariLogo} />
        <h1 className="px-[5.2rem] mb-[1rem] text-[4.6rem] font-extrabold tracking-wide leading-[1] text-center text-white md:text-[5.6rem] md:leading-[1.2] font-heading">
          Nebari Services
        </h1>
        <p className="mb-[2em] text-[1.6em] text-white">
          Deployment, support, and training
        </p>
        <div className="py-[1.2rem] px-[3rem] mb-[6rem] text-center bg-[#BA18DD]">
          <Link href="/about-us#bookacallform">
            <a
              className="after:ml-[0.5em] text-[1.7rem] font-bold text-white after:content-[url(/nebari-services/right-pointing-triangle.svg)] font-heading"
              onClick={() =>
                prefillContactFormMessage(
                  "Hi, I'm interested in learning more about your Nebari Services options. Thanks!",
                )
              }
            >
              Contact Sales
            </a>
          </Link>
        </div>
      </div>
    </div>

    <section className="flex flex-col flex-nowrap items-center py-24 px-8 mx-auto lg:px-[13rem] max-w-layout">
      <h2 className="mb-[1em] text-[4.2rem] font-bold tracking-wide leading-[1] text-center md:text-[4.8rem] font-heading">
        What is Nebari?
      </h2>
      <p className="mx-auto mb-[3.7rem] max-w-prose text-[1.6rem] leading-[2.7rem] text-center">
        <span className="font-bold">
          Nebari is on open source data science platform{' '}
        </span>
        for teams with serious computational and collaboration needs, looking
        to:
      </p>
      <ul className="mb-[4rem] w-[100%] max-w-[900px] list-none md:columns-2 md:gap-[82px] md:mb-[5rem]">
        {[
          'Work in familiar IDEs like JupyterLab or VSCode',
          'Scale work with built-in support for distributed computing with Dask',
          'Share and manage fully-reproducible data science environments',
          'Collaborate seamlessly with file and dashboard sharing',
          'Schedule and orchestrate workflows with built-in Argo integration',
          'Deploy, maintain, and monitor the platform without DevOps experience',
        ].map((txt) => (
          <li
            key={txt}
            className="flex before:relative before:top-[8px] before:shrink-0 before:mr-[1em] mb-[1em] before:w-[39px] max-w-prose before:h-[36px] text-[1.6rem] font-bold leading-[2.7rem] before:bg-[url(/nebari-services/nebari-logo.svg)] before:bg-no-repeat before:bg-contain"
          >
            {txt}
          </li>
        ))}
      </ul>
      {/* eslint-disable jsx-a11y/media-has-caption */}
      <video controls className="px-8 mb-[7rem] w-[100%] max-w-[900px] md:p-0">
        <source src="https://a.storyblok.com/f/147759/x/00ddc13b05/nebari-features.mp4" />
        <p>
          A silent video demo of Nebari features using screen recordings and
          slides
        </p>
      </video>
      {/* eslint-enable jsx-a11y/media-has-caption */}
      <div className="py-[1.8rem] px-[2.9rem] mb-[1rem] text-center bg-[#20AAA1]">
        <Link href="/about-us#bookacallform">
          <a
            className="after:ml-[1em] text-[1.7rem] font-bold text-white after:content-[url(/nebari-services/right-pointing-triangle.svg)] font-heading"
            onClick={() =>
              prefillContactFormMessage(
                'Hi, please send me a login to a demo instance of Nebari so I can check it out. Thanks!',
              )
            }
          >
            Try Nebari
          </a>
        </Link>
      </div>
      <p className="px-[10rem] max-w-prose font-[400] text-[1.4rem] italic leading-[1.7rem] text-center text-[rgba(0,0,0,1)]">
        Drop us a line and we&rsquo;ll send you a login
      </p>
    </section>

    <section className="bg-gray-200">
      <h2 className="sr-only">Used by</h2>
      <div className="flex flex-col items-center p-20 mx-auto space-y-20 md:overflow-hidden md:flex-row md:justify-evenly md:py-2 md:px-32 md:space-y-0 md:space-x-8 max-w-layout">
        <Image alt="Morningstar" src={morningstarLogo} className="w-[137px]" />
        <Image
          alt="Earth Science Information Partners"
          src={esipLogo}
          className="w-[110px]"
        />
        <Image
          alt="Earth Big Data"
          src={earthBigDataLogo}
          className="w-[223px]"
        />
        <Image alt="Confluency" src={confluencyLogo} className="w-[131px]" />
      </div>
    </section>

    <section className="flex flex-col items-center py-24 px-8 mx-auto max-w-layout">
      <h2 className="mb-[0.9em] text-[4.2rem] font-bold leading-[1] text-center font-heading">
        Service Packages
      </h2>
      <p className="mb-[2em] text-[1.6rem] leading-[1.6] text-center md:max-w-[1016px]">
        Nebari is designed to be deployed and managed without DevOps expertise.
        However, if you need a helping hand, require special customizations, or
        have complex existing infrastructure, Quansight has some service
        offerings to help you reach your goals.
      </p>
      <p className="mb-[2em] text-[1.6rem] leading-[1.6] text-center md:max-w-[1016px]">
        As the creators of Nebari, we know it inside and out, and understand the
        underlying tools, including JupyterHub and Dask. We&apos;re experts in
        data science solutions, and have years of experience deploying and using
        Nebari for various client projects.
      </p>

      <div className="py-[1.7rem] px-[3.5rem] mb-[6rem] text-center bg-[#BA18DD]">
        <Link href="/about-us#bookacallform">
          <a
            className="after:ml-[0.5em] text-[1.7rem] font-bold text-white after:content-[url(/nebari-services/right-pointing-triangle.svg)] font-heading"
            onClick={() =>
              prefillContactFormMessage(
                "Hi, I'm interested in learning more about your Nebari Services options. Thanks!",
              )
            }
          >
            Contact Sales
          </a>
        </Link>
      </div>

      <div className="px-[10%] w-full md:grid md:grid-cols-3 md:gap-6 md:p-0 md:max-w-[1016px]">
        {/* Starter */}
        <div className="flex flex-col mb-[5.4rem] min-h-[55rem]">
          <h3 className="p-8 text-[3rem] font-bold tracking-wide text-center text-white bg-black font-heading">
            Starter
          </h3>
          <p className="grow py-7  px-1 font-[600] text-[1.6rem] italic tracking-wide leading-[2.6rem] text-center bg-gray-200 border-b border-b-black md:grow-0 md:px-2 md:h-[12rem]">
            Need some assistance with setup
          </p>
          <ul className="grow-[3] p-8 list-none bg-gray-200">
            {[
              'Evaluate needs',
              'Deploy Nebari on your infrastructure',
              'Admin training',
              '1 month of support via email',
            ].map((txt) => (
              <li
                key={txt}
                className="flex before:relative before:top-[6px] before:shrink-0 before:mr-[1em] mb-[8%] before:w-[13px] before:h-[10px] text-[1.6rem] tracking-wide leading-[2.3rem] before:bg-[url(/nebari-services/purple-check-mark.svg)] before:bg-no-repeat before:bg-contain"
              >
                {txt}
              </li>
            ))}
          </ul>
          <div className="p-7 text-[4rem] font-bold tracking-wide text-center text-white bg-[#BA18DD] font-heading">
            $5k
          </div>
        </div>

        {/* Standard */}
        <div className="flex flex-col mb-[5.4rem] min-h-[55rem]">
          <h3 className="p-8 text-[3rem] font-bold tracking-wide text-center text-white bg-black font-heading">
            Standard
          </h3>
          <p className="grow py-7 px-1 font-[600] text-[1.6rem] italic tracking-wide leading-[2.6rem] text-center bg-gray-200 border-b border-b-black md:grow-0 md:px-2 md:h-[12rem]">
            Need assistance with setup, onboarding users, and migrating
            workflows
          </p>
          <ul className="grow-[3] p-8 list-none bg-gray-200 md:grow">
            {[
              'All Starter-tier services',
              'User training (up to 15 people)',
              'Single sign-on integration',
              '10 hours of custom/integration work',
              '3 months of support via email and issue tracker',
            ].map((txt) => (
              <li
                key={txt}
                className="flex before:relative before:top-[6px] before:shrink-0 before:mr-[1em] mb-[8%] before:w-[13px] before:h-[10px] text-[1.6rem] tracking-wide leading-[2.3rem] before:bg-[url(/nebari-services/purple-check-mark.svg)] before:bg-no-repeat before:bg-contain"
              >
                {txt}
              </li>
            ))}
          </ul>
          <div className="p-7 text-[4rem] font-bold tracking-wide text-center text-white bg-[#BA18DD] font-heading">
            $20k
          </div>
        </div>

        {/* Plus */}
        <div className="flex flex-col mb-[5.4rem] min-h-[55rem]">
          <h3 className="p-8 text-[3rem] font-bold tracking-wide text-center text-white bg-black font-heading">
            Plus
          </h3>
          <p className="grow py-7 px-1 font-[600] text-[1.6rem] italic tracking-wide leading-[2.6rem] text-center bg-gray-200 border-b border-b-black md:flex md:grow-0 md:items-center md:px-2 md:h-[12rem]">
            Need assistance with setup, onboarding users, migrating workflows,
            and custom integrations
          </p>
          <ul className="grow-[3] p-8 list-none bg-gray-200 md:flex md:flex-col">
            {[
              'All Standard-tier services',
              'User training (up to 45 people)',
              'Optional special tools and use-case training',
              'Installation into custom VPCs and private subnets',
              '50 hours of custom development/integration work',
              '1 year of support via dedicated Slack channel',
            ].map((txt) => (
              <li
                key={txt}
                className="flex before:relative before:top-[6px] shrink before:shrink-0 before:mr-[1em] mb-[8%] before:w-[13px] before:h-[10px] text-[1.6rem] tracking-wide leading-[2.3rem] before:bg-[url(/nebari-services/purple-check-mark.svg)] before:bg-no-repeat before:bg-contain"
              >
                {txt}
              </li>
            ))}
          </ul>
          <div className="p-7 text-[4rem] font-bold tracking-wide text-center text-white bg-[#BA18DD] font-heading">
            $50k
          </div>
        </div>
      </div>

      <div className="px-[10%] mb-[3.4em] w-full max-w-[1016px] md:flex md:flex-row md:p-0 md:space-x-10">
        <div className="flex flex-col mb-[3.4rem]">
          <h3 className="p-8 text-[3rem] font-bold tracking-wide text-center text-white bg-black font-heading">
            Fully managed
          </h3>
          <p className="grow py-10 px-4 font-[500] text-[1.6rem] tracking-wide leading-[2.6rem] text-center bg-gray-200">
            Nebari deployment on your infrastructure, completely managed and
            maintained by Quansight, with dedicated user support.
          </p>
        </div>

        <div className="flex flex-col mb-[3.4rem]">
          <h3 className="p-8 text-[3rem] font-bold tracking-wide text-center text-white bg-black font-heading">
            Event services
          </h3>
          <p className="grow py-10 px-4 font-[500] text-[1.6rem] tracking-wide leading-[2.6rem] text-center bg-gray-200">
            One-time Nebari deployment and management to run tutorials and
            workshops, with user and infrastructure support during the event.{' '}
          </p>
        </div>
      </div>

      <h3 className="mb-[1em] text-[3rem] font-bold tracking-wide leading-[4.3rem] text-center font-heading">
        Interested in Nebari services,
        <br />
        or a more customized solution?
      </h3>

      <div className="py-[1.7rem] px-[3.5rem] mb-[1.9rem] text-center bg-[#BA18DD]">
        <Link href="/about-us#bookacallform">
          <a
            className="after:ml-[0.5em] text-[1.7rem] font-bold text-white after:content-[url(/nebari-services/right-pointing-triangle.svg)] font-heading"
            onClick={() =>
              prefillContactFormMessage(
                "Hi, I'm interested in learning more about your Nebari Services options. Thanks!",
              )
            }
          >
            Contact Sales
          </a>
        </Link>
      </div>

      <ul className="flex flex-col grow-[3] items-center p-8 mb-[4rem] list-none">
        {[
          'A guided, hands-on Nebari demo',
          'General Nebari questions',
          'Enterprise-level support',
          'Custom integrations',
        ].map((txt) => (
          <li
            key={txt}
            className="before:inline-block before:relative before:top-[6px] before:shrink-0 before:mr-[0.4em] mb-[0.4em] before:w-[17px] before:h-[13px] font-[700] text-[1.9rem] tracking-wide text-center before:align-text-top before:bg-[url(/nebari-services/purple-check-mark.svg)] before:bg-no-repeat before:bg-contain flex-inline"
          >
            {txt}
          </li>
        ))}
      </ul>
    </section>

    <section className="bg-black">
      <h2 className="sr-only">Testimonials</h2>
      <div
        className="p-4 mx-auto sm:px-[3.4rem] xl:px-[11.5rem] max-w-layout"
        style={{
          background:
            'url(/nebari-services/nebari-logo-grayscale.svg) right bottom / 325px no-repeat',
        }}
      >
        <style>{`
          .swiper-button-next, .swiper-button-prev {
              color: white;
          }
        `}</style>
        <Swiper
          spaceBetween={50}
          speed={500}
          modules={[A11y, Keyboard, Navigation]}
          a11y={{
            enabled: true,
            containerMessage: `Testimonials`,
            slideRole: 'group',
          }}
          keyboard={{
            enabled: true,
          }}
          navigation={true}
        >
          <SwiperSlide>
            <figure className="py-10 px-24 text-white">
              <blockquote className="before:relative before:top-[45px] before:left-[-30px] text-[1.8rem] before:text-[10rem] italic font-semibold leading-[2.7rem] before:text-white before:content-['“']">
                <p className="mb-[1em]">
                  It [Nebari] is a really good way to produce a scalable Jupyter
                  data science platform on whichever cloud you need. The Nebari
                  developers don&apos;t serve just Jupyter (a common problem
                  with many platforms is the focus on just Jupyter), they
                  provide proper ideas and integrations for actual software
                  engineers and also things like dashboard deployment and
                  workflows, so they think about the whole development cycle.
                </p>
              </blockquote>
              <figcaption className="mb-[4em] text-[1.8rem] font-bold leading-[2.7rem]">
                ~ Matthew Rocklin, Dask Lead Maintainer
              </figcaption>
            </figure>
          </SwiperSlide>
          <SwiperSlide>
            <figure className="py-10 px-24 text-white">
              <blockquote className="before:relative before:top-[45px] before:left-[-30px] text-[1.8rem] before:text-[10rem] italic font-semibold leading-[2.7rem] before:text-white before:content-['“']">
                <p className="mb-[1em]">
                  We engaged Quansight with some Jupyter [custom on-prem
                  Nebari], Python team development, data visualization skills in
                  hand. Quansight helped us refine these skills by offering
                  guidance in establishing our best practices, but more
                  important to our long term analytical success, they helped us
                  build a strategy around the use and deployment of these tools.
                </p>
              </blockquote>
              <figcaption className="mb-[4em] text-[1.8rem] font-bold leading-[2.7rem]">
                ~ US-Based Systematic Hedge Fund & Commodity Trading Advisor
              </figcaption>
            </figure>
          </SwiperSlide>
          <SwiperSlide>
            <figure className="py-10 px-24 text-white">
              <blockquote className="before:relative before:top-[45px] before:left-[-30px] text-[1.8rem] before:text-[10rem] italic font-semibold leading-[2.7rem] before:text-white before:content-['“']">
                <p className="mb-[1em]">
                  Before Nebari, we needed a devops engineer to launch and
                  maintain the deployment for ESIP, but now anyone can maintain
                  the deployment, users, and environments using the included GUI
                  tools and simple configuration scripts. Nebari is not only
                  easy to deploy and maintain, but our users have found
                  conda-store to be critical for effectively working with
                  research workflows.
                </p>
              </blockquote>
              <figcaption className="mb-[4em] text-[1.8rem] font-bold leading-[2.7rem]">
                ~ Nebari Administrators at{' '}
                <a
                  href="https://esipfed.org"
                  className="underline underline-offset-4"
                >
                  <abbr title="Earth Science Information Partners">ESIP</abbr>
                </a>
              </figcaption>
            </figure>
          </SwiperSlide>
          <SwiperSlide>
            <figure className="py-10 px-24 text-white">
              <blockquote className="before:relative before:top-[45px] before:left-[-30px] text-[1.8rem] before:text-[10rem] italic font-semibold leading-[2.7rem] before:text-white before:content-['“']">
                <p className="mb-[1em]">
                  Nebari is not only easy to deploy and maintain, but our users
                  have found conda-store to be critical for effectively working
                  with research workflows. Most open source packages use a
                  release-early-and-often approach and users are eager to try
                  new features, and conda-store is a killer-feature for any user
                  to update environments that work with Dask Gateway clusters
                  without building and distributed huge Docker images.
                </p>
              </blockquote>
              <figcaption className="mb-[4em] text-[1.8rem] font-bold leading-[2.7rem]">
                ~ Anonymous Nebari user at a government geoscience organization
              </figcaption>
            </figure>
          </SwiperSlide>
          <SwiperSlide>
            <figure className="py-10 px-24 text-white">
              <blockquote className="before:relative before:top-[45px] before:left-[-30px] text-[1.8rem] before:text-[10rem] italic font-semibold leading-[2.7rem] before:text-white before:content-['“']">
                <p className="mb-[1em]">
                  We chose Nebari to help manage our Kubernetes services better.
                  With no full-time DevOps person, we needed a solution that
                  could efficiently help us manage our cloud resources securely,
                  as code. JupyterLab was not part of our motivation for
                  choosing Nebari, but has been a very pleasant surprise-
                  helping both with internal collaboration and onboarding new
                  resources much more rapidly.
                </p>
              </blockquote>
              <figcaption className="mb-[4em] text-[1.8rem] font-bold leading-[2.7rem]">
                ~ Sanjay Patel, CTO at Confluency
              </figcaption>
            </figure>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>

    <section className="flex flex-col items-center py-28 px-12 mx-auto max-w-layout">
      <h2 className="mb-[1em] text-[4.2rem] leading-[1.16] text-center font-heading">
        Frequently Asked Questions
      </h2>
      <div className="w-full text-[1.6rem] font-normal leading-[1.3] sm:px-[3.4rem] xl:px-[11.5rem]">
        <details className="py-12 px-4 space-y-8 border-b border-b-gray-300">
          <summary className="text-[2.8rem] font-bold leading-[1.1] font-heading">
            How can I use Nebari as the platform for my team?
          </summary>
          <p className="max-w-prose">
            The first step to using Nebari is{' '}
            <a
              href="https://www.nebari.dev/docs/get-started/installing-nebari"
              className="underline decoration-from-font underline-offset-4"
            >
              installing and deploying
            </a>{' '}
            your Nebari instance. You can then add your team members to your
            instance, and help them start working on the platform, leveraging
            the compute and tools your Nebari instance provides. Our services
            support you throughout this process.
          </p>
        </details>
        <details className="py-12 px-4 space-y-8 border-b border-b-gray-300">
          <summary className="text-[2.8rem] font-bold leading-[1.1] font-heading">
            How can I use Nebari as a blueprint to build my in-house platform?
          </summary>
          <p className="max-w-prose">
            Nebari is a free and open source project. You can go through the{' '}
            <a
              href="https://github.com/nebari-dev/nebari"
              className="underline decoration-from-font underline-offset-4"
            >
              Nebari codebase hosted on GitHub
            </a>{' '}
            to understand how we built it. If you have questions or need help
            building your own system, we&rsquo;ll be happy to support you! We
            can discuss a custom support package for your needs:{' '}
            <Link href="/about-us#bookacallform">
              <a
                className="underline decoration-from-font underline-offset-4"
                onClick={() =>
                  prefillContactFormMessage(
                    "Hi, I'm interested in learning more about your Nebari Services options. Thanks!",
                  )
                }
              >
                Contact us.
              </a>
            </Link>
          </p>
        </details>
        <details className="py-12 px-4 space-y-8 border-b border-b-gray-300">
          <summary className="text-[2.8rem] font-bold leading-[1.1] font-heading">
            Do you offer options for support hours only?
          </summary>
          <p className="max-w-prose">
            Yes! We can discuss a custom support package for your needs:{' '}
            <Link href="/about-us#bookacallform">
              <a
                className="underline decoration-from-font underline-offset-4"
                onClick={() =>
                  prefillContactFormMessage(
                    "Hi, I'm interested in learning more about your Nebari Services options. Thanks!",
                  )
                }
              >
                Contact us.
              </a>
            </Link>
          </p>
        </details>
        <details className="py-12 px-4 space-y-8 border-b border-b-gray-300">
          <summary className="text-[2.8rem] font-bold leading-[1.1] font-heading">
            Do you offer options for training only?
          </summary>
          <p className="max-w-prose">
            Yes! You can choose from our catalog of{' '}
            <a
              href="https://quansight.com/training"
              className="underline decoration-from-font underline-offset-4"
            >
              advanced PyData training courses
            </a>
            , or we can discuss a custom training package for your team:{' '}
            <Link href="/about-us#bookacallform">
              <a
                className="underline decoration-from-font underline-offset-4"
                onClick={() =>
                  prefillContactFormMessage(
                    "Hi, I'm interested in learning more about your Nebari Services options. Thanks!",
                  )
                }
              >
                Contact us.
              </a>
            </Link>
          </p>
        </details>
        <details className="py-12 px-4 space-y-8 border-b border-b-gray-300">
          <summary className="text-[2.8rem] font-bold leading-[1.1] font-heading">
            Can I access GPUs on Nebari?
          </summary>
          <p className="max-w-prose">
            Yes! You can configure certain instances with GPUs, and manage who
            (users and groups) can access it.
          </p>
        </details>
        <details className="py-12 px-4 space-y-8 border-b border-b-gray-300">
          <summary className="text-[2.8rem] font-bold leading-[1.1] font-heading">
            How does Nebari compare SaaS products like Anaconda Enterprise,
            Coiled, Databricks, Domino Cloud, Posit Cloud, Saturn Cloud, etc.?
          </summary>
          <p className="max-w-prose">
            Some companies offer data science platforms as a subscription
            service. They each solve unique problems and can be a great fit for
            certain use cases, for example if you need only Dask or Spark on the
            cloud, you will be able to find companies that specialize in these
            domains. These companies are friends in the ecosystem, and we
            encourage you to evaluate each option for your specific needs.
          </p>
          <p className="max-w-prose">
            Nebari is primarily designed as a free and open source project for
            the complete data science workflow, that can be quickly setup and
            used by anyone without needing DevOps experience. The Nebari
            services offered by Quansight help you work with Nebari.
          </p>
          <p className="max-w-prose">
            Another useful resource for comparing options is the{' '}
            <a
              href="https://docs.2i2c.org/en/latest/about/service/comparison.html#overview-of-services"
              className="underline decoration-from-font underline-offset-4"
            >
              2i2c documentation
            </a>
            .
          </p>
        </details>
        <details className="py-12 px-4 space-y-8 border-b border-b-gray-300">
          <summary className="text-[2.8rem] font-bold leading-[1.1] font-heading">
            How does Nebari compare to Cloud SaaS platforms like AWS Sagemaker?
          </summary>
          <p className="max-w-prose">
            Several cloud providers offer their own SaaS products that integrate
            with their cloud infrastructure. The most popular such platform is
            AWS Sagemaker. Typically, these are designed for a support a broad
            range of common use cases, and hence support widely used libraries
            like PyTorch and Tensorflow, as well as some vendor-specific tools.
          </p>
          <p className="max-w-prose">
            Nebari takes a very different approach because designed to be
            vendor-agnostic. You can deploy it on any major cloud provider or
            your in-house HPC cluster. Flexibility is one of the core values for
            Nebari development, so it can adapt to your needs and support any
            tool/library/service with minimal effort.
          </p>
          <p className="max-w-prose">
            You can select the approach that works best for your team.
          </p>
        </details>
        <details className="py-12 px-4 space-y-8 border-b border-b-gray-300">
          <summary className="text-[2.8rem] font-bold leading-[1.1] font-heading">
            How does Nebari support compare to offerings from other consulting
            companies like Anaconda and QuantStack?
          </summary>
          <p className="max-w-prose">
            Many consulting companies offer to build a fresh platform specific
            to your needs, and most tend to use OSS tools like Nebari&rsquo;s
            internals. This can be a great option if you&rsquo;re looking for a
            custom solution.
          </p>
          <p className="max-w-prose">
            Nebari was born out of a similar need within Quansight, where
            developers required a collaborative platform to work on client
            projects. We created Nebari to be flexible and customizable from the
            beginning, which allowed us to use it for a range of different
            client projects. We have also deployed custom Nebari instances
            tailored for client needs within their infrastructure.
          </p>
          <p className="max-w-prose">
            Each consultancy has expertise with specific tools or cloud
            providers, and you can select one that fits your requirements.
          </p>
          <p className="max-w-prose">
            As creators of Nebari, Quansight has expertise with major cloud
            providers (AWS, GCP, Azure, and Digital Ocean), Dask, Holoviz
            ecosystem of visualization, environment management, Python
            geospatial stack. As a consulting company, Quansight specializes in
            several open source PyData libraries. If you&rsquo;re unsure about
            your options, we can help bring clarity to your requirements:{' '}
            <Link href="/about-us#bookacallform">
              <a
                className="underline decoration-from-font underline-offset-4"
                onClick={() =>
                  prefillContactFormMessage(
                    "Hi, I'm interested in learning more about your Nebari Services options. Thanks!",
                  )
                }
              >
                Contact us.
              </a>
            </Link>
          </p>
        </details>
      </div>

      <div className="py-[1.7rem] px-[3.5rem] mt-[6rem] text-center bg-[#BA18DD]">
        <Link href="/about-us#bookacallform">
          <a
            className="after:ml-[0.5em] text-[1.7rem] font-bold text-white after:content-[url(/nebari-services/right-pointing-triangle.svg)] font-heading"
            onClick={() =>
              prefillContactFormMessage(
                "Hi, I'm interested in learning more about your Nebari Services options. Thanks!",
              )
            }
          >
            Contact Sales
          </a>
        </Link>
      </div>
    </section>

    <section className="flex flex-col items-center py-36 px-12 bg-black md:bg-white">
      <div className="mb-[1em] max-w-[70rem] text-[3rem] font-bold tracking-wide leading-[1.43] text-center text-white md:text-black font-heading">
        <h2 className="inline">Learn more</h2> about Nebari deployment,
        training, and support.
      </div>
      <div className="py-[1.8rem] px-[2.9rem] mb-[1rem] text-center bg-[#EAB54E]">
        <a
          href="https://a.storyblok.com/f/147759/x/ca2cc06c40/more-about-nebari-services.pdf"
          className="after:ml-[1em] text-[1.7rem] font-bold text-white after:content-[url(/nebari-services/right-pointing-triangle.svg)] font-heading"
        >
          Download the PDF
        </a>
      </div>
    </section>
  </Layout>
);

export const getStaticProps: GetStaticProps<
  TContainerProps,
  ISlugParams
> = async ({ preview = false }) => {
  const footer = await getFooter(preview);
  const header = await getHeader(preview);
  return {
    props: {
      data: {} as PageItem,
      header,
      footer,
      preview,
    },
  };
};

export default NebariServicesPage;
