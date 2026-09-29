import Link from "next/link";

import styles from "./about.module.css";

export const metadata = {
  title: "About",
  description:
    "Learn about the mission and vision behind Trust Church.",
};

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>About Trust Church</p>

          <h1>
            Faith should
            <br />
            <span>move us.</span>
          </h1>

          <p className={styles.heroCopy}>
            We believe God has called His people to something greater than
            Sunday services.
          </p>
        </div>
      </section>

      <section className={styles.introduction}>
        <div className={styles.container}>
          <div className={styles.twoColumn}>
            <p className={styles.sectionLabel}>Why we exist</p>

            <div className={styles.largeCopy}>
              <p>
                Trust Church exists to awaken hearts, unite the Church, and
                step boldly into the mission of Christ; bringing hope,
                healing, and transformation to a broken world.
              </p>

              <p>
                Our vision is simple, yet profound:
                <strong>
                  {" "}
                  to love God deeply and to love people practically.
                </strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.mission}>
        <div className={styles.container}>
          <div className={styles.missionGrid}>
            <div className={styles.missionHeading}>
              <p className={styles.sectionLabel}>Our mission</p>

              <h2>Beyond the walls.</h2>
            </div>

            <div className={styles.missionCopy}>
              <p>
                Loving people practically means moving beyond the walls of the
                church and into the streets, schools, neighborhoods, and
                communities; wherever there is a need.
              </p>

              <p>
                We believe Christians are called to give their time, resources,
                gifts, and love in service to others. Faith is not passive.
                It should be visible in the way we care for people and respond
                to the needs around us.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.values}>
        <div className={styles.container}>
          <div className={styles.valuesHeader}>
            <p className={styles.sectionLabel}>What guides us</p>

            <h2>A faith that becomes action.</h2>
          </div>

          <div className={styles.valueGrid}>
            <article>
              <span>01</span>

              <h3>Love God</h3>

              <p>
                A life centered on Christ, shaped by worship, prayer, trust,
                and obedience.
              </p>
            </article>

            <article>
              <span>02</span>

              <h3>Love people</h3>

              <p>
                Meet people with compassion, dignity, generosity, and genuine
                care.
              </p>
            </article>

            <article>
              <span>03</span>

              <h3>Do good</h3>

              <p>
                Put faith into motion through service, generosity, and work
                that makes a real difference.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.callout}>
        <div className={styles.container}>
          <div className={styles.calloutInner}>
            <p className={styles.sectionLabel}>Together</p>

            <div>
              <h2>
                A bigger mission than any one of us can accomplish alone.
              </h2>

              <p>
                Trust Church calls people into a life surrendered to Christ,
                united in His body, and committed to bringing glory to God
                through worship and good works.
              </p>

              <Link href="/volunteer" className={styles.button}>
                Find a way to serve
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}