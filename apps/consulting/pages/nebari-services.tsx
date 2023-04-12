import React, { FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import { GetStaticProps } from 'next';
import Image from 'next/image';
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
import nebariLogoWhite from '../public/nebari-services/nebari-logo-white.svg';
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

    <div className="h-[100px] w-full overflow-hidden bg-[#000]"></div>

    <div className="nebari-hero-background relative mx-auto h-[52.4rem] max-w-full sm:h-[calc(780px_-_40vw)] lg:h-[36.7rem]">
      <div className="relative flex h-full w-full flex-col items-center px-[2rem] pt-[13rem] sm:pt-[calc(280px_-_23.4vw)] md:absolute md:px-0 lg:pt-[4rem]">
        <Image
          className="mb-[20px] brightness-200"
          alt="Nebari logo"
          src={nebariLogoWhite}
        />
        <h1 className="font-heading mb-[1rem] px-[5.2rem] text-center text-[4.6rem] font-extrabold leading-[1] tracking-wide text-white md:text-[5.6rem] md:leading-[1.2]">
          Nebari Services
        </h1>
        <p className="mb-[2em] text-[1.6em] text-white">
          Deployment, support, and training
        </p>
        <div className="bg-violet mb-[6rem] py-[1.2rem] px-[3rem] text-center">
          <Link
            href="/about-us#bookacallform"
            className="font-heading text-[1.7rem] font-bold text-white after:ml-[0.5em] after:content-[url(/nebari-services/right-pointing-triangle.svg)]"
            onClick={() =>
              prefillContactFormMessage(
                "Hi, I'm interested in learning more about your Nebari Services options. Thanks!",
              )
            }
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </div>

    <section className="max-w-layout mx-auto flex flex-col flex-nowrap items-center py-24 px-8 lg:px-[13rem]">
      <h2 className="font-heading mb-[1em] text-center text-[4.2rem] font-bold leading-[1] tracking-wide md:text-[4.8rem]">
        What is Nebari?
      </h2>
      <p className="mx-auto mb-[3.7rem] max-w-prose text-center text-[1.6rem] leading-[2.7rem]">
        <span className="font-bold">
          Nebari is on open source data science platform{' '}
        </span>
        for teams with serious computational and collaboration needs, looking
        to:
      </p>
      <ul className="mb-[4rem] w-[100%] max-w-[900px] list-none md:mb-[5rem] md:columns-2 md:gap-[82px]">
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
            className="mb-[1em] flex max-w-prose text-[1.6rem] font-bold leading-[2.7rem] before:relative before:top-[6px] before:mr-[1em] before:h-[36px] before:w-[39px] before:shrink-0 before:bg-[url(/nebari-services/quansight-logo.svg)] before:bg-contain before:bg-no-repeat"
          >
            {txt}
          </li>
        ))}
      </ul>
      {/* eslint-disable jsx-a11y/media-has-caption */}
      <video controls className="mb-[7rem] w-[100%] max-w-[900px] px-8 md:p-0">
        <source src="https://a.storyblok.com/f/147759/x/00ddc13b05/nebari-features.mp4" />
        <p>
          A silent video demo of Nebari features using screen recordings and
          slides
        </p>
      </video>
      {/* eslint-enable jsx-a11y/media-has-caption */}
      <div className="bg-violet mb-[1rem] py-[1.8rem] px-[2.9rem] text-center">
        <Link
          href="/about-us#bookacallform"
          className="font-heading text-[1.7rem] font-bold text-white after:ml-[1em] after:content-[url(/nebari-services/right-pointing-triangle.svg)]"
          onClick={() =>
            prefillContactFormMessage(
              'Hi, please send me a login to a demo instance of Nebari so I can check it out. Thanks!',
            )
          }
        >
          Try Nebari
        </Link>
      </div>
      <p className="max-w-prose px-[10rem] text-center text-[1.4rem] font-[400] italic leading-[1.7rem] text-[rgba(0,0,0,1)]">
        Drop us a line and we&rsquo;ll send you a login
      </p>
    </section>

    <section className="bg-gray-200">
      <h2 className="sr-only">Used by</h2>
      <div className="max-w-layout mx-auto flex flex-col items-center space-y-20 p-20 md:flex-row md:justify-evenly md:space-y-0 md:space-x-8 md:overflow-hidden md:py-2 md:px-32">
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

    <section className="max-w-layout mx-auto flex flex-col items-center py-24 px-8">
      <h2 className="font-heading mb-[0.9em] text-center text-[4.2rem] font-bold leading-[1]">
        Service Packages
      </h2>
      <p className="mb-[2em] text-center text-[1.6rem] leading-[1.6] md:max-w-[1016px]">
        Nebari is designed to be deployed and managed without DevOps expertise.
        However, if you need a helping hand, require special customizations, or
        have complex existing infrastructure, Quansight has some service
        offerings to help you reach your goals.
      </p>
      <p className="mb-[2em] text-center text-[1.6rem] leading-[1.6] md:max-w-[1016px]">
        As the creators of Nebari, we know it inside and out, and understand the
        underlying tools, including JupyterHub and Dask. We&apos;re experts in
        data science solutions, and have years of experience deploying and using
        Nebari for various client projects.
      </p>

      <div className="bg-pink mb-[6rem] py-[1.7rem] px-[3.5rem] text-center">
        <Link
          href="/about-us#bookacallform"
          className="font-heading text-[1.7rem] font-bold text-white after:ml-[0.5em] after:content-[url(/nebari-services/right-pointing-triangle.svg)]"
          onClick={() =>
            prefillContactFormMessage(
              "Hi, I'm interested in learning more about your Nebari Services options. Thanks!",
            )
          }
        >
          Contact Sales
        </Link>
      </div>

      <div className="mx:auto w-full max-w-[405px] px-[10%] md:grid md:max-w-[1016px] md:grid-cols-3 md:gap-6 md:p-0">
        {/* Starter */}
        <div className="mb-[5.4rem] flex min-h-[55rem] flex-col">
          <h3 className="bg-violet font-heading p-8 text-center text-[3rem] font-bold tracking-wide text-white">
            Starter
          </h3>
          <p className="grow border-b  border-b-black bg-gray-200 py-7 px-1 text-center text-[1.6rem] font-[600] italic leading-[2.6rem] tracking-wide md:h-[12rem] md:grow-0 md:px-2">
            Need some assistance with setup
          </p>
          <ul className="grow-[3] list-none bg-gray-200 p-8">
            {[
              'Evaluate needs',
              'Deploy Nebari on your infrastructure',
              'Admin training',
              '1 month of support via email',
            ].map((txt) => (
              <li
                key={txt}
                className="mb-[8%] flex text-[1.6rem] leading-[2.3rem] tracking-wide before:relative before:top-[6px] before:mr-[1em] before:h-[10px] before:w-[13px] before:shrink-0 before:bg-[url(/nebari-services/purple-check-mark.svg)] before:bg-contain before:bg-no-repeat"
              >
                {txt}
              </li>
            ))}
          </ul>
          <div className="bg-pink font-heading p-7 text-center text-[4rem] font-bold tracking-wide text-white">
            $5k
          </div>
        </div>

        {/* Standard */}
        <div className="mb-[5.4rem] flex min-h-[55rem] flex-col">
          <h3 className="bg-violet font-heading p-8 text-center text-[3rem] font-bold tracking-wide text-white">
            Standard
          </h3>
          <p className="grow border-b border-b-black bg-gray-200 py-7 px-1 text-center text-[1.6rem] font-[600] italic leading-[2.6rem] tracking-wide md:h-[12rem] md:grow-0 md:px-2">
            Need assistance with setup, onboarding users, and migrating
            workflows
          </p>
          <ul className="grow-[3] list-none bg-gray-200 p-8 md:grow">
            {[
              'All Starter-tier services',
              'User training (up to 15 people)',
              'Single sign-on integration',
              '10 hours of custom/integration work',
              '3 months of support via email and issue tracker',
            ].map((txt) => (
              <li
                key={txt}
                className="mb-[8%] flex text-[1.6rem] leading-[2.3rem] tracking-wide before:relative before:top-[6px] before:mr-[1em] before:h-[10px] before:w-[13px] before:shrink-0 before:bg-[url(/nebari-services/purple-check-mark.svg)] before:bg-contain before:bg-no-repeat"
              >
                {txt}
              </li>
            ))}
          </ul>
          <div className="bg-pink font-heading p-7 text-center text-[4rem] font-bold tracking-wide text-white">
            $20k
          </div>
        </div>

        {/* Plus */}
        <div className="mb-[5.4rem] flex min-h-[55rem] flex-col">
          <h3 className="bg-violet font-heading p-8 text-center text-[3rem] font-bold tracking-wide text-white">
            Plus
          </h3>
          <p className="grow border-b border-b-black bg-gray-200 py-7 px-1 text-center text-[1.6rem] font-[600] italic leading-[2.6rem] tracking-wide md:flex md:h-[12rem] md:grow-0 md:items-center md:px-2">
            Need assistance with setup, onboarding users, migrating workflows,
            and custom integrations
          </p>
          <ul className="grow-[3] list-none bg-gray-200 p-8 md:flex md:flex-col">
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
                className="mb-[8%] flex shrink text-[1.6rem] leading-[2.3rem] tracking-wide before:relative before:top-[6px] before:mr-[1em] before:h-[10px] before:w-[13px] before:shrink-0 before:bg-[url(/nebari-services/purple-check-mark.svg)] before:bg-contain before:bg-no-repeat"
              >
                {txt}
              </li>
            ))}
          </ul>
          <div className="bg-pink font-heading p-7 text-center text-[4rem] font-bold tracking-wide text-white">
            $50k
          </div>
        </div>
      </div>

      <div className="mb-[3.4em] w-full max-w-[405px] px-[10%] md:grid md:max-w-[1016px] md:grid-cols-2 md:gap-10 md:p-0">
        <div className="mb-[3.4rem] flex flex-col">
          <h3 className="bg-violet font-heading p-8 text-center text-[3rem] font-bold tracking-wide text-white">
            Fully managed
          </h3>
          <p className="grow bg-gray-200 py-10 px-4 text-center text-[1.6rem] font-[500] leading-[2.6rem] tracking-wide">
            Nebari deployment on your infrastructure, completely managed and
            maintained by Quansight, with dedicated user support.
          </p>
        </div>

        <div className="mb-[3.4rem] flex flex-col">
          <h3 className="bg-violet font-heading p-8 text-center text-[3rem] font-bold tracking-wide text-white">
            Event services
          </h3>
          <p className="grow bg-gray-200 py-10 px-4 text-center text-[1.6rem] font-[500] leading-[2.6rem] tracking-wide">
            One-time Nebari deployment and management to run tutorials and
            workshops, with user and infrastructure support during the event.{' '}
          </p>
        </div>
      </div>

      <h3 className="font-heading mb-[1em] text-center text-[3rem] font-bold leading-[4.3rem] tracking-wide">
        Interested in Nebari services,
        <br />
        or a more customized solution?
      </h3>

      <div className="bg-pink mb-[1.9rem] py-[1.7rem] px-[3.5rem] text-center">
        <Link
          href="/about-us#bookacallform"
          className="font-heading text-[1.7rem] font-bold text-white after:ml-[0.5em] after:content-[url(/nebari-services/right-pointing-triangle.svg)]"
          onClick={() =>
            prefillContactFormMessage(
              "Hi, I'm interested in learning more about your Nebari Services options. Thanks!",
            )
          }
        >
          Contact Sales
        </Link>
      </div>

      <ul
        className="flex grow-[3] flex-col p-8"
        style={{
          listStyleImage: 'url(/nebari-services/purple-check-mark.svg)',
        }}
      >
        {[
          'A guided, hands-on Nebari demo',
          'Custom integrations',
          'Enterprise-level support',
          'General Nebari questions',
        ].map((txt) => (
          <li
            key={txt}
            className="mb-[0.4em] text-[1.9rem] font-[700] tracking-wide"
          >
            {txt}
          </li>
        ))}
      </ul>
    </section>

    <section className="bg-violet">
      <h2 className="sr-only">Testimonials</h2>
      <div
        className="max-w-layout mx-auto p-4 sm:px-[3.4rem] xl:px-[11.5rem]"
        style={{
          background:
            'url(/nebari-services/quansight-logo-violet-grayscale.svg) right bottom / 325px no-repeat',
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
              <blockquote className="text-[1.8rem] font-semibold italic leading-[2.7rem] before:relative before:top-[45px] before:left-[-30px] before:text-[10rem] before:text-white before:content-['“']">
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
              <blockquote className="text-[1.8rem] font-semibold italic leading-[2.7rem] before:relative before:top-[45px] before:left-[-30px] before:text-[10rem] before:text-white before:content-['“']">
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
              <blockquote className="text-[1.8rem] font-semibold italic leading-[2.7rem] before:relative before:top-[45px] before:left-[-30px] before:text-[10rem] before:text-white before:content-['“']">
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
              <blockquote className="text-[1.8rem] font-semibold italic leading-[2.7rem] before:relative before:top-[45px] before:left-[-30px] before:text-[10rem] before:text-white before:content-['“']">
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
              <blockquote className="text-[1.8rem] font-semibold italic leading-[2.7rem] before:relative before:top-[45px] before:left-[-30px] before:text-[10rem] before:text-white before:content-['“']">
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

    <section className="max-w-layout mx-auto flex flex-col items-center py-28 px-12">
      <h2 className="font-heading mb-[1em] text-center text-[4.2rem] leading-[1.16]">
        Frequently Asked Questions
      </h2>
      <div className="w-full text-[1.6rem] font-normal leading-[1.3] sm:px-[3.4rem] xl:px-[11.5rem]">
        {[
          [
            'How can I use Nebari as the platform for my team?',
            <>
              <p>
                The first step to using Nebari is{' '}
                <a
                  href="https://www.nebari.dev/docs/get-started/installing-nebari"
                  className="underline decoration-from-font underline-offset-4"
                >
                  installing and deploying
                </a>{' '}
                your Nebari instance. You can then add your team members to your
                instance and help them start working on the platform, leveraging
                the compute and tools your Nebari instance provides. Our
                services support you throughout this process.
              </p>
            </>,
          ],
          [
            'How can I use Nebari as a blueprint to build my in-house platform?',
            <>
              <p>
                Nebari is a free and open source project. You can go through the
                Nebari codebase hosted on GitHub to understand how we built it.
                If you have questions or need help building your own system,
                we&rsquo;ll be happy to support you! We can discuss a custom
                support package for your needs:{' '}
                <Link
                  href="/about-us#bookacallform"
                  className="underline decoration-from-font underline-offset-4"
                  onClick={() =>
                    prefillContactFormMessage(
                      "Hi, I'm interested in learning more about your Nebari Services options. Thanks!",
                    )
                  }
                >
                  Contact us.
                </Link>
              </p>
            </>,
          ],
          [
            'Do you offer options for support hours only?',
            <>
              <p>
                Yes! We can discuss a custom support package for your needs:{' '}
                <Link
                  href="/about-us#bookacallform"
                  className="underline decoration-from-font underline-offset-4"
                  onClick={() =>
                    prefillContactFormMessage(
                      "Hi, I'm interested in learning more about your Nebari Services options. Thanks!",
                    )
                  }
                >
                  Contact us.
                </Link>
              </p>
            </>,
          ],
          [
            'Do you offer options for training only?',
            <>
              <p>
                Yes! You can choose from our catalog of{' '}
                <a
                  href="https://quansight.com/training"
                  className="underline decoration-from-font underline-offset-4"
                >
                  advanced PyData training courses
                </a>
                , or we can discuss a custom training package for your team:{' '}
                <Link
                  href="/about-us#bookacallform"
                  className="underline decoration-from-font underline-offset-4"
                  onClick={() =>
                    prefillContactFormMessage(
                      "Hi, I'm interested in learning more about your Nebari Services options. Thanks!",
                    )
                  }
                >
                  Contact us.
                </Link>
              </p>
            </>,
          ],
          [
            'Can I access GPUs on Nebari?',
            <>
              <p>
                Yes! You can configure certain instances with GPUs and manage
                who (users and groups) can access it.
              </p>
            </>,
          ],
          [
            'How does Nebari compare to SaaS products like Anaconda Enterprise, Coiled, Databricks, Domino Cloud, Posit Cloud, Saturn Cloud, etc.?',
            <>
              <p>
                Some companies offer data science platforms as a subscription
                service. They each solve unique problems and can be a great fit
                for certain use cases. For example, if you need only Dask or
                Spark on the cloud, you will be able to find companies that
                specialize in these domains. These companies are almost always
                friends of ours in the ecosystem, and we encourage you to
                evaluate each option for your specific needs.
              </p>
              <p>
                Nebari is primarily designed as a free and open source project
                for the complete data science workflow with customized MLops
                integrations. It can be quickly set up and used by anyone
                without needing DevOps experience. The Nebari services offered
                by Quansight help you work with Nebari to provide immediate
                value to your business.
              </p>
              <p>
                Another useful resource for comparing options is the{' '}
                <a
                  href="https://docs.2i2c.org/en/latest/about/service/comparison.html#overview-of-services"
                  className="underline decoration-from-font underline-offset-4"
                >
                  2i2c documentation
                </a>
                .
              </p>
            </>,
          ],
          [
            'How does Nebari compare to Cloud SaaS platforms like AWS Sagemaker?',
            <>
              <p>
                Several cloud providers offer their own SaaS products that
                integrate with their cloud infrastructure. The most popular such
                platform is AWS Sagemaker. Typically, these are designed to
                support a broad range of common use cases. They also support
                widely used libraries like PyTorch and Tensorflow, as well as
                some vendor-specific tools.
              </p>
              <p>
                Nebari takes a different approach because it is designed to be
                cloud and vendor agnostic. You can deploy it on any major cloud
                provider or on your on-prem HPC cluster or Kubernetes cluster.
                You can use it to integrate with any open source or
                vendor-supplied product. Flexibility is one of the core values
                for Nebari development, so it can adapt to your needs and
                support any tool/library/service with minimal effort.
              </p>
              <p>You can select the approach that works best for your team.</p>
            </>,
          ],
          [
            'How does Quansight and Nebari compare to 2i2c’s managed JupyterHub cloud service?',
            <>
              <p>
                Quansight counts 2i2c as a friend organization. They implement a
                similar approach of providing services around open source tools.
                We both use the model of providing managed services on top of
                open source thereby avoiding vendor lock-in. Where 2i2c manages
                a JupyterHub installation, Quansight manages Nebari which
                provides JupyterHub plus powerful environment management,
                built-in scalable computing, visualization capability, workflow
                scheduling, AI/ML tools, and more.
              </p>
              <p>
                Where 2i2c primarily targets academic and research institutions,
                Quansight primarily targets companies and government agencies.
                Quansight will fully manage your Nebari installation in a way
                that you can always “take over” and manage it yourself. We want
                to help every organization enable their data-curious subject
                matter experts to build powerful models, dashboards, and
                applications easily while quickly taking advantage of the
                evolving landscape of powerful open-source tools.
              </p>
            </>,
          ],
          [
            'Can I obtain Nebari support from other companies?  Is Nebari support available through the OpenTeams general open source support contract?',
            <>
              <p>
                While Quansight sponsored the creation of Nebari, the project is
                built on community-driven open source foundations and is now
                itself a community-driven project. As a result, any company can
                provide support for Nebari.
              </p>
              <p>
                As creators of Nebari, Quansight has deep expertise with major
                cloud providers (AWS, GCP, Azure, and Digital Ocean), Dask,
                Panel and Holoviz ecosystem of visualization, environment
                management, as well as Python’s geospatial stack. It is likely
                that Quansight will provide you the best support for Nebari.
              </p>
              <p>
                In fact, OpenTeams, which is an open source support marketplace,
                uniquely works with us at Quansight to provide support for
                Nebari as part of its general open source support offering. You
                can contact{' '}
                <a
                  href="mailto:connect@openteams.com"
                  className="underline decoration-from-font underline-offset-4"
                >
                  connect@openteams.com
                </a>{' '}
                for more information about their offering.
              </p>
              <p>
                Using Quansight (or OpenTeams) to provide Nebari support will
                provide not only the most efficient answers to your support
                questions, but also be able to engage with the creators of the
                library to help you build custom solutions on top.{' '}
                <Link
                  href="/about-us#bookacallform"
                  className="underline decoration-from-font underline-offset-4"
                  onClick={() =>
                    prefillContactFormMessage(
                      "Hi, I'm interested in learning more about your Nebari Services options. Thanks!",
                    )
                  }
                >
                  Contact us.
                </Link>
              </p>
            </>,
          ],
        ].map(([question, answer]) => (
          <details
            key={String(question)}
            className="space-y-8 border-b border-b-gray-300 py-12 px-4"
          >
            <summary className="font-heading text-[2.8rem] font-bold leading-[1.1]">
              {question}
            </summary>
            <div className="max-w-prose space-y-8">{answer}</div>
          </details>
        ))}
      </div>

      <div className="bg-violet mt-[6rem] py-[1.7rem] px-[3.5rem] text-center">
        <Link
          href="/about-us#bookacallform"
          className="font-heading text-[1.7rem] font-bold text-white after:ml-[0.5em] after:content-[url(/nebari-services/right-pointing-triangle.svg)]"
          onClick={() =>
            prefillContactFormMessage(
              "Hi, I'm interested in learning more about your Nebari Services options. Thanks!",
            )
          }
        >
          Contact Sales
        </Link>
      </div>
    </section>

    <section className="flex flex-col items-center bg-black py-36 px-12 md:bg-white">
      <div className="font-heading mb-[1em] max-w-[70rem] text-center text-[3rem] font-bold leading-[1.43] tracking-wide text-white md:text-black">
        <h2 className="inline">Learn more</h2> about Nebari deployment,
        training, and support.
      </div>
      <div className="bg-pink mb-[1rem] py-[1.8rem] px-[2.9rem] text-center">
        <a
          href="https://a.storyblok.com/f/147759/x/9c608eb5e1/quansight-more-about-nebari-services.pdf"
          className="font-heading text-[1.7rem] font-bold text-white after:ml-[1em] after:content-[url(/nebari-services/right-pointing-triangle.svg)]"
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
