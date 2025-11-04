"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "@/app/globals.module.css";
import Link from "next/link";

export default function ProgramDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/programs/${encodeURIComponent(id)}`, {
          cache: "no-store"
        });

        if (!res.ok) {
          throw new Error("Program not found");
        }

        const data = await res.json();
        setProgram(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.background}>
        <div className={styles.registerContainer}>
          <h2>Loading program details...</h2>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className={styles.background}>
        <div className={styles.registerContainer}>
          <h2>Program Not Found</h2>
          <p style={{ color: 'red' }}>{error || "Could not find the requested program."}</p>
          <Link href="/search">Back to Search</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.background}>
      <div className={styles.resultsCol}>
        {/* Header Section */}
        <div className={styles.ctaRow} style={{ justifyContent: "space-between", alignItems: "center" }}>
          <h1 className={styles.pageTitle}>Program Details</h1>
          <button
            onClick={() => router.back()}
            className={styles.secondaryCtaBtn}
          >
            Back
          </button>
        </div>

        {/* Main Program Card */}
        <div className={styles.resultCard} style={{ background: "#f7d2d2", marginBottom: 24 }}>
          {program.courseCode && (
            <div style={{
              fontSize: "1.1rem",
              color: "#666",
              marginBottom: 8,
              fontFamily: "'Jetbrains Mono', monospace"
            }}>
              {program.courseCode}
            </div>
          )}

          <h2 className={styles.cardTitle} style={{ fontSize: "2.2rem", marginBottom: 12 }}>
            {program.programName}
          </h2>

          <p className={styles.cardMeta} style={{ marginBottom: 8 }}>
            {program.universityName}
            {program.facultyName ? ` · ${program.facultyName}` : ""} · {program.location}
          </p>

          {program.degreeName && (
            <p className={styles.cardMeta} style={{
              background: "#8EE6E7",
              display: "inline-block",
              padding: "6px 12px",
              borderRadius: 8,
              marginTop: 8
            }}>
              {program.degreeName}
            </p>
          )}
        </div>

        {/* Description Section */}
        {program.description && (
          <div className={styles.resultCard} style={{ marginBottom: 24 }}>
            <h3 className={styles.cardTitle} style={{ marginBottom: 12 }}>
              Program Description
            </h3>
            <p style={{
              fontSize: "1.2rem",
              lineHeight: 1.6,
              fontFamily: "'Sarabun', sans-serif"
            }}>
              {program.description}
            </p>
          </div>
        )}

        {/* Area of Study Section */}
        {program.areaOfStudy && (
          <div className={styles.resultCard} style={{ marginBottom: 24 }}>
            <h3 className={styles.cardTitle} style={{ marginBottom: 12 }}>
              Area of Study
            </h3>
            <p style={{
              fontSize: "1.2rem",
              fontFamily: "'Sarabun', sans-serif"
            }}>
              {program.areaOfStudy}
            </p>
          </div>
        )}

        {/* Prerequisites Section */}
        {program.prerequisites && (
          <div className={styles.resultCard} style={{ marginBottom: 24 }}>
            <h3 className={styles.cardTitle} style={{ marginBottom: 12 }}>
              Prerequisites
            </h3>
            <p style={{
              fontSize: "1.2rem",
              lineHeight: 1.6,
              fontFamily: "'Sarabun', sans-serif"
            }}>
              {program.prerequisites}
            </p>
          </div>
        )}

        {/* Call to Action Section */}
        <div className={styles.ctaRow} style={{ gap: 16, marginTop: 32 }}>
          {program.websiteLink && (
            <a
              href={program.websiteLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.registerBtn}
              style={{ textDecoration: "none", textAlign: "center" }}
            >
              Visit Official Website
            </a>
          )}

          <Link
            href="/search"
            className={styles.secondaryCtaBtn}
            style={{ textDecoration: "none", textAlign: "center" }}
          >
            Find Similar Programs
          </Link>
        </div>
      </div>
    </div>
  );
}
