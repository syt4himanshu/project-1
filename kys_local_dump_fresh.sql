--
-- PostgreSQL database dump
--

\restrict xfNf5YQqRQ1h3EJxxGeo9LLKhbqYBDJEgkmSNkICbepXbkaQWFc6yzZYicXGNli

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: CareerObjective; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CareerObjective" (
    id integer NOT NULL,
    student_id integer NOT NULL,
    career_goal character varying(50) NOT NULL,
    specific_details text,
    clarity_preparedness character varying(20),
    interested_in_campus_placement boolean,
    campus_placement_reasons text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."CareerObjective" OWNER TO postgres;

--
-- Name: CareerObjective_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CareerObjective_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CareerObjective_id_seq" OWNER TO postgres;

--
-- Name: CareerObjective_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CareerObjective_id_seq" OWNED BY public."CareerObjective".id;


--
-- Name: CoCurricularOrganization; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CoCurricularOrganization" (
    id integer NOT NULL,
    student_id integer NOT NULL,
    name character varying(255),
    date date,
    level character varying(100),
    remark character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."CoCurricularOrganization" OWNER TO postgres;

--
-- Name: CoCurricularOrganization_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CoCurricularOrganization_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CoCurricularOrganization_id_seq" OWNER TO postgres;

--
-- Name: CoCurricularOrganization_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CoCurricularOrganization_id_seq" OWNED BY public."CoCurricularOrganization".id;


--
-- Name: CoCurricularParticipation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CoCurricularParticipation" (
    id integer NOT NULL,
    student_id integer NOT NULL,
    name character varying(255),
    date date,
    level character varying(100),
    awards character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."CoCurricularParticipation" OWNER TO postgres;

--
-- Name: CoCurricularParticipation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CoCurricularParticipation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CoCurricularParticipation_id_seq" OWNER TO postgres;

--
-- Name: CoCurricularParticipation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CoCurricularParticipation_id_seq" OWNED BY public."CoCurricularParticipation".id;


--
-- Name: Faculty; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Faculty" (
    id integer NOT NULL,
    email character varying(120) NOT NULL,
    first_name character varying(120),
    last_name character varying(120),
    contact_number character varying(20),
    user_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."Faculty" OWNER TO postgres;

--
-- Name: Faculty_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Faculty_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Faculty_id_seq" OWNER TO postgres;

--
-- Name: Faculty_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Faculty_id_seq" OWNED BY public."Faculty".id;


--
-- Name: Internship; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Internship" (
    id integer NOT NULL,
    student_id integer NOT NULL,
    company_name character varying(255),
    domain character varying(255),
    internship_type character varying(20),
    paid_unpaid character varying(10),
    start_date date,
    end_date date,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."Internship" OWNER TO postgres;

--
-- Name: Internship_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Internship_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Internship_id_seq" OWNER TO postgres;

--
-- Name: Internship_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Internship_id_seq" OWNED BY public."Internship".id;


--
-- Name: MentoringMinute; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MentoringMinute" (
    id integer NOT NULL,
    student_id integer NOT NULL,
    faculty_id integer NOT NULL,
    semester integer NOT NULL,
    date date,
    remarks text,
    suggestion text,
    action text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."MentoringMinute" OWNER TO postgres;

--
-- Name: MentoringMinute_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."MentoringMinute_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."MentoringMinute_id_seq" OWNER TO postgres;

--
-- Name: MentoringMinute_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."MentoringMinute_id_seq" OWNED BY public."MentoringMinute".id;


--
-- Name: PastEducation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PastEducation" (
    id integer NOT NULL,
    student_id integer NOT NULL,
    exam_name character varying(100) NOT NULL,
    percentage double precision NOT NULL,
    year_of_passing integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."PastEducation" OWNER TO postgres;

--
-- Name: PastEducation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PastEducation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PastEducation_id_seq" OWNER TO postgres;

--
-- Name: PastEducation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PastEducation_id_seq" OWNED BY public."PastEducation".id;


--
-- Name: PostAdmissionAcademicRecord; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PostAdmissionAcademicRecord" (
    id integer NOT NULL,
    student_id integer NOT NULL,
    semester integer NOT NULL,
    sgpa double precision NOT NULL,
    backlog_subjects text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."PostAdmissionAcademicRecord" OWNER TO postgres;

--
-- Name: PostAdmissionAcademicRecord_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PostAdmissionAcademicRecord_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PostAdmissionAcademicRecord_id_seq" OWNER TO postgres;

--
-- Name: PostAdmissionAcademicRecord_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PostAdmissionAcademicRecord_id_seq" OWNED BY public."PostAdmissionAcademicRecord".id;


--
-- Name: Project; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Project" (
    id integer NOT NULL,
    student_id integer NOT NULL,
    title character varying(255),
    description character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."Project" OWNER TO postgres;

--
-- Name: Project_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Project_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Project_id_seq" OWNER TO postgres;

--
-- Name: Project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Project_id_seq" OWNED BY public."Project".id;


--
-- Name: SWOC; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SWOC" (
    id integer NOT NULL,
    student_id integer NOT NULL,
    strengths text,
    weaknesses text,
    opportunities text,
    challenges text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."SWOC" OWNER TO postgres;

--
-- Name: SWOC_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SWOC_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SWOC_id_seq" OWNER TO postgres;

--
-- Name: SWOC_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SWOC_id_seq" OWNED BY public."SWOC".id;


--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- Name: Skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Skills" (
    id integer NOT NULL,
    student_id integer NOT NULL,
    programming_languages text,
    technologies_frameworks text,
    domains_of_interest text,
    familiar_tools_platforms text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."Skills" OWNER TO postgres;

--
-- Name: Skills_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Skills_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Skills_id_seq" OWNER TO postgres;

--
-- Name: Skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Skills_id_seq" OWNED BY public."Skills".id;


--
-- Name: Student; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Student" (
    id integer NOT NULL,
    uid character varying(20) NOT NULL,
    first_name character varying(120),
    middle_name character varying(120),
    last_name character varying(120),
    semester integer,
    section character varying(10),
    year_of_admission integer,
    user_id integer NOT NULL,
    mentor_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."Student" OWNER TO postgres;

--
-- Name: StudentPersonalInfo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StudentPersonalInfo" (
    id integer NOT NULL,
    student_id integer NOT NULL,
    mobile_no character varying(20) NOT NULL,
    personal_email character varying(255) NOT NULL,
    college_email character varying(255) NOT NULL,
    linked_in_id character varying(255) NOT NULL,
    permanent_address text NOT NULL,
    dob date NOT NULL,
    gender character varying(10) NOT NULL,
    father_name character varying(120) NOT NULL,
    father_mobile_no character varying(20) NOT NULL,
    father_email character varying(255),
    father_occupation character varying(255) NOT NULL,
    mother_name character varying(120) NOT NULL,
    mother_mobile_no character varying(20) NOT NULL,
    mother_email character varying(255),
    mother_occupation character varying(255) NOT NULL,
    emergency_contact_name character varying(120) NOT NULL,
    emergency_contact_number character varying(20) NOT NULL,
    blood_group character varying(5),
    category character varying(20),
    aadhar_number character varying(14),
    mis_uid character varying(50),
    github_id character varying(255),
    present_address text,
    guardian_name character varying(120),
    guardian_mobile character varying(15),
    guardian_email character varying(255),
    photo_url text,
    photo_public_id character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."StudentPersonalInfo" OWNER TO postgres;

--
-- Name: StudentPersonalInfo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."StudentPersonalInfo_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."StudentPersonalInfo_id_seq" OWNER TO postgres;

--
-- Name: StudentPersonalInfo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."StudentPersonalInfo_id_seq" OWNED BY public."StudentPersonalInfo".id;


--
-- Name: Student_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Student_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Student_id_seq" OWNER TO postgres;

--
-- Name: Student_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Student_id_seq" OWNED BY public."Student".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    username character varying(120) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(20) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: career_activity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.career_activity (
    id integer NOT NULL,
    student_id integer NOT NULL,
    activity_name character varying(255) NOT NULL,
    score_rank character varying(50) NOT NULL,
    exam_date date
);


ALTER TABLE public.career_activity OWNER TO postgres;

--
-- Name: career_activity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.career_activity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.career_activity_id_seq OWNER TO postgres;

--
-- Name: career_activity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.career_activity_id_seq OWNED BY public.career_activity.id;


--
-- Name: career_dev_activity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.career_dev_activity (
    id integer NOT NULL,
    student_id integer NOT NULL,
    activity character varying(100) NOT NULL,
    score character varying(50),
    test_date date
);


ALTER TABLE public.career_dev_activity OWNER TO postgres;

--
-- Name: career_dev_activity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.career_dev_activity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.career_dev_activity_id_seq OWNER TO postgres;

--
-- Name: career_dev_activity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.career_dev_activity_id_seq OWNED BY public.career_dev_activity.id;


--
-- Name: career_objective; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.career_objective (
    id integer NOT NULL,
    student_id integer NOT NULL,
    career_goal character varying(50) NOT NULL,
    specific_details text,
    clarity_preparedness character varying(20),
    interested_in_campus_placement boolean,
    campus_placement_reasons text,
    non_technical_areas character varying(255),
    student_mentor_interest character varying(20),
    expectations_from_institute text,
    placement_type character varying(50),
    higher_studies_type character varying(50),
    higher_studies_location character varying(20)
);


ALTER TABLE public.career_objective OWNER TO postgres;

--
-- Name: career_objective_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.career_objective_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.career_objective_id_seq OWNER TO postgres;

--
-- Name: career_objective_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.career_objective_id_seq OWNED BY public.career_objective.id;


--
-- Name: co_curricular_organization; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.co_curricular_organization (
    id integer NOT NULL,
    student_id integer NOT NULL,
    name text,
    date date,
    level character varying(100),
    remark text
);


ALTER TABLE public.co_curricular_organization OWNER TO postgres;

--
-- Name: co_curricular_organization_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.co_curricular_organization_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.co_curricular_organization_id_seq OWNER TO postgres;

--
-- Name: co_curricular_organization_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.co_curricular_organization_id_seq OWNED BY public.co_curricular_organization.id;


--
-- Name: co_curricular_participation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.co_curricular_participation (
    id integer NOT NULL,
    student_id integer NOT NULL,
    name text,
    date date,
    level character varying(100),
    awards text
);


ALTER TABLE public.co_curricular_participation OWNER TO postgres;

--
-- Name: co_curricular_participation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.co_curricular_participation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.co_curricular_participation_id_seq OWNER TO postgres;

--
-- Name: co_curricular_participation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.co_curricular_participation_id_seq OWNED BY public.co_curricular_participation.id;


--
-- Name: faculty; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.faculty (
    id integer NOT NULL,
    email character varying(120) NOT NULL,
    first_name character varying(120),
    last_name character varying(120),
    contact_number character varying(20),
    user_id integer
);


ALTER TABLE public.faculty OWNER TO postgres;

--
-- Name: faculty_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.faculty_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.faculty_id_seq OWNER TO postgres;

--
-- Name: faculty_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.faculty_id_seq OWNED BY public.faculty.id;


--
-- Name: internship; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.internship (
    id integer NOT NULL,
    student_id integer NOT NULL,
    company_name character varying(255),
    domain character varying(255),
    internship_type character varying(20),
    paid_unpaid character varying(10),
    start_date date,
    end_date date,
    designation character varying(120),
    description text
);


ALTER TABLE public.internship OWNER TO postgres;

--
-- Name: internship_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.internship_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.internship_id_seq OWNER TO postgres;

--
-- Name: internship_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.internship_id_seq OWNED BY public.internship.id;


--
-- Name: mentoring_minute; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mentoring_minute (
    id integer NOT NULL,
    student_id integer NOT NULL,
    faculty_id integer NOT NULL,
    semester integer NOT NULL,
    date date,
    remarks text,
    suggestion text,
    action text,
    faculty_name_snapshot character varying(255),
    faculty_email_snapshot character varying(255)
);


ALTER TABLE public.mentoring_minute OWNER TO postgres;

--
-- Name: mentoring_minute_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mentoring_minute_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mentoring_minute_id_seq OWNER TO postgres;

--
-- Name: mentoring_minute_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mentoring_minute_id_seq OWNED BY public.mentoring_minute.id;


--
-- Name: password_reset_token; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_reset_token (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    used boolean NOT NULL
);


ALTER TABLE public.password_reset_token OWNER TO postgres;

--
-- Name: password_reset_token_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.password_reset_token_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.password_reset_token_id_seq OWNER TO postgres;

--
-- Name: password_reset_token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.password_reset_token_id_seq OWNED BY public.password_reset_token.id;


--
-- Name: past_education; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.past_education (
    id integer NOT NULL,
    student_id integer NOT NULL,
    exam_name character varying(100) NOT NULL,
    percentage double precision,
    year_of_passing integer,
    exam_score double precision,
    exam_date date,
    board character varying(100),
    exam_type character varying(100)
);


ALTER TABLE public.past_education OWNER TO postgres;

--
-- Name: past_education_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.past_education_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.past_education_id_seq OWNER TO postgres;

--
-- Name: past_education_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.past_education_id_seq OWNED BY public.past_education.id;


--
-- Name: post_admission_academic_record; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post_admission_academic_record (
    id integer NOT NULL,
    student_id integer NOT NULL,
    semester integer NOT NULL,
    sgpa double precision NOT NULL,
    backlog_subjects text,
    season character varying(20),
    year_of_passing integer,
    college_rank character varying(100),
    academic_awards character varying(255),
    backlog_count integer
);


ALTER TABLE public.post_admission_academic_record OWNER TO postgres;

--
-- Name: post_admission_academic_record_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.post_admission_academic_record_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.post_admission_academic_record_id_seq OWNER TO postgres;

--
-- Name: post_admission_academic_record_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.post_admission_academic_record_id_seq OWNED BY public.post_admission_academic_record.id;


--
-- Name: project; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project (
    id integer NOT NULL,
    student_id integer NOT NULL,
    title text,
    description text,
    project_guide character varying(255)
);


ALTER TABLE public.project OWNER TO postgres;

--
-- Name: project_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.project_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_id_seq OWNER TO postgres;

--
-- Name: project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.project_id_seq OWNED BY public.project.id;


--
-- Name: skill_program; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.skill_program (
    id integer NOT NULL,
    student_id integer NOT NULL,
    course_title character varying(255),
    platform character varying(255),
    duration_hours double precision,
    date_from date,
    date_to date
);


ALTER TABLE public.skill_program OWNER TO postgres;

--
-- Name: skill_program_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.skill_program_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.skill_program_id_seq OWNER TO postgres;

--
-- Name: skill_program_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.skill_program_id_seq OWNED BY public.skill_program.id;


--
-- Name: skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.skills (
    id integer NOT NULL,
    student_id integer NOT NULL,
    programming_languages text,
    technologies_frameworks text,
    domains_of_interest text,
    familiar_tools_platforms text,
    technical_soft_skills_overall text,
    additional_technical_skills text,
    additional_soft_skills text
);


ALTER TABLE public.skills OWNER TO postgres;

--
-- Name: skills_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.skills_id_seq OWNER TO postgres;

--
-- Name: skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.skills_id_seq OWNED BY public.skills.id;


--
-- Name: student; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student (
    id integer NOT NULL,
    uid character varying(20) NOT NULL,
    first_name character varying(120),
    middle_name character varying(120),
    last_name character varying(120),
    semester integer,
    section character varying(10),
    current_year integer,
    year_of_admission integer,
    user_id integer,
    mentor_id integer,
    admission_type character varying(20),
    passout_year integer
);


ALTER TABLE public.student OWNER TO postgres;

--
-- Name: student_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.student_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.student_id_seq OWNER TO postgres;

--
-- Name: student_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.student_id_seq OWNED BY public.student.id;


--
-- Name: student_personal_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_personal_info (
    id integer NOT NULL,
    student_id integer NOT NULL,
    mobile_no character varying(20) NOT NULL,
    personal_email character varying(255) NOT NULL,
    college_email character varying(255) NOT NULL,
    linked_in_id character varying(255) NOT NULL,
    permanent_address text NOT NULL,
    dob date NOT NULL,
    gender character varying(10) NOT NULL,
    father_name character varying(120) NOT NULL,
    father_mobile_no character varying(20) NOT NULL,
    father_email character varying(255),
    father_occupation character varying(255) NOT NULL,
    mother_name character varying(120) NOT NULL,
    mother_mobile_no character varying(20) NOT NULL,
    mother_email character varying(255),
    mother_occupation character varying(255) NOT NULL,
    emergency_contact_name character varying(120) NOT NULL,
    emergency_contact_number character varying(20) NOT NULL,
    photo_url text,
    photo_public_id character varying(255),
    blood_group character varying(5),
    category character varying(20),
    aadhar_number character varying(14),
    mis_uid character varying(50),
    github_id character varying(255),
    present_address text,
    guardian_name character varying(120),
    guardian_mobile character varying(15),
    guardian_email character varying(255)
);


ALTER TABLE public.student_personal_info OWNER TO postgres;

--
-- Name: student_personal_info_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.student_personal_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.student_personal_info_id_seq OWNER TO postgres;

--
-- Name: student_personal_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.student_personal_info_id_seq OWNED BY public.student_personal_info.id;


--
-- Name: swoc; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.swoc (
    id integer NOT NULL,
    student_id integer NOT NULL,
    strengths text,
    weaknesses text,
    opportunities text,
    challenges text
);


ALTER TABLE public.swoc OWNER TO postgres;

--
-- Name: swoc_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.swoc_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.swoc_id_seq OWNER TO postgres;

--
-- Name: swoc_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.swoc_id_seq OWNED BY public.swoc.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    username character varying(120) NOT NULL,
    email character varying(120),
    password_hash character varying(255) NOT NULL,
    role character varying(20) NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: CareerObjective id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CareerObjective" ALTER COLUMN id SET DEFAULT nextval('public."CareerObjective_id_seq"'::regclass);


--
-- Name: CoCurricularOrganization id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CoCurricularOrganization" ALTER COLUMN id SET DEFAULT nextval('public."CoCurricularOrganization_id_seq"'::regclass);


--
-- Name: CoCurricularParticipation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CoCurricularParticipation" ALTER COLUMN id SET DEFAULT nextval('public."CoCurricularParticipation_id_seq"'::regclass);


--
-- Name: Faculty id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Faculty" ALTER COLUMN id SET DEFAULT nextval('public."Faculty_id_seq"'::regclass);


--
-- Name: Internship id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Internship" ALTER COLUMN id SET DEFAULT nextval('public."Internship_id_seq"'::regclass);


--
-- Name: MentoringMinute id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MentoringMinute" ALTER COLUMN id SET DEFAULT nextval('public."MentoringMinute_id_seq"'::regclass);


--
-- Name: PastEducation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PastEducation" ALTER COLUMN id SET DEFAULT nextval('public."PastEducation_id_seq"'::regclass);


--
-- Name: PostAdmissionAcademicRecord id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PostAdmissionAcademicRecord" ALTER COLUMN id SET DEFAULT nextval('public."PostAdmissionAcademicRecord_id_seq"'::regclass);


--
-- Name: Project id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project" ALTER COLUMN id SET DEFAULT nextval('public."Project_id_seq"'::regclass);


--
-- Name: SWOC id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SWOC" ALTER COLUMN id SET DEFAULT nextval('public."SWOC_id_seq"'::regclass);


--
-- Name: Skills id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Skills" ALTER COLUMN id SET DEFAULT nextval('public."Skills_id_seq"'::regclass);


--
-- Name: Student id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Student" ALTER COLUMN id SET DEFAULT nextval('public."Student_id_seq"'::regclass);


--
-- Name: StudentPersonalInfo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudentPersonalInfo" ALTER COLUMN id SET DEFAULT nextval('public."StudentPersonalInfo_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Name: career_activity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.career_activity ALTER COLUMN id SET DEFAULT nextval('public.career_activity_id_seq'::regclass);


--
-- Name: career_dev_activity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.career_dev_activity ALTER COLUMN id SET DEFAULT nextval('public.career_dev_activity_id_seq'::regclass);


--
-- Name: career_objective id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.career_objective ALTER COLUMN id SET DEFAULT nextval('public.career_objective_id_seq'::regclass);


--
-- Name: co_curricular_organization id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.co_curricular_organization ALTER COLUMN id SET DEFAULT nextval('public.co_curricular_organization_id_seq'::regclass);


--
-- Name: co_curricular_participation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.co_curricular_participation ALTER COLUMN id SET DEFAULT nextval('public.co_curricular_participation_id_seq'::regclass);


--
-- Name: faculty id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculty ALTER COLUMN id SET DEFAULT nextval('public.faculty_id_seq'::regclass);


--
-- Name: internship id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.internship ALTER COLUMN id SET DEFAULT nextval('public.internship_id_seq'::regclass);


--
-- Name: mentoring_minute id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mentoring_minute ALTER COLUMN id SET DEFAULT nextval('public.mentoring_minute_id_seq'::regclass);


--
-- Name: password_reset_token id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_token ALTER COLUMN id SET DEFAULT nextval('public.password_reset_token_id_seq'::regclass);


--
-- Name: past_education id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.past_education ALTER COLUMN id SET DEFAULT nextval('public.past_education_id_seq'::regclass);


--
-- Name: post_admission_academic_record id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_admission_academic_record ALTER COLUMN id SET DEFAULT nextval('public.post_admission_academic_record_id_seq'::regclass);


--
-- Name: project id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project ALTER COLUMN id SET DEFAULT nextval('public.project_id_seq'::regclass);


--
-- Name: skill_program id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skill_program ALTER COLUMN id SET DEFAULT nextval('public.skill_program_id_seq'::regclass);


--
-- Name: skills id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills ALTER COLUMN id SET DEFAULT nextval('public.skills_id_seq'::regclass);


--
-- Name: student id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student ALTER COLUMN id SET DEFAULT nextval('public.student_id_seq'::regclass);


--
-- Name: student_personal_info id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_personal_info ALTER COLUMN id SET DEFAULT nextval('public.student_personal_info_id_seq'::regclass);


--
-- Name: swoc id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swoc ALTER COLUMN id SET DEFAULT nextval('public.swoc_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: CareerObjective; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CareerObjective" (id, student_id, career_goal, specific_details, clarity_preparedness, interested_in_campus_placement, campus_placement_reasons, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: CoCurricularOrganization; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CoCurricularOrganization" (id, student_id, name, date, level, remark, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: CoCurricularParticipation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CoCurricularParticipation" (id, student_id, name, date, level, awards, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: Faculty; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Faculty" (id, email, first_name, last_name, contact_number, user_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: Internship; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Internship" (id, student_id, company_name, domain, internship_type, paid_unpaid, start_date, end_date, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: MentoringMinute; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MentoringMinute" (id, student_id, faculty_id, semester, date, remarks, suggestion, action, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: PastEducation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PastEducation" (id, student_id, exam_name, percentage, year_of_passing, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: PostAdmissionAcademicRecord; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PostAdmissionAcademicRecord" (id, student_id, semester, sgpa, backlog_subjects, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: Project; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Project" (id, student_id, title, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: SWOC; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SWOC" (id, student_id, strengths, weaknesses, opportunities, challenges, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SequelizeMeta" (name) FROM stdin;
20260402000000-init-kys-schema.js
20260411212813-add-faculty-indexes.js
20260412000100-add-missing-student-profile-fields.js
20260418000000-add-performance-indexes.js
20260419000000-add-student-photo-columns.js
20260429093000-preserve-mentoring-minutes-on-faculty-delete.js
20260430000000-sync-production-schema-additions.js
\.


--
-- Data for Name: Skills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Skills" (id, student_id, programming_languages, technologies_frameworks, domains_of_interest, familiar_tools_platforms, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: Student; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Student" (id, uid, first_name, middle_name, last_name, semester, section, year_of_admission, user_id, mentor_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: StudentPersonalInfo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StudentPersonalInfo" (id, student_id, mobile_no, personal_email, college_email, linked_in_id, permanent_address, dob, gender, father_name, father_mobile_no, father_email, father_occupation, mother_name, mother_mobile_no, mother_email, mother_occupation, emergency_contact_name, emergency_contact_number, blood_group, category, aadhar_number, mis_uid, github_id, present_address, guardian_name, guardian_mobile, guardian_email, photo_url, photo_public_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, username, password_hash, role, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: career_activity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.career_activity (id, student_id, activity_name, score_rank, exam_date) FROM stdin;
103	1318	Bharatiya Antariksh Hackathon 2025	Top 30/8744 nationwide, Top 3 in category	2025-08-09
104	1318	Geospatial AI Challenge	1st	2024-08-07
105	1318	YCCE Techfest Coding Relay	2nd	2024-08-11
356	1407	Joy of Computing using python	61	2023-07-13
357	1407	Data Mining	62	2025-01-09
358	1407	Master in Data Science	N/A	2025-03-01
118	380	Bhartiya Antariksh Hackathon ISRO	Top 30/8744 nationwide, Top 3 in category	2025-08-09
119	380	Geospatial AI Challenge	1st	2024-08-07
120	380	YCCE Techfest Coding Relay	2nd	2024-08-11
37	687	Blockchain Workshop	--	2025-07-19
38	687	ACM workshop	--	2025-07-25
39	687	--	--	2025-09-09
363	1558	GATE	19.5	2025-02-02
367	1386	SIH(Internal)	3 rank	2024-10-19
124	368	Encipherx	30	2024-07-08
44	693	MS-CIT	97	2022-05-05
125	368	Hackathon(YCCE)	20	2025-08-23
126	368	CTF(BVoc)	5	2024-07-09
459	1577	BAJA SAE INDIA 2023-2024	AIR 6	2023-10-05
372	1560	Apprenticeship at Infosys Springboard	-	2024-12-02
373	1560	Model United Nations	Honarable Mention	2025-01-12
460	1577	BAJA SAE  INDIA 2024-2025	AIR 22	2924-01-14
461	1577	BAJA SAE INDIA 2025-2026	AIR 2 (Phase 1)	2025-01-16
374	1560	Expo	First	2025-02-18
463	1402	Idea 3	2 runner-up	\N
140	320	KLiC certificate in C Programming	70.6	2024-10-21
141	320	NPTEL - Soft skills development	56%	2025-03-11
376	1535	GATE 2025	43323	2025-02-01
264	1380	UI/UX Design	N/A	2024-06-01
145	407	IDEA3 Hackathon	4	2025-07-19
265	1380	Graphic Design	N/A	2024-01-19
466	1546	Java Certification NPTEL	64.47	2024-10-10
380	1540	Research Paper Publication	N/A	2025-10-09
71	709	Speak and spark	%	2025-09-11
381	1540	Hackfusion (hackthon)	N/A	2025-02-21
382	1540	Smart India Hackthon Project Idea Selected	N/A	2024-12-11
74	671	_	_	2025-09-10
468	403	Participated in Technex Hackathon	N/A	\N
385	1439	Sports basket ball	2 position	\N
78	650	Vnit ai ml workshop	N/A	2025-04-26
283	383	IIT BOMBAY TECFEST - 25	5	2024-12-17
157	428	Presentation on "student burnout"	N/A	2025-08-16
284	383	BITS Goa	3	2025-02-07
85	1322	Word relate	7	2025-07-03
86	1322	Vocab enhancement	8	2025-07-10
87	1322	idioms/phrases	9	2025-07-17
285	383	IIIT Nagpur Tantrafeista	2	2024-10-22
90	1332	Hacker Rank	Best 4	2024-09-11
471	1404	Cocubes	64/100	\N
472	1404	Autometa	67/100	\N
386	1439	Sports handball	1 st position	\N
475	317	Insight	N/A	\N
476	317	Hackathon	N/A	\N
181	1334	Debate competition	Participation	2025-04-22
188	1357	Hackathon in Gaikwad Patil	2nd	2025-02-13
189	360	Ycc hackathon	Second round	2025-08-22
391	1417	GATE (CS & IT) 2025	368/18757	2025-02-01
478	426	Bizzare history facts that are not taught in school	N/A	\N
206	1366	Code Code - comparative programming held in sit	10	2025-02-21
207	1366	TSD- comparative programming	1	2025-03-27
394	1410	GATE-2025	331/25130	2025-02-01
395	1436	Sports Basketball	2nd position	\N
396	1436	Sports kho-kho	2nd position	\N
397	1436	Singing	3rd Rank	\N
482	417	Idea hackathon	4th	\N
483	417	Adobe hackathon	None	\N
484	417	Unstop hackathon	None	\N
487	397	Soft skills Management	N/A	\N
404	1541	Automata	26	\N
405	1541	Cocubes	557	\N
490	1324	Data Base Management System - NPTEL	54	2025-03-23
491	1324	Computer Architecture - NPTEL	68	2024-10-26
410	1434	Data Mining and Warehousing NPTEL	59	2025-05-21
411	1434	Japanese Language Proficiency Test (N3)	110/180	2024-12-04
412	1568	C/C++ class	88	2023-12-21
413	1568	Core Java class	78	2024-04-01
415	1526	GATE CSE 2025	AIR 2025	\N
416	1431	Smart India Hackathon(Internal)	3	2024-10-19
419	1559	GATE 2025	20.38	2025-02-01
498	1342	Hackathon -YCCE	2nd	2025-08-23
499	1342	Hackathon - TGPCET	3rd	2025-03-22
500	1342	Hackathon - SVPCET	3rd	2025-01-21
423	1523	Chase the web.	N/A	\N
426	1408	Personal Pitch	23/25	2025-08-25
427	1408	Resume Building	23/25	2025-08-25
504	348	--	--	\N
505	348	--	--	\N
506	348	--	--	\N
507	351	Dataventics Software solutions	N/A	2025-08-25
508	409	Hackathon Nanded	15	2025-01-22
434	1576	certification in java from binary brains	0	2022-08-01
435	1576	certification from binary brain in python	0	2020-06-01
448	1581	Cloud carnival	2nd	2023-10-10
449	1581	Blood donation	N/A	2023-09-12
524	339	N/A	N/A	\N
525	339	N/A	N/A	\N
526	339	N/A	N/A	\N
527	1052	Cricket Player	2	2024-09-12
\.


--
-- Data for Name: career_dev_activity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.career_dev_activity (id, student_id, activity, score, test_date) FROM stdin;
\.


--
-- Data for Name: career_objective; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.career_objective (id, student_id, career_goal, specific_details, clarity_preparedness, interested_in_campus_placement, campus_placement_reasons, non_technical_areas, student_mentor_interest, expectations_from_institute, placement_type, higher_studies_type, higher_studies_location) FROM stdin;
2	414	higher_studies	I want to pursue M.tech in Cybersecurity from an IIT. If I am forced to go for a job, I'll apply for the role of Linux Administrator.	satisfactory	f	N/A	\N	\N	\N	\N	\N	\N
4	662	higher_studies	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
5	659	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
6	366	entrepreneur	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
7	688	job_oriented	Android/software development	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
8	704	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
9	660	higher_studies	I want crack GATE exam with a good rank.	good	t	N/A	\N	\N	\N	\N	\N	\N
10	647	job_oriented	I want to become a backend developer	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
11	364	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
12	667	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
13	343	job_oriented	Data Analyst and can try more	good	t	N/A	\N	\N	\N	\N	\N	\N
15	653	job_oriented	Pursuing the field of cloud computing	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
17	361	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
18	327	job_oriented	Software developer	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
19	347	higher_studies	Want to go for the M. Tech and also for the PSUs through GATE exam.	good	t	N/A	\N	\N	\N	\N	\N	\N
20	334	higher_studies	wanted to get admitted in Yale University of US for my further studies in AI/ML	good	t	N/A	\N	\N	\N	\N	\N	\N
21	358	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
23	330	job_oriented	-	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
24	357	higher_studies	.	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
25	338	job_oriented	.	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
26	367	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
27	328	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
28	352	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
29	315	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
30	314	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
31	372	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
32	318	higher_studies	MBA amd as well as preparing for civil services .	good	t	N/A	\N	\N	\N	\N	\N	\N
33	360	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
34	326	job_oriented	job with environment,knowledge and good package	good	t	N/A	\N	\N	\N	\N	\N	\N
35	351	job_oriented	Job which is comes with great knowledge and good package	good	t	N/A	\N	\N	\N	\N	\N	\N
36	339	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
37	353	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
38	436	job_oriented	To build a career as a software engineer, focusing on software development, web technologies (HTML, CSS, JavaScript, React), and problem-solving. I aim for a job-oriented role where I can apply my skills in Java, C++, DSA, and web development, while continuously learning new technologies.	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
39	404	job_oriented	.	good	t	N/A	\N	\N	\N	\N	\N	\N
40	439	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
41	401	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
42	319	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
44	381	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
45	386	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
46	669	higher_studies	N/A	good	f	N/A	\N	\N	\N	\N	\N	\N
47	675	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
48	698	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
49	442	job_oriented	"My career objective is to secure a job in software development where I can utilize my skills in Python, Java, Android development, Django, and API integration. I aim to work on real-world projects in AI, ML, and application development, contributing to innovative solutions while continuously enhancing my technical expertise."	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
50	672	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
51	325	higher_studies	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
43	702	job_oriented	PLacements in MNC	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
52	707	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
53	369	job_oriented	Wanna get a good job from which i get enough salary to be happy	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
54	705	job_oriented	My main goal is to clear the GATE exam because it gives chances for government jobs and higher studies. Along with GATE, I also want to try for campus placements to get some industry experience.	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
55	356	higher_studies	MBA/M.tech	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
57	712	job_oriented	data analyst	good	t	N/A	\N	\N	\N	\N	\N	\N
58	683	higher_studies	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
59	668	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
60	324	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
61	382	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
62	664	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
63	344	job_oriented	I want to become a Fullstack Developer	good	t	N/A	\N	\N	\N	\N	\N	\N
64	399	job_oriented	N/A	unsatisfactory	f	N/A	\N	\N	\N	\N	\N	\N
65	687	higher_studies	MBA	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
66	692	job_oriented	I have to get in it job in infosys and then my goal is to prepare for civil services exam	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
67	322	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
68	654	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
69	421	job_oriented	Aspiring software and web developer with a strong foundation in C, C++, Java, HTML, CSS, and JavaScript. Currently enhancing problem-solving skills through Data Structures and Algorithms. Seeking opportunities to apply technical knowledge in real-world projects and contribute to innovative solutions while continuously upskilling.	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
70	693	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
71	695	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
72	679	entrepreneur	Trading and some other business	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
73	680	job_oriented	i want to be a blend of software engineer and a cybersecurity proffesional	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
74	384	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
75	686	entrepreneur	intrested in real estate and import  & export  bussiness	unsatisfactory	f	N/A	\N	\N	\N	\N	\N	\N
76	694	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
77	665	entrepreneur	..	good	f	N/A	\N	\N	\N	\N	\N	\N
78	706	job_oriented	Get placement from college and after some year I want to start my own business	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
79	677	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
16	350	higher_studies	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
1	409	job_oriented	Preparing for Campus Placement	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
80	709	job_oriented	To gain highest placensnts	good	t	N/A	\N	\N	\N	\N	\N	\N
3	1052	placement	Full stacks	good	t	N/A	\N	\N	\N	\N	\N	\N
81	671	higher_studies	To excel in competitive examinations like CAT and GATE, and pursue higher education through M.Tech or MBA from a top institute, thereby enhancing my knowledge, skills, and career prospects.	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
82	415	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
83	329	higher_studies	N/A	unsatisfactory	f	N/A	\N	\N	\N	\N	\N	\N
84	650	higher_studies	Mtech	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
85	689	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
86	648	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
87	1362	higher_studies	N/A	satisfactory	f	N/A	\N	\N	\N	\N	\N	\N
88	1364	higher_studies	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
89	1322	job_oriented	I prefer to do job for atmost 2 years and then do my higher studies and also improve myself and build more stronger.	good	t	N/A	\N	\N	\N	\N	\N	\N
90	1325	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
92	1354	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
93	1321	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
94	1372	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
95	370	higher_studies	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
96	690	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
97	1332	job_oriented	To work at mnc	satisfactory	f	N/A	\N	\N	\N	\N	\N	\N
98	313	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
99	697	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
100	336	higher_studies	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
101	1360	higher_studies	MBA	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
102	422	job_oriented	Securing a job of my interested domain with a decent package.	good	t	N/A	\N	\N	\N	\N	\N	\N
103	684	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
104	378	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
105	1318	job_oriented	Aim to excel in AI ML through industry roles. Apply CV speech and NLP skills from internship and hackathons to solve real world issues. Seek innovative projects and team collaboration. Plan to advance in CV healthcare publish research and take leadership roles.	good	t	N/A	\N	\N	\N	\N	\N	\N
106	405	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
107	380	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
108	700	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
109	1394	job_oriented	To get a job at Nvidia as a tech analyst , or software designer , or coder at Nvidia  \nOr any gaming related company .	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
110	1422	job_oriented	My career goal is to begin my professional journey as a Data Analyst or Software Engineer, where I can apply my problem-solving skills, analytical thinking, and technical knowledge to real-world challenges. I aim to gain hands-on industry experience, improve my expertise in data-driven decision making, and strengthen my programming and software development skills. In the long term, I aspire to grow into a senior role where I can contribute to building impactful solutions, mentor others, and take on greater responsibilities in technology-driven projects	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
111	1344	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
22	355	job_oriented	To obtain a challenging position in a reputable organization where I can apply my technical knowledge, enhance my skills, and contribute to the company’s growth	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
112	331	higher_studies	After btech i will works for 1 yr then i will go for masters	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
113	1438	job_oriented	I have to go for Govt. Job	good	f	N/A	\N	\N	\N	\N	\N	\N
114	332	job_oriented	To secure a good placement from college where I can apply my knowledge, enhance my skills, and contribute effectively to the growth of the organization while building a successful career.	good	t	N/A	\N	\N	\N	\N	\N	\N
115	673	higher_studies	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
116	359	higher_studies	Want to go for Higher Studies (M.S. degree) in foreign country (most likely Germany), Want to study more on Computer Science, Physics, AI/ML	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
117	368	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
118	365	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
119	1407	job_oriented	To build a career in Data Science and Software Development, leveraging my technical skills, analytical abilities, and problem-solving mindset to contribute effectively to innovative projects and team success.	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
120	656	job_oriented	I want to work as full stack developer	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
121	651	job_oriented	For now I usually don't plan after gaining some more skills and logic, I will plan for it.	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
122	435	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
123	346	higher_studies	Mtech via GATE, phd, aimed to be a professor	good	t	N/A	\N	\N	\N	\N	\N	\N
124	703	entrepreneur	a successfull business with strong Background	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
125	320	higher_studies	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
126	708	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
127	1429	job_oriented	To contribute my skills and learn in a professional role.	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
128	387	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
129	407	job_oriented	To build a successful career in the software and technology industry by continuously enhancing my technical and professional skills, gaining practical experience, and contributing effectively to an organization’s growth.	good	t	N/A	\N	\N	\N	\N	\N	\N
130	649	job_oriented	Placements	good	t	N/A	\N	\N	\N	\N	\N	\N
131	428	higher_studies	I want to perceive higher study that is mtech degree right after my graduation.	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
132	406	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
133	1383	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
134	1386	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
135	1417	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
136	1561	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
137	340	job_oriented	1. To build a strong foundation in front-end and back-end web technologies such as HTML, CSS, JavaScript, React, Node.js, and databases.\n\n2. To gain practical exposure by developing responsive and user-friendly websites and deploying them on platforms like GitHub and Vercel.\n\n3. To enhance problem-solving and coding skills that can be applied to real-world web applications.\n\n4. To actively participate in internships, hackathons, and open-source projects related to web development for industry-level experience.\n\n5. To develop expertise in full-stack development and stay updated with the latest frameworks and tools.\n\n6. To pursue a career as a Web Developer / Full-Stack Developer, contributing to building scalable, secure, and efficient web applications.\n\n7. To grow into a professional capable of working in collaborative development environments and eventually explore leadership roles in web development projects	good	f	N/A	\N	\N	\N	\N	\N	\N
138	1382	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
139	1334	higher_studies	Want to pursue Msc in computer Science or a career change	good	t	N/A	\N	\N	\N	\N	\N	\N
140	1535	job_oriented	Want well settled job.	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
142	416	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
144	438	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
143	699	job_oriented	My career goal is to get a good job in the corporate/technical sector where I can apply my skills and continuously learn. I want to gain experience through internships and projects during college, improve my communication and confidence, and finally secure a stable job through campus placements.	good	t	N/A	\N	\N	\N	\N	\N	\N
149	1371	higher_studies	Gate, IIITH masters opportunity	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
153	1336	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
155	1363	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
154	1370	job_oriented	My career goal is to secure a job-oriented path in the technology field, where I can apply my programming skills, problem-solving abilities, and project experience to build practical, real-world solutions. I aim to continuously enhance my technical expertise in areas like software development, full-stack engineering, and system design, while also gaining professional exposure through internships, hackathons, and industry projects. By focusing on a job-ready approach, I want to strengthen both my technical and soft skills so that I can contribute effectively to an organization from the very beginning, grow into higher responsibilities, and build a successful long-term career in the IT industry.	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
145	363	higher_studies	After completing my B Tech, I reckon to study in a foreign University for greater industry exposure.	good	t	N/A	\N	\N	\N	\N	\N	\N
146	1381	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
148	1365	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
158	433	entrepreneur	N/A	good	f	N/A	\N	\N	\N	\N	\N	\N
147	312	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
162	1357	job_oriented	Job in Amazon, google	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
150	432	higher_studies	.	satisfactory	f	N/A	\N	\N	\N	\N	\N	\N
156	1347	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
159	434	job_oriented	N/A	satisfactory	f	N/A	\N	\N	\N	\N	\N	\N
160	1384	higher_studies	Higher studies and also good placement	good	t	N/A	\N	\N	\N	\N	\N	\N
161	1345	higher_studies	Gate and preparation for railways as second priority	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
151	681	higher_studies	I want to join IIM Bangalore course and pursue MBA	good	t	N/A	\N	\N	\N	\N	\N	\N
152	1378	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
157	1353	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
163	1445	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
164	1376	higher_studies	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
165	349	job_oriented	Preparing for job	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
166	1339	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
167	337	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
168	321	job_oriented	I want to become an artificial intelligence engineer	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
169	1359	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
170	652	job_oriented	UPSC	good	f	N/A	\N	\N	\N	\N	\N	\N
171	335	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
172	1346	job_oriented	My objective is to become a skilled Java Developer with expertise in backend development, database management, and problem-solving. I aim to leverage my knowledge of Java, DSA, and web technologies to create impactful solutions. , I want to continuously learn new technologies and contribute to the IT industry with dedication and innovation.”	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
173	1329	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
174	663	higher_studies	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
175	1352	job_oriented	To secure a challenging role in Machine Learning, Artificial Intelligence, or Data Science, where I can apply my programming skills, contribute to real-world projects, and continuously grow through learning and innovation.	good	t	N/A	\N	\N	\N	\N	\N	\N
176	441	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
177	427	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
178	413	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
179	1341	higher_studies	I want to pursue MBA after graduation and then enter the Management field for job	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
180	391	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
181	1426	job_oriented	My career objective is to secure a challenging role in the field of Computer Engineering where I can apply my skills in Web Development, Artificial Intelligence, and Machine Learning to build impactful solutions. I aim to gain practical exposure through campus placement opportunities, contribute effectively to real-world projects, and grow into a versatile software professional with strong expertise in AI-driven applications and analytics.	good	t	N/A	\N	\N	\N	\N	\N	\N
182	400	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
183	385	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
184	379	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
185	377	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
186	1366	job_oriented	To build a career in software development where I can apply my programming and web development skills, learn new technologies, and contribute to organizational growth.	good	t	N/A	\N	\N	\N	\N	\N	\N
187	388	higher_studies	N/A	good	f	N/A	\N	\N	\N	\N	\N	\N
188	419	job_oriented	After graduation I want to sit for various job opportunities	good	t	N/A	\N	\N	\N	\N	\N	\N
189	1373	higher_studies	My career goal is to pursue MTech from a reputed institution	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
190	425	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
191	410	job_oriented	To get good job in college placement	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
192	1437	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
193	1395	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
194	1355	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
195	323	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
196	375	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
197	1351	entrepreneur	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
198	412	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
199	389	job_oriented	Work-exp helps a lot when aiming for top B-Schools.\n\nA decent placement after 4th year will help me substantially when going for an MBA program	good	t	N/A	\N	\N	\N	\N	\N	\N
200	392	higher_studies	GATE	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
201	345	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
202	1416	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
203	1583	job_oriented	.	good	t	N/A	\N	\N	\N	\N	\N	\N
204	395	higher_studies	Tech music	good	f	N/A	\N	\N	\N	\N	\N	\N
205	1444	job_oriented	Highly motivated and detail-oriented Computer Engineering student with practical experience in software development, \nmobile app creation, and web development. Strong problem-solving, system analysis, and cloud infrastructure management skills. Proven \ntrack record of success, including securing 2nd place at State Level Project Competition 2023 for remote control automation system. \nEager to apply my knowledge and contribute to innovative projects in a dynamic development stream.	good	t	N/A	\N	\N	\N	\N	\N	\N
206	1406	job_oriented	To getting job in It company.	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
207	1411	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
208	423	higher_studies	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
209	1403	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
210	396	entrepreneur	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
211	1391	job_oriented	To secure a challenging position as a Software Developer in a growth-oriented IT company where I can apply my knowledge of AI, Express.js, MongoDB, and Web Development, develop real-world applications, and continue expanding my technical skills while contributing to innovative projects.	good	t	N/A	\N	\N	\N	\N	\N	\N
212	1361	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
213	393	higher_studies	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
214	1390	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
215	1435	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
216	418	higher_studies	Want to learn more advance and better skills and want to prepare myself beat from best environment	good	t	N/A	\N	\N	\N	\N	\N	\N
217	1414	job_oriented	To start as a Software Developer, gain hands-on experience in web/backend development, and gradually expand into AI/ML with a long-term goal of combining technical and managerial roles	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
218	445	entrepreneur	Tech entrepreneur	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
219	1387	job_oriented	To secure an entry-level position as a Blockchain Developer / AI-ML Engineer, where I can apply my skills in smart contract development, machine learning, and system design to build scalable, secure, and innovative solutions. My goal is to contribute to real-world projects in Web3, decentralized finance, and AI-driven applications, while continuously enhancing my technical expertise and growing into a full-stack innovator at the intersection of Blockchain and Artificial Intelligence.	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
220	1442	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
221	1581	higher_studies	I want to pursue mtech in any computer related relevant field and if possible I want to get in any top engineering college for my master's.	good	t	N/A	\N	\N	\N	\N	\N	\N
222	420	higher_studies	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
223	1443	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
224	1330	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
228	1425	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
225	430	job_oriented	Focused on mastering AI and machine learning concepts, including advanced knowledge representation and algorithms	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
226	394	entrepreneur	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
227	390	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
229	362	higher_studies	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
230	1584	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
231	1317	job_oriented	Govt Job	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
232	1388	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
233	696	higher_studies	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
234	1380	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
235	1396	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
236	1328	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
237	1385	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
239	354	higher_studies	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
240	1392	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
241	1432	job_oriented	My career goal is to secure a job-oriented role as a Software Developer or Web Developer, where I can apply my skills in Java, C++, SQL, and modern web technologies to develop efficient, scalable, and user-friendly solutions. I aim to gain hands-on industry experience, contribute to impactful projects, and continuously upgrade my knowledge by learning emerging technologies such as angular development .	good	t	N/A	\N	\N	\N	\N	\N	\N
242	1421	job_oriented	To secure an entry-level position in Artificial Intelligence, Machine Learning, or Deep Learning with a focus on research, development, and innovation. Aspire to contribute to advanced projects in AI/ML, pursue research publication, and develop robust, scalable solutions in top technology companies or research labs.	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
243	1350	higher_studies	My aim  is to pursue MTech	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
244	383	job_oriented	Ml based	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
245	1377	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
246	1420	job_oriented	Software Developer, Cloud Engineer	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
247	1327	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
248	1349	higher_studies	I aim to pursue advanced studies in Computer Science with a focus on AI, Machine Learning, and Data Science. I plan to strengthen my knowledge through research, projects, and internships, ultimately preparing for GATE and opportunities in top institutes or research organizations.	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
249	437	job_oriented	To build a strong career in software development by enhancing my skills in Java and database management, gaining practical experience through projects, and contributing effectively to organizational growth while achieving personal development.	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
251	1524	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
252	1413	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
253	1554	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
255	1441	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
256	1560	job_oriented	To leverage my analytical and machine learning skills to develop innovative AI solutions that transform data into actionable insights and drive impactful decision-making.	good	t	N/A	\N	\N	\N	\N	\N	\N
257	1348	higher_studies	MBA	good	t	N/A	\N	\N	\N	\N	\N	\N
258	1410	higher_studies	My primary career goal is to pursue higher studies and build expertise through advanced research in my field of interest. At the same time, I aim to secure a placement opportunity as a backup plan, ensuring industry exposure and practical experience alongside academic growth.	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
259	1424	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
260	1333	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
261	1368	job_oriented	I am aiming to get a job in the domain of AI.	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
262	655	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
263	682	entrepreneur	i want to  grow my family venture	satisfactory	f	N/A	\N	\N	\N	\N	\N	\N
264	657	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
14	311	job_oriented	Aspiring Full Stack & Cloud Professional	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
265	341	entrepreneur	I want to become an entrepreneur who has access to multiple finance assets	good	t	N/A	\N	\N	\N	\N	\N	\N
266	333	higher_studies	To work as a Software Developer at NVIDIA, where I can apply my technical skills in C, C++, Python, along with strengths in communication, leadership, creativity, and event coordination. My goal is to grow into a well paid, impactful professional while continuously upgrading my skills, becoming a strong leader, and contributing to organizational success and sustainable innovations.	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
267	1548	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
268	1574	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
269	317	job_oriented	I complete diploma in government polytechnic Sakoli	good	t	N/A	\N	\N	\N	\N	\N	\N
270	1545	higher_studies	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
271	1379	job_oriented	My career objective is to enter the IT industry in a role that does not require deep programming but focuses on coordination, analysis, problem-solving, client interaction, and management. I am particularly interested in IT services, project management, data handling, and business analysis that align with my skills and career vision.	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
272	1405	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
273	1558	job_oriented	AI/ML	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
274	1398	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
275	1337	entrepreneur	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
276	1547	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
277	676	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
278	1401	entrepreneur	*	satisfactory	f	N/A	\N	\N	\N	\N	\N	\N
279	1549	job_oriented	To leverage my skills in programming, problem-solving, and software development to design and implement efficient, user-focused solutions. Seeking an opportunity to contribute to innovative projects, enhance my technical expertise, and grow as a professional while adding value to the organization.	good	t	N/A	\N	\N	\N	\N	\N	\N
280	1419	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
281	1440	job_oriented	To build a successful career in technology by applying problem-solving skills, gaining expertise in software development, contributing to innovative projects, and growing into a leadership role with continuous learning.	good	t	N/A	\N	\N	\N	\N	\N	\N
282	1555	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
283	1582	higher_studies	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
284	1427	higher_studies	N/A	satisfactory	f	N/A	\N	\N	\N	\N	\N	\N
285	670	higher_studies	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
286	1397	higher_studies	N/A	good	f	N/A	\N	\N	\N	\N	\N	\N
287	443	job_oriented	I want to become a full stack java developer so I am preparing to become a good full stack developer	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
288	1578	entrepreneur	A career in buildership focuses on leadership, innovation, and the ability to create and scale impactful solutions. It’s about taking ownership, turning ideas into reality, and building teams, products, or businesses that create long-term value.	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
289	1389	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
349	1522	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
350	1400	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
290	1556	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
291	1566	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
292	1399	higher_studies	N/A	good	f	N/A	\N	\N	\N	\N	\N	\N
294	1527	job_oriented	To gain expertise in UI/UX, analytics, and product design, while contributing to projects that merge creativity with technology and add value to users.	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
296	1393	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
298	1579	job_oriented	full stack developer	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
299	1428	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
301	1430	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
303	1436	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
293	1540	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
295	1439	higher_studies	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
297	1542	entrepreneur	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
300	1563	job_oriented	also intersested in higher studies	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
302	1412	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
304	1568	job_oriented	Interested in working in software development and AI/ML domain, gaining industry experience, and growing through continuous learning.	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
305	1434	job_oriented	Aspiring Software Developer skilled in C, C++, Python, and front-end (HTML, CSS, JS) with UI/UX expertise. Seeking roles in software, web, or bilingual IT (Eng/Japanese N3) to craft creative, user-focused solutions.	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
306	1564	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
307	1565	higher_studies	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
308	1541	job_oriented	I aspire to build a strong career in the IT sector where I can apply my knowledge of full-stack development, database management, and software engineering to create impactful and innovative solutions. With hands-on experience in developing dynamic and user-friendly websites during my internship and academic projects, I aim to contribute to organizations that value technology-driven growth. My long-term goal is to advance into roles involving system architecture, cloud technologies, and AI/ML integration, while continuously enhancing my technical expertise, problem-solving abilities, and leadership skills. I am eager to work in a challenging environment that encourages learning, collaboration, and innovation, ultimately enabling me to grow into a versatile IT professional.	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
309	1423	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
310	1536	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
311	371	job_oriented	N/A	satisfactory	f	N/A	\N	\N	\N	\N	\N	\N
312	1338	job_oriented	My 1st and basic objective is to get placement in any company due to lack of financial background.	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
313	1526	job_oriented	To work as a Full-Stack Web Developer, contributing to web and mobile applications with AI/ML integration where possible. I aim to build solutions that are practical, user-friendly, and impactful, leveraging my experience from internships and projects, including my ongoing AI-based hands-free Android navigation system for accessibility.	good	t	N/A	\N	\N	\N	\N	\N	\N
314	1431	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
315	1559	job_oriented	I want to get placed into a renowned and good company as an AI/ML engineer who helps develop models to better help the society	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
316	1520	higher_studies	To secure a challenging, job-oriented role in Machine Learning, Artificial Intelligence, and Cybersecurity, where I can apply my skills in software development, data-driven problem solving, and innovative solutions for real-world impact.	good	t	N/A	\N	\N	\N	\N	\N	\N
317	1415	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
318	1518	job_oriented	A good job in a reputed Company with good package.	good	t	N/A	\N	\N	\N	\N	\N	\N
319	1539	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
320	1521	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
321	1538	job_oriented	My career objective is to build a strong foundation as a software developer where I can apply my skills in C, C++, Python, and full-stack web development. In the short term, I want to contribute to impactful projects, enhance my problem-solving abilities, and improve my people-management and teamwork skills.\nIn the long term, I aim to grow into a leadership position where I can guide teams, design scalable solutions, and contribute to the company’s strategic goals. My focus is not only on advancing technically but also on continuously learning and adapting to new technologies such as cloud computing, AI/ML, and DevOps.	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
322	1528	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
323	1534	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
324	1553	job_oriented	Looking forward to data analysis	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
254	1408	job_oriented	I aim to build a career in the field of full stack development and AI/ML.	good	t	N/A	\N	\N	\N	\N	\N	\N
325	691	higher_studies	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
326	1550	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
327	1523	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
328	1575	job_oriented	Enthusiastic Computer Engineering student with solid background in Data\nAnalysis, experienced in Excel, SQL, and Power BI. Strong desire to use analytical\nmind, problem-solving skills, and technical expertise to discover insights and\nenable data-driven decision-making. Looking for an internship position to gain\npractical experience in data analytics and make significant contributions to actual\nbusiness projects.	good	t	N/A	\N	\N	\N	\N	\N	\N
329	1409	job_oriented	I want a job in data science field	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
330	1532	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
331	1572	job_oriented	To build a versatile career where I can leverage my technical expertise in web development and my leadership skills gained through event coordination, while also preparing for SSC CGL to serve in a responsible government position that allows me to contribute to society with integrity and efficiency.	good	t	N/A	\N	\N	\N	\N	\N	\N
332	1573	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
333	1567	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
334	1529	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
335	1576	job_oriented	I am looking job in civil services	good	t	N/A	\N	\N	\N	\N	\N	\N
336	1562	job_oriented	I would like to work in the field of Data science and analytics	good	t	N/A	\N	\N	\N	\N	\N	\N
337	1543	job_oriented	Data analytics	good	t	N/A	\N	\N	\N	\N	\N	\N
338	1580	higher_studies	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
339	1570	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
340	1525	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
341	1515	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
342	1516	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
343	1533	entrepreneur	My career goal is to become a versatile technology professional who combines technical expertise with creativity to build innovative solutions. I aim to apply my skills in Python, data-driven applications, cybersecurity, and game development to contribute to impactful projects, especially in startup-driven and entrepreneurial environments.\n\nIn the long run, I want to bridge technical knowledge with problem-solving for real-world challenges, whether in financial forecasting, digital innovation, or secure systems design. By continuously learning, experimenting, and adapting to new technologies, I aspire to grow into a role where I can lead projects, mentor others, and drive innovation that adds value to both businesses and users.	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
344	1514	job_oriented	I want to opt for higher studies but due to the financial issues at home I want to opt for job first and after everything is stable i would go for higher education.	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
345	1551	job_oriented	IT companies	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
346	1577	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
348	1519	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
347	1517	job_oriented	To get a job in machine learning field	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
361	1320	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
365	1537	entrepreneur	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
356	981	job_oriented	Growth, stability, skill use, advancement, financial security, contribution, and work-life balance.	good	t	N/A	\N	\N	\N	\N	\N	\N
351	1402	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
352	1552	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
354	982	job_oriented	After my graduation my goad is to placed in reputed company and I wanna join there as a Full stack web developer.	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
355	1546	entrepreneur	I aim to build innovative, human-centered solutions that merge technology, creativity, and real-world impact. With a strong foundation in AI, full-stack development, and product design, my goal is to create ventures that not only solve problems but also inspire meaningful change. As an entrepreneur, I seek to explore opportunities where curiosity, persistence, and vision can come together to craft products that stand out for their originality, functionality, and emotional depth.	good	t	N/A	\N	\N	\N	\N	\N	\N
360	701	entrepreneur	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
367	1340	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
353	1433	job_oriented	Final-year Bachelor of Technology student with hands-on project experience in developing machine learning models to address real-world problems and creating front-end web applications. Skilled in various programming languages and data management, with a foundation in data analysis. Eager to apply technical knowledge to collaborate on impactful projects in a forward-thinking company.	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
357	403	job_oriented	I want job.	good	t	N/A	\N	\N	\N	\N	\N	\N
366	1404	job_oriented	My career goal is to become a skilled Data Scientist, where I can apply my knowledge of computer science, programming, and data analysis to solve real-world problems. In the short term, I aim to gain hands-on industry experience through challenging projects in data preprocessing, machine learning, and visualization. I want to strengthen my expertise in Python, SQL, cloud platforms, and data engineering tools while also improving my problem-solving and communication skills. In the long term, I aspire to grow into a data science specialist who not only builds accurate models but also drives business decisions through insights. My ultimate goal is to contribute to innovative solutions in domains like healthcare, finance, or AI applications, while continuously learning and staying updated with new technologies in data science and artificial intelligence.	good	t	N/A	\N	\N	\N	\N	\N	\N
369	666	entrepreneur	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
358	1544	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
359	431	higher_studies	N/A	good	f	N/A	\N	\N	\N	\N	\N	\N
362	1356	entrepreneur	N/A	good	f	N/A	\N	\N	\N	\N	\N	\N
363	424	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
364	408	higher_studies	Civil Services Examination	good	t	N/A	\N	\N	\N	\N	\N	\N
368	1530	job_oriented	N/A	unsatisfactory	f	N/A	\N	\N	\N	\N	\N	\N
370	376	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
371	316	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
372	426	higher_studies	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
373	685	higher_studies	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
374	1531	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
375	444	job_oriented	My career objective is to build a successful career as a software engineer, focusing on full-stack and mobile application development. I aim to gain strong industry experience through campus placements, work on real-world projects, and continuously enhance my technical and problem-solving skills to contribute effectively to the organization.	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
376	417	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
377	983	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
378	411	higher_studies	My career goal is to pursue M.Tech from a reputed institution such as IITs, NITs, IIITs, or IISc. This will help me to strengthen my technical expertise, explore research opportunities, and gain advanced knowledge in my field. In the long term, I aspire to build a successful career in research and development or industry, where I can contribute innovative solutions and create impactful technologies.	good	t	N/A	\N	\N	\N	\N	\N	\N
379	397	entrepreneur	N/A	good	f	N/A	\N	\N	\N	\N	\N	\N
380	1367	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
381	1331	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
382	1324	higher_studies	I would prefer to work in the fast paced AI research field where there are regularly new updates and which has better future security	good	t	N/A	\N	\N	\N	\N	\N	\N
383	1342	job_oriented	My career objective is to grab a placement which perfectly fits like domain.	good	t	N/A	\N	\N	\N	\N	\N	\N
384	1374	higher_studies	Preparing for GATE Exam	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
385	1326	entrepreneur	i wantto be a TRADER	good	f	N/A	\N	\N	\N	\N	\N	\N
386	1335	job_oriented	I want to be a tech employee .	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
91	1323	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
387	440	job_oriented	N/A	good	t	N/A	\N	\N	\N	\N	\N	\N
388	658	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
389	1319	higher_studies	Looking forward to do an internship regarding webdevelopement to gain work experience.  Further I want to give CAT exam and do mba. Besides all this I also want to run my own dance class as my side business.	good	t	N/A	\N	\N	\N	\N	\N	\N
390	348	job_oriented	To Help Poor People.	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
391	1557	job_oriented	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
392	398	higher_studies	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
393	674	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
394	710	job_oriented	N/A	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
395	373	entrepreneur	N/A	satisfactory	f	N/A	\N	\N	\N	\N	\N	\N
396	1375	higher_studies	GATE	unsatisfactory	f	N/A	\N	\N	\N	\N	\N	\N
397	1369	job_oriented	Software Engineer, Full stack Developer in Java Technologies, SDE.	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
250	1358	higher_studies	higher studies along with job	good	f	N/A	\N	\N	\N	\N	\N	\N
238	402	job_oriented	*Web development (Fullstack) -I am currently skilled in Frontend.\n*IoT - I have developed many projects in this domain (Microproject of Sem 3, Sem 4 and many others)\n*AI/ML (I do not have any experience in this domain but aspire to be working in this field as well. )	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
141	1343	placement	N/A	satisfactory	t	N/A	\N	\N	\N	\N	\N	\N
407	1685	higher_studies	jh	unsatisfactory	t	N/A	\N	\N	\N	\N	\N	\N
56	342	Campus / Off-Campus Placement	web dev	Satisfactory	t	\n[[KYS_META]]{"non_technical_areas":"Literary / Debate, Sports, Cultural Activities, Social Service / NSS","student_mentor_interest":"Yes","expectations_from_institute":"wfwfw"}	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: co_curricular_organization; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.co_curricular_organization (id, student_id, name, date, level, remark) FROM stdin;
640	398	BANDSLAM (INSIGHT)	2024-01-23	Institute	N/A
645	1369	ACM CodeDecode	2025-08-18	Department	.
646	1583	.	\N	N/A	.
293	1547	UBA	\N	Department	UBA team Member
294	1547	Infinity	\N	Department	Infinity Team member
86	380	Abhyudhya 24.0	2024-09-29	State	Coordinated Abhyudhya 24.0 socio technical hackathon with SVPCET team. Managed 2000 plus students from Vidharbha on 29 September 2024 at Smruti Mandir Nagpur. Gained teamwork and collaboration skills.
87	380	Antariksh Maha Yatra ISRO	2024-03-21	State	Coordinated Antariksh Maha Yatra with VIBHA and ISRO. Hosted Dr S Somanath ISRO Chairman. Engaged with space tech enthusiasts learned advanced space technology and participated in hands on sessions.
88	380	Technex	2025-01-20	Institute	I&V Member
295	1547	Insight	\N	Institute	Singing Event Co-Cordinator
90	1344	Infinity	\N	Department	as a media team member
165	416	Aster Club - Zenith	2024-03-01	Department	Outreach Coordinator
647	1583	.	\N	N/A	.
166	416	Promotions	\N	N/A	At technex-25 and infinity-24
167	416	Managed Various events	\N	N/A	N/A
300	1582	Infinity	2024-11-04	Department	N/A
301	1386	Power Bi Workshop	2024-10-22	Department	Coordinator
302	1386	ACM(Association for computer Machinery)	\N	International	Technical Member
303	1386	Zenith Forum	\N	Department	Secretary of Zenith Forum
99	435	TECHNEX	2025-01-20	Institute	Decoraton Member
100	435	Infinity	2024-10-05	Department	Registration Member
521	427	Sursangam	2025-01-23	Institute	Co-Coordinator
404	1434	Escaping Ciphers Event in Infinity 2k24 (Coordinator)	2024-08-21	Institute	I was the Coordinator of Escaping Ciphers event in Infinity 2k24. I was able successful cooperate with and lead my team towards a successful event, where we had participation of almost 80 teams in total, 2 people per team.
105	407	Udyo Mohotsav	2025-01-16	National	Registration Member
106	407	Startup Expo Event	2024-10-19	National	Registration Member
32	343	Zenith Forum	2025-08-29	Department	media member
33	343	Mandroid monthly magazine	2025-08-29	Department	media member
532	1552	Infinity	2024-09-13	Department	Promotion team core member
178	1365	Infinity 2K24	2024-10-05	Institute	N/A
179	1365	Insight 2k25	2025-01-24	Institute	N/A
180	1371	MOC of Technex	2025-01-09	National	N/A
181	1371	Event Technologist Head	2025-08-08	International	N/A
535	982	Technex Core Team member	2024-02-12	Institute	N/A
183	681	N/A	\N	Institute	N/A
45	687	Code clash	2025-09-09	Department	Coordinator
46	687	Insight sports	2025-01-22	Institute	--
47	687	National sports day	2025-08-29	Institute	--
49	680	Media Team	2025-08-30	Department	Member of departmental media team
186	434	Discipline team	2024-01-22	Institute	N/A
52	709	CDC cordinator	2025-08-07	N/A	N/A
53	671	upcoming iot workshop	2025-09-10	Institute	_
188	1384	Coordinator	\N	N/A	N/A
55	415	Coastal Clash (Technex 2025)	2025-01-20	Institute	N/A
190	1345	Insights : Promotion	2025-01-24	Institute	Great experience to interact with new ones
334	1399	Documentation and finance head	2025-01-24	Institute	N/A
335	1399	Documentation head infinity	2024-09-13	Department	N/A
336	1399	Sponsorship head insight	2025-01-24	Institute	N/A
62	650	Ecell guest speaker lecture	2025-02-15	Institute	Entrepreneurship skill development
63	650	Ecell induction activity	2025-09-02	Institute	Assigned as head of R & D Dept
195	1426	Infinity	2024-10-12	Department	Registration Member
67	1325	Technex core registration team member	\N	N/A	N/A
339	1527	Media Team Core and Department's Magazine Team	2024-10-01	Department	Designed visually appealing poster and videos for infinity promotion and also designed a magazine for department for the year 2024-2025
197	1355	member	\N	Institute	N/A
71	1360	Vortex	\N	National	N/A
72	1360	CDC event	\N	Institute	N/A
73	1360	CDC mock interview	\N	Institute	N/A
77	1318	Abhyudhya 24.0	2024-09-29	National	Coordinated Abhyudhya 24.0 socio technical hackathon with SVPCET team. Managed 2000 plus students from Vidharbha on 29 September 2024 at Smruti Mandir Nagpur. Gained teamwork and collaboration skills.
78	1318	Antariksh Maha Yatra ISRO	2024-03-21	State	Coordinated Antariksh Maha Yatra with VIBHA and ISRO. Hosted Dr S Somanath ISRO Chairman. Engaged with space tech enthusiasts learned advanced space technology and participated in hands on sessions.
79	1318	Technex	2025-01-20	Institute	I&V Member
202	375	ACM Secretary	2025-08-15	Department	N/A
203	375	Career Development Centre Member	2024-09-01	Institute	Soft Skills team member in CDC, current working as Internship Coordinator
212	423	Infinity	\N	Department	Promotion Member
213	423	Insight	\N	Institute	Promotion member
215	1361	Code-Decode	2025-08-20	Department	N/A
218	1390	Infinity Member	2024-10-05	Department	N/A
219	445	Infinity	2023-09-12	Department	Requirement team member
220	445	Insight	2022-09-12	Institute	Discipline team member
221	445	Technx	2023-09-12	Institute	Requirement team member
223	1387	Cordinator - Decode Derby	2024-05-27	Department	N/A
230	420	Infinity	\N	Department	Member
231	420	Insight	\N	Institute	Member
232	420	Unnat Bharat Abhiyan	\N	National	Student Coordinator
235	1380	Media member in college technex event	2024-01-20	Institute	N/A
237	1328	Ansar sheikh	\N	Department	N/A
240	1421	PowerBI	\N	Institute	N/A
241	1421	ACM Mentor/previous vice chair	\N	N/A	N/A
246	383	Junior Technex	2025-01-18	Department	Technical events
247	383	No	2025-09-10	National	No
248	383	No	2025-09-18	National	No
285	1337	Technex core promotion member 2024-25	\N	Institute	N/A
252	1349	Unnat Bharat Abhiyan	\N	Institute	N/A
253	1349	National Service Scheme	\N	Department	N/A
254	1349	Association for Computing Machinery	\N	Department	N/A
288	1381	infinity registration member	2024-10-12	Department	N/A
648	1583	.	\N	N/A	.
289	1381	Technex core registration	2025-01-21	N/A	N/A
394	1564	Infinity-2k24	2024-10-05	Department	I was the Co-coordinator of the Event- Cracken
395	1564	Infinity-2k23	\N	Department	I was the Core member of the Event- Cracken
399	1565	Technex Coordinator	2025-01-20	National	N/A
400	1565	Infinity Co-Coordinator	2024-10-05	Department	N/A
401	1565	ACM Chairperson	2024-09-20	Institute	N/A
265	1333	Infinity	2024-09-15	Department	I was a decoration core member
266	1333	Insight	2026-01-24	Institute	Sponsorship core member
298	1549	NSS	\N	Department	Active member of the National Service Scheme (NSS), contributing to community development, social service activities, and awareness programs while fostering leadership, teamwork, and social responsibility.
405	1434	Aster Club - Zenith Forum (Coordinator)	2025-01-23	Department	I was the former Coordinator and current Mentor of Aster Club, which is the soft skills club of Zenith Forum of our Department. We successfully managed the club and took various activities like debates, group discussions, mock interviews, alumni interactions, etc. of our members as well as other students, helping them gain confidence and improve their soft skills.
304	330	CII (Member)	2025-07-19	State	N/A
272	333	Mock Interview Drive with Industry Experts	2025-08-30	Institute	Was part of a Mock Interview Drive where I had the opportunity to communicate and coordinate with industry experts, guiding them throughout the event, while also contributing as a member of the media team.
273	333	Friendship Day Jamming Session	2025-08-08	Institute	Coordinated and performed in a Jamming Session organized by the cultural club managed event flow while also contributing through instrument playing and singing to make the event engaging and fun.
406	1434	ACM Chapter Member	2024-08-14	International	I was an active member of ACM chapter. Helped organize various activities.
275	1548	ValoWarz	2024-10-05	Department	Coordinator of Event ValoWarz
407	1393	Association for Computing Machinery	\N	International	I served as the Vice Chair of our ACM chapter
408	1393	National Service Scheme (NSS)	\N	National	I volunteered in NSS by organizing community service activities and awareness programs.
409	1393	I & V Coordinator	\N	Institute	Handled inspections and validations as I & V Coordinator.
315	1561	Infinity 2024	2024-10-05	Department	Escaping Cipher Event Co-Coordinator
316	1561	Insight 2024	2025-02-20	Institute	Cultural Coordinator
281	1545	Ascend club activities	2025-01-08	Department	N/A
282	1407	Mentor (Achiver's Club)	2025-03-05	Department	yes
283	1407	Assessement Coordinate (CDC)	2025-01-23	Institute	no
410	1568	Infinity - Documentation Member	2024-09-18	N/A	N/A
321	1389	Infinity 2k24	2024-10-05	Department	Infinity 2k24, the annual departmental technical event of the Computer Engineering branch, was successfully conducted under the theme RoboVerse. As Co-Coordinator, my role involved supervising the planning and execution of six sub-events, managing logistics and budget, ensuring creative yet cost-effective decorations, and coordinating smoothly with juniors, volunteers, and faculty. The event achieved high student participation and received positive feedback from both students and staff. All sub-events were conducted within the planned budget, showcasing innovation, teamwork, and effective management. Overall, Infinity 2k24 not only met its objectives of technical engagement and student involvement but also provided me with valuable experience in leadership, collaboration, and event management.
322	1389	Online Interviews	2025-03-03	Department	The activity aimed at enhancing communication skills and building confidence. Participants introduced themselves and highlighted their skills, showcasing notable improvement in articulation and clarity. The session proved to be highly interactive and beneficial, fulfilling its objective of providing a practical platform for students to develop their communication abilities.
329	1560	ConvoSphere	2025-01-18	Department	N/A
419	1431	ACM(Association for computer Machinery	\N	International	Website core team
420	1431	Zenith Forum	\N	Department	Media Member
332	1535	UBA Member	\N	National	N/A
333	1535	Co-cordinator	\N	Department	Co-cordinator of a technical Event.
421	1431	Departmental Magazine	\N	Department	Core member of magazine team
338	1540	Event Registration Core Team member	2024-10-05	Department	N/A
340	1527	Coordinated Speak and Spark Event for 2nd year students	2025-07-25	Department	Led and facilitated talent-evaluation events (GD & Pitch Me a Product), ensuring collaborative engagement and smooth execution. Demonstrated empathy, inclusivity, and stakeholder communication in handling over 120 students.
341	1527	Coordinated Salesforce Workshop	2025-08-02	Institute	Coordinated a technical workshop led by a Salesforce professional. Managed logistics, communication, and participant engagement, ensuring successful event delivery. Facilitated student exposure to Salesforce CRM tools and career opportunities.
436	1521	Coding Event	2024-10-05	Department	Code Arina(Infinity)
353	1555	Speak and Spark	2025-07-25	Department	I had the wonderful opportunity to co-coordinate and conduct an engaging ACM activity for two 2nd-year CSE classes, with nearly 120 students actively participating across two days. We organized two exciting rounds:  Group Discussion (GD): Encouraging critical thinking, teamwork, and confidence.  Pitch Me a Product: Where imagination met innovation, and students impressed us with their creative ideas!
363	1542	INFINITY 2024	2024-10-05	Institute	COORDINATOR
364	1542	TECHNEX 2025	2025-01-20	National	REQUIRMENT HEAD
365	1542	ASSOCIATION OF COMPUTING MACHINERY	2024-09-19	International	SECRETARY
366	1417	Association for Computing Machinery (Website Core team Member)	\N	International	N/A
367	1417	National Service Scheme	\N	National	N/A
368	1417	Infinity Documentation Member	\N	Department	N/A
375	1410	Infinity decoration Coordinator - 2024	\N	Institute	N/A
376	1410	Strokes of Art Coordinator - Insight 2025	\N	Institute	N/A
377	1410	Co-Coordinator Artovert club - Zenith forum	\N	Institute	N/A
675	1343	Technical team - ACM	2025-08-28	N/A	N/A
676	414	AWS workshop	2025-03-01	Department	A hands on workshop for the 6th sem students by the Guest lecturer.
683	1052	UBA website team	2024-09-12	Institute	Website development for college
684	1052	ACM Web Master Events	2025-08-12	N/A	ACM Web Master
688	342	firebase	2026-02-20	Department	lead
379	1563	Speak & Spark	\N	Department	Together with my fellow co-coordinators Mersa Joy and Shreya Borde, under the guidance of our Coordinator Amiya P Bovas and with the support of our faculty coordinator Dr. Pallavi Wankhede (shelke), we brought forward two exciting rounds:  Group Discussion (GD): Encouraging critical thinking, communication, and confidence.  Pitch Me a Product: A platform where creativity and innovation truly shined! What made this experience memorable was not just organizing the event but also witnessing the enthusiasm, collaboration, and innovative spirit of the participants. For me, it was a chance to practice leadership, teamwork, event coordination, and public speaking while contributing to a fun and impactful learning space.
382	1412	Insight Decoration team	\N	Institute	Member
383	1412	Basketball team	\N	Institute	Member
511	1533	Cracken(Departmental Event)	2024-10-04	Department	N/A
517	1551	Infinity	2024-11-05	Department	N/A
520	1517	Code Arena	2024-10-05	Department	Member
413	1423	Insight Requirement member	\N	Institute	N/A
414	1423	Infinity requirement co-cordinator	\N	Department	N/A
417	1526	Valowarz	2024-10-05	Department	Successfully co-coordinated the event, managing participants and smooth execution.
418	1526	Code-o-Fiesta	2023-11-04	Department	Contributed as a member of the media team and assisted in organizing event activities, ensuring smooth execution and proper coverage.
641	373	zenith media member	2025-08-28	Institute	N/A
642	373	NBA ppt	2025-08-20	Institute	N/A
529	1402	Flutter workshop	\N	Institute	N/A
426	1559	Documentation Head for eXpo under Technex 2k24	2024-03-05	Institute	N/A
427	1559	Team Member for ValoWarz under Infinity 2k24	2024-10-05	Department	N/A
530	1402	Hackatone idea 3	\N	National	N/A
430	1520	Coordinator	2024-09-04	Department	N/A
431	1520	Co-coordinator	2024-12-13	Institute	N/A
434	1539	N/A	\N	National	N/A
649	1370	Code-Decode	2025-08-20	Department	N/A
439	1534	valowars	2024-12-20	Department	a successful event held by us in infinity departmental event
650	1370	TSD	2025-08-11	Department	N/A
441	1553	Infinity registration core member	2024-10-02	Institute	N/A
536	982	Requirement Core team member	2024-10-02	Department	N/A
653	1330	code - decode	2025-08-18	Department	cordinator
654	1330	tsd - cp for 2nd years	2025-08-11	Department	co-cordinator
539	1537	Registration Head- Insight2k25	2025-01-23	Institute	N/A
540	1537	Registration Core member	2024-02-21	Institute	N/A
448	1408	Club Coordinator, Achievers Club, Zenith Forum	2024-01-15	Department	Mentored students preparing for GATE
449	1408	Event Coordinator, Code Arena, Infinity 2024	2024-10-05	Department	Coding event with 200+ participants
450	1408	Active Member, ACM Student Chapter, SVPCET	2024-08-20	International	Organized workshops on Power BI and C programming
542	1340	Hackathon - Technex	2025-01-11	National	N/A
543	318	magazine team head	2025-07-15	Institute	N/A
544	318	zenith outreach member	2025-08-28	Institute	N/A
457	1532	Legal Literacy	2024-12-08	National	Coordinate a webinar on Legal Literacy in collaboration with IIT Bombay's Techfest
458	1532	Choice	2024-03-30	Institute	Coordinator-Session of Drug Abuse via speech, skit ,Question and Answer
459	1532	Bidcas	2024-10-05	Department	Coordinator
466	1572	Infinity	\N	Department	Promotion Coordinator
467	1572	Zenith Forum	\N	Department	Co-Coordinator of Aster Club
468	1572	Acm student Chapter	\N	N/A	Core Team Member
471	1567	Zenith Forum	2025-08-28	Department	Vice President
472	1567	Insight Sports	2025-01-17	Institute	CE Sports Coordinator
473	1567	Infinity	2024-10-19	Department	Registration Head
559	376	INFINITY	2024-10-05	Department	N/A
560	376	TECHNEX	2025-01-20	Institute	N/A
562	426	Promotion team member	\N	Department	N/A
563	382	Infinity	2024-09-10	Department	N/A
484	1573	Campus Experia (Technical Event)	2023-02-28	Institute	N/A
485	1576	multimedia head of srujan club in gp	2023-01-13	Institute	N/A
486	1576	ER of women's wing gymkhana committee	\N	Institute	N/A
487	1576	co-cordinator of infinity as promotion head	\N	Department	N/A
489	1562	ACM Publicity head	\N	Institute	My role was to promote and conduct events
567	417	Sadc sports joint secretary	\N	Institute	N/A
568	417	Ascend club co- coordinator	\N	Department	N/A
569	417	CDC coordinator	\N	Department	N/A
496	1543	Infinity cracken coordinator	2024-09-05	Institute	N/A
576	397	Photography Day	2025-08-19	Institute	N/A
577	397	Teachers day	2025-09-11	National	N/A
502	1580	PROP & DROP	2023-01-11	Department	CO - COORDINATOR
578	397	Sponsorship head	2025-01-11	Institute	N/A
579	1522	Infinity	2024-10-05	Department	Media Head
509	1581	Skywar	2022-11-12	Institute	N/A
586	1342	ACM Web Master	2025-08-01	Department	Developed and Deployed complete website
587	1342	UBA Website coordinator	2025-03-27	Institute	Developed and Deployed complete website
588	1342	Technex -2k25 Website	2025-01-20	National	contributed as a Frontend Developer
592	1374	Technex Expo  2024	2025-01-19	National	N/A
593	440	Infinity	2024-10-05	Department	Media Team Core Member
594	440	Technex	2025-01-25	Institute	Media Core Member
596	1319	Student Council dance coordinator	2025-09-14	Institute	N/A
600	348	--	\N	State	--
601	348	--	\N	Institute	--
602	348	--	\N	International	--
637	1557	eXpo-Technex	\N	Institute	Lead team of 3 to handle marketing aspects of the event. Conducted In-House Promotions. Went to different colleges for Out-House Promotion for the event. Handles Social-Media Channels and took care of Social-Media Marketing.  Hosted 3 podcasts with special guests for the event.
638	1557	BidCas-Infinity	\N	Department	Worked with a team of 3 to conduct the event. Conducted In-House Promotions. Hosted the event for the participants
661	346	Infinity 2k25	2025-10-10	Department	Promotion team member
662	346	Idea³	2025-07-21	Institute	Promotion team member
674	1343	Vice President - Zenith Forum	2025-09-01	Department	N/A
\.


--
-- Data for Name: co_curricular_participation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.co_curricular_participation (id, student_id, name, date, level, awards) FROM stdin;
81	1325	Hackathon (engineering India)	\N	N/A	Participant certificate
82	1325	Odoo hackathon	2025-07-12	N/A	Participation certificate
83	1325	Flipkart runway	\N	N/A	Participation certificate
607	351	Insight ( Riwaz)	2025-01-22	N/A	N/A
170	649	Hackathon	\N	Department	Certificate
274	696	Hackathon	\N	Institute	Certificate
88	1372	Optimal event of AI verse 2.0	2024-10-05	Institute	3rd position in event
501	1551	hackathon	\N	Institute	N/A
90	1360	Code decode	\N	Institute	N/A
277	1380	Vision imagenet computation	2025-08-23	Department	No
278	1380	N/A	\N	Institute	N/A
94	1318	Microsoft GitTogether	2025-07-19	National	3rd
95	1318	50-hour Industrial Internet of Things	2024-01-17	State	Certificate
96	1318	IITB Techfest	2023-08-18	National	5th Position
280	1328	Skill development	2025-07-07	Department	N/A
504	1517	Summer Training Program on Generative AI and Accelerated Computing	2025-06-13	State	Certificate
505	427	Insight-Swaradhya	2024-03-06	Institute	Rank 1
103	380	Microsoft GitTogether	2025-07-19	National	1st as Challenge winner
104	380	50-hour Industrial Internet of Things (IIoT) Workshop VNIT	2024-01-17	State	Certificate
105	380	IITB Techfest Wildcard Winner	2023-08-18	National	5th Position
286	1421	Skill development program	\N	Institute	N/A
108	355	Technical Competition	2024-09-05	Department	N/A
423	1526	GATE 2025 – CSE	2025-02-01	National	Qualified with AIR 7286
296	383	UBA presentation	2025-03-20	N/A	UBA certificate of Appreciation
112	332	Bhartiya Antariksh Hackathon	2025-07-09	National	N/A
38	381	Bidcas Event	\N	Department	2nd
113	332	Envision	2025-01-20	Institute	N/A
114	332	Hackathon	2025-01-20	Institute	N/A
424	1526	NPTEL Programming in Java	2024-10-12	National	Silver + Elite Certification (Top 5% scorers, 78/100)
425	1526	Technex Expo	2024-03-05	National	Secured 4th Position
192	428	Poster making competition under world peace Day.	2023-09-21	Institute	1st rank
118	359	Vizminds (Departmental event of Data Science)	2024-10-05	Institute	First position
119	359	National Space Hackathon 2025 (Organized by IIT Delhi on Unstop)	2025-05-24	National	Participation
120	359	Bharatiya Antariksh Hackathon (Organized by ISRO)	2025-08-08	National	Participation
49	687	Handball	2025-03-24	National	--
50	687	Hackathons	2025-07-13	Department	N/A
51	687	Insight Sports	2025-01-22	Institute	1st prize
53	693	Hackathon	2025-08-23	Institute	Certificate
439	1518	Coding Bootcamp	2025-07-01	Institute	N/A
60	709	Hack with India hackathon	2024-09-11	State	Received recognition certificate from 25000 we were shortlisted in top 5000
61	709	Idea cube ideathon	2025-07-19	State	Shortlisted in top 30 out of 250 teams
62	709	No	\N	N/A	N/A
63	671	idea 3	2025-09-10	Institute	got selected among top 30 teams out of 250+ teams
64	671	abhyudaya2024	2025-09-10	Institute	no
65	671	strokes of arts	2025-09-10	Institute	yes 2nd
128	435	Codecraft Hcakathon	2025-02-10	Institute	5th
68	415	IIT Bombay Techfest Zonals	\N	National	N/A
69	415	Decode Derby (Infinity 2024)	\N	Department	1st Rank
71	1322	Hackathon	\N	N/A	N/A
467	1573	NPTEL Certification – Data Mining	2025-04-20	National	completion certificate
546	348	--	\N	Institute	--
475	1580	INFOSTAV	2022-07-21	Department	Certificate
547	348	--	\N	Institute	--
548	348	--	\N	National	--
488	1581	Cloud carnival competition	2023-10-12	Department	Certification for 2nd rank/Prize money
489	1581	Blood donation camp	2023-09-12	Institute	Certificate
216	416	Cozmo-Clench Techfest	2023-10-15	National	N/A
217	416	Coastal clash - technex	\N	National	N/A
221	432	DecentricConsensus	2025-08-08	Institute	Certificate
156	320	NPTEL - Soft skill development course	2025-03-11	National	Certificate
157	320	Uexplore event	2024-10-05	Department	Certificate, cash prize
158	320	Debate on the topic- Should AI replace human workers in repetitive jobs	2025-08-28	Institute	N/A
225	681	Hackronex	2025-07-04	National	N/A
226	681	Ideathon	2025-08-23	Institute	Runner ups
227	681	Ppt presentation on Application of mathematics	\N	Department	Winners
165	407	IDEA3 Hackathon	2025-07-19	National	4th position
166	407	Walmart Sparkathon	2025-07-28	National	N/A
167	407	Adobe Hackathon	2025-07-25	National	N/A
231	652	Model United Nations, IIIT Nagpur, 2025	2025-02-27	National	Best Orator
232	1329	Hackathon	\N	Institute	N/A
234	1352	Vision – Image Net (Image Classification Challenge)	2025-10-23	Institute	1st Prize (₹1500 + Certificate)
239	1426	SIH2024	\N	Institute	N/A
241	379	Bidcas	2024-10-05	Department	2nd prize
249	1391	Bajaj Hackathon	2025-08-20	National	N/A
252	418	SIH hackathon	\N	National	N/A
253	418	Engineer's Day India Hackathon	\N	National	N/A
255	1387	Cordinator - Decode Derby	2024-06-30	Department	N/A
268	420	Cozmo Clench	2023-10-10	National	Finalist
269	420	IIIT Robo Rumble	\N	National	2nd Rank
270	420	Robo Sumo	\N	National	3rd rank
291	1350	Model mystery	2024-09-12	Department	N/A
292	1350	Code Arena	2024-09-12	Department	N/A
382	1417	Smart India Hackathon	2024-08-31	National	Selected in top 10 teams
383	1417	Machine Learning Workshop (IIT Bombay)	2024-12-17	Institute	N/A
384	1417	ElectroRythm	2022-11-18	Department	2 Rank
493	1533	Cyber\tJob\tSimulation	2025-09-07	National	N/A
494	1533	Digital Marketing Workshop	2024-12-20	National	N/A
495	1533	GenAI\tPowered\tData\tAnalytics\tJob\tSimulation	2025-09-07	National	N/A
605	398	GEN AI HACKATHON	2025-08-25	Institute	N/A
606	398	IOT WORKSHOP	2025-09-12	Institute	N/A
514	403	Participated in Technex Hackathon	\N	Institute	N/A
515	403	Participated in TCS CodeVita	\N	International	N/A
412	1434	Japanese National Level Essay Competition by JALTAI (Junior level)	2022-12-30	National	3rd prize
413	1434	Debate Competition	2024-09-13	Department	1st Prize
414	1434	Team PPT presentation Competition	2025-05-17	Institute	1st Prize
426	1431	mart India Hackathon	2024-08-31	National	Selected in top 10 teams
427	1431	Paper Publication	2025-08-20	National	Certificate of Publication
428	1431	Chase the web	2022-11-18	Institute	1st Rank
433	1559	ICPC	2024-11-16	International	N/A
434	1559	SIH 2025	2024-12-11	National	N/A
623	338	Technex (Envision)	2025-01-20	Institute	Came under top 14
624	1383	Project competition	2024-04-03	National	2nd position, 7000/- as prize money
625	1370	Venture Vista.AI	2023-11-04	Institute	N/A
626	1370	Giga Gen	2023-11-04	Institute	N/A
448	1408	IDEA³ Conclave 2.0	2025-07-19	National	2nd Runner Up with cash prize 10000/-
449	1408	Smart India hackathon Expo SVPCET 2024	2024-10-19	Institute	2nd Runner Up with cash prize 12000/-
450	1408	Cloud Carnival Infinity 2023	2023-04-11	Department	1st Winner with cash peize of 1200/-
540	1374	Technex Expo 2023	2023-03-05	National	Runner up
627	1370	Code Arena	2024-10-05	Institute	Runner-up
455	1572	Expo	\N	Institute	4th position
456	1572	Expo 2.0	2025-01-20	Institute	1st position
542	1319	Hackathon	2024-09-23	Institute	Participation
630	1330	code area infinity event	2024-10-05	Institute	1st runner up
631	1330	techron wars online competion	2024-06-05	Institute	10 th rank
644	339	Hackathon	2025-08-23	Institute	N/A
645	339	Gen Ai	2025-08-25	Institute	N/A
646	339	Hackathon	2025-01-20	Institute	N/A
657	346	HTML CSS JavaScript course	2024-12-20	Institute	8,10,8.5
658	346	Sb Jain college hackathon	2025-02-22	State	Top 10
659	346	Kad college hackathon	2025-02-28	State	Top 30
297	383	BITS Goa Quark	2025-02-07	National	Trophy,cash prize and certificate
298	383	IIT BOMBAY TECFEST	2024-12-17	N/A	Certificate of Appreciation
391	1410	Smart India Hackathon-2024	2024-08-31	National	0
392	1410	AI,ML Workshop - IIT Bombay,	2024-12-19	Institute	0
393	1410	Devfest - Google developer groups	2023-12-30	National	0
302	1349	Engineering India Hackathon	2024-09-29	National	Participation Certificate
303	1349	Smart India Hackathon	2024-10-19	Institute	N/A
304	1349	Tulsiram Gaikwad Hackathon	\N	Institute	N/A
600	1557	GateWalk-Technex 2023	\N	Institute	2nd rank
510	1546	ted tech competition	2025-04-24	Institute	Most Inspiring Speaker
511	1546	Kratusprah Student Parliament	2024-03-23	State	Finalist
415	1393	Smart India Hackathon	2024-08-31	National	Selected in top 10 teams.
416	1393	Smart India Hackathon	2024-10-18	Institute	N/A
417	1393	ML Workshop	2024-12-17	Institute	N/A
418	1568	Technex	2023-10-18	Institute	N/A
419	1568	Infinity	2024-09-17	Department	N/A
601	1557	Internal SIH Hackathon	\N	Institute	18th Rank
602	1557	Inter-Department Presentation Competition 2025	\N	Institute	Most Eloquent Speaker
316	341	Departmental Events	2025-09-12	Department	N/A
518	1340	Cybershark(blockcoding)	2024-09-13	Department	Runner-up with a reward of  rs. 400 + certificate
519	1340	Vision-ImageNet (Image classification challenge)	2025-08-23	Institute	N/A
320	333	Enhancing Soft Skills and Personality	2025-04-03	National	Certificate of Passing
525	426	Sports basketball team	\N	Institute	N/A
322	1548	Finalist – Bharatiya Antariksh Hackathon 2025 (NRSC–ISRO)	2025-08-07	National	Final Participation Certificate
323	1407	Adobe Indian Hackthon	2025-06-19	International	no
526	426	Sports athletic team	\N	Institute	N/A
444	691	hackathon	2025-08-23	Institute	certificate
527	426	Sports athletics	\N	Department	N/A
327	670	Surgsargam	2025-01-23	Institute	1st
328	1386	Smart India Hackathon	2024-08-31	National	Selected in top 30 teams
329	1386	Paper Publication	2025-08-20	National	Certificate of Publication
330	1386	Chase the web	2024-11-19	Institute	1st Rank
331	330	Hackathon at YCCE (IT Dept.)	\N	State	Participation Certificate
534	1342	Fastest Frontend First - YCCE	2025-08-22	National	2nd rank + cash prize
459	1567	IEEE organised National level project compitition	2025-05-03	National	Finalist
535	1342	verses coding - ycce	2025-08-23	National	2nd rank + cash prize
536	1342	hackathon - SVPCET, Technex	2025-01-21	National	3rd rank + cash prize
468	1576	Kho-Kho	2019-08-01	State	N/A
469	1576	kho-kho coach	2022-11-14	Institute	N/A
342	1561	NSS member	\N	National	N/A
343	1561	UBA member	\N	National	N/A
614	1369	GDG DevFest - Developers Conference	2024-12-21	National	N/A
615	1369	SIT ACM Codesprint - Competitive Programming Competetion	2025-02-20	Institute	Rank 3
616	1369	YCCE Codeversus - Competitive Programming Competition	2025-08-23	Institute	Rank 3
618	316	J	\N	N/A	N/A
619	1583	.	2025-09-12	N/A	.
620	1583	.	2025-09-12	N/A	.
621	1583	.	\N	N/A	.
352	1560	Model United Nations	2025-01-12	Institute	Honorable Mention
353	1560	Expo	2025-02-18	Institute	First
647	402	Yoga Exam	2023-11-25	State	N/A
362	1535	Review Paper	\N	Institute	N/A
363	1535	C programming Workshop	\N	Institute	N/A
364	1556	C# Object- Oriented Programming for Beginners in C# and .Net	2025-07-14	National	Certificate
365	1556	Security Operations Center (SOC)	2025-05-28	National	Certificate
366	1556	INDUSTRIAL INTRUSION CTF CHALLENGE	2025-06-30	International	Certificate
378	1555	SIH	2024-10-19	Institute	In top 30
670	414	Code Arena	2024-10-04	Department	1st
671	414	BidCas	2024-10-04	Department	N/A
675	1052	Central Indea Hackathon	2023-12-12	National	Runner Up
701	342	VORTEX	2026-07-02	Institute	nothing
702	342	\N	\N	\N	\N
703	342	\N	\N	\N	\N
\.


--
-- Data for Name: faculty; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.faculty (id, email, first_name, last_name, contact_number, user_id) FROM stdin;
3	rroychaudhary@stvincentngp.edu.in	Reema	Roychaudhary	9822378044	1601
5	pritibhagat@stvincentngp.edu.in	Priti V.	Bhagat	9579927659	1603
6	rkotkondawar@stvincentngp.edu.in	Roshan Rajesh	Kotkondawar	7709171620	1604
7	ynikhare@stvincentngp.edu.in	Yogita	Nikhare	7447444320	1605
8	asheikh@stvincentngp.edu.in	Ansar	Sheikh	9579414358	1606
9	kgupta@stvincentngp.edu.in	Kapil	Gupta	9766773099	1607
10	nkorde@stvincentngp.edu.in	Nilesh Sadashiv	Korde	8087344469	1608
11	pwankhede@stvincentngp.edu.in	Pallavi	Wankhede	9970425086	1609
12	kmeshram@stvincentngp.edu.in	Kavita	Meshram	9834635859	1610
13	owadhwani@stvincentngp.edu.in	Omesh	Wadhwani	7821926689	1611
14	kjaisinghani@stvincentngp.edu.in	Komal	Gehani	9970419898	1612
15	ygolhar@stvincentngp.edu.in	Yogesh	Golhar	9145849475	1613
16	swanjari@stvincentngp.edu.in	Sunil M.	Wanjari	7447439131	1614
17	ayazkhan@stvincentngp.edu.in	Ayaz Ahmed	Khan	7020667537	1615
18	dgupta@stvincentngp.edu.in	Dhiraj Kumar	Gupta	8087219909	1623
19	mchole@stvincentngp.edu.in	Minal	Chole	9172347877	1624
20	vdeshpande@stvincentngp.edu.in	Vaibhav	Deshpande	9890977613	1625
21	sdhage@stvincentngp.edu.in	Sandhya	Dhage	7972117050	1626
22	kgawande@stvincentngp.edu.in	Kavita	Gawande	7709843007	1627
23	mbramhe@stvincentngp.edu.in	Manoj	Bramhe	93249 76322‬	1629
24	dwajgi@stvincentngp.edu.in	Dipak	Wajgi	‪70306 00096‬	1630
25	apathak@stvincentngp.edu.in	Abhishek	Pathak	8668870084	1632
26	mgudadhe@stvincentngp.edu.in	Manish	Gudadhe	7722046601	1633
\.


--
-- Data for Name: internship; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.internship (id, student_id, company_name, domain, internship_type, paid_unpaid, start_date, end_date, designation, description) FROM stdin;
347	1572	Oasis Infobyte	Web devlopment and designing	Online	Unpaid	2025-05-05	2025-06-15	\N	\N
246	1389	MRSAC	Remote Sensing, GIS, and Deep Learning for intelligent land management and encroachment detection	Physical	Unpaid	\N	\N	\N	\N
154	1406	Protuner technologies, Nagpur	Web development	Online	Unpaid	2024-03-01	2024-04-01	\N	\N
79	1429	Eduskills Foundation	AI-ML Virtual Internship	Online	Unpaid	2025-01-01	2025-03-01	\N	\N
155	1406	Codealpha , lucknow	Blockchain devlopment	Online	Unpaid	2025-06-01	2025-07-01	\N	\N
251	1560	Data Science Academia	MACHINE LEARNING	Online	Unpaid	2023-09-15	2023-11-15	\N	\N
82	428	Web development in python	Web development	Online	Unpaid	2025-08-06	2025-09-15	\N	\N
252	1560	Oasis Infotybe	DATA SCIENCE	Online	Unpaid	2025-05-01	2025-06-15	\N	\N
158	1444	SohamGlobals	Java Full Stack Development	Online	Unpaid	2025-02-18	2025-08-30	\N	\N
159	1444	Congnifyz Technologies	Java Development	Online	Unpaid	2024-04-04	2024-05-04	\N	\N
162	1390	Edunet Foundation	Data Analyst	Online	Unpaid	2025-07-18	2025-08-31	\N	\N
255	1535	Northern lights analytics, Nagpur	AI-ML	Physical	Unpaid	2025-04-20	2025-07-31	\N	\N
164	418	Wayspire Virtual intership	Python Database management	Online	Unpaid	\N	\N	\N	\N
165	1317	Next24tech	IT	Online	Unpaid	2024-01-20	2024-02-20	\N	\N
256	1535	CAIR,DRDO	AI-ML	Physical	Paid	2025-08-01	2026-01-31	\N	\N
168	1380	Python - django developer	Python	Physical	Unpaid	2024-01-01	2024-04-30	\N	\N
258	1566	Codesoft	N/A	Online	Unpaid	2025-06-01	2025-06-30	\N	\N
170	1328	Deloitte	Data analytics	Online	Unpaid	\N	\N	\N	\N
259	1399	Gennxt co.	Full Stack	Physical	Unpaid	2023-08-01	2025-09-13	\N	\N
28	343	Umam (Unified Mentor)	Data Analyst	Online	Unpaid	2025-08-05	2025-09-20	\N	\N
262	1540	CAIR DRDO - Government / PSU / Defence	AI/ML	Physical	Paid	2025-08-01	2026-01-31	\N	\N
263	1540	Zidio Development	Web Development	Online	Unpaid	2025-06-15	2025-07-15	\N	\N
264	1527	Zeza Technologies	UI/UX and Power BI Developer	Online	Paid	2025-06-02	2025-09-02	\N	\N
265	1527	N/A	N/A	N/A	Unpaid	\N	\N	\N	\N
176	1432	Tata Technologies Pvt. Limited	IT- Php development	Physical	Unpaid	2025-06-01	2025-07-03	\N	\N
177	1432	Hitachi India Pvt. Limited	Angular Development	Physical	Paid	2025-08-01	2026-08-01	\N	\N
36	436	Internpe	Web development	Online	Paid	2025-06-02	2025-06-29	\N	\N
178	1421	united protocol	AI/ml	Physical	Paid	2024-09-20	2025-04-01	\N	\N
38	381	Null Class	Data Analyst	Online	Paid	2025-05-21	2025-06-21	\N	\N
180	383	RCOEM - TATA- CIIIT , NAGPUR	Ml	Physical	Paid	\N	\N	\N	\N
41	698	-	N/A	N/A	Unpaid	\N	\N	\N	\N
181	1413	Elsystem	Data Science	Online	Unpaid	2022-06-22	2024-09-01	\N	\N
50	687	No	--	Online	Unpaid	2025-06-01	2025-06-02	\N	\N
51	687	No	--	Online	Unpaid	2025-06-01	2025-06-02	\N	\N
58	709	DESCAM	Web development, AI ML development	Online	Paid	2025-06-09	2025-09-09	\N	\N
59	709	No	No	N/A	Unpaid	\N	\N	\N	\N
60	671	-	-	N/A	Unpaid	\N	\N	\N	\N
62	1318	IIITH LTRC Lab	Speech Analytics AI & ML	Physical	Unpaid	2025-05-30	2025-08-15	\N	\N
64	405	Progress with ai	Web Development	Online	Unpaid	2025-05-12	2025-07-12	\N	\N
278	1542	Learnwik Solution Pvt Ltd	Computer	Online	Unpaid	2023-04-06	2023-06-06	\N	\N
279	1417	CAIR, DRDO (Defence Research and Development Organisation)	AIML & Robotics	Physical	Paid	2025-08-01	2026-01-31	\N	\N
67	380	IIIT Hyderabad, LTRC Lab	Speech Processing	Physical	Unpaid	2025-05-30	2025-08-15	\N	\N
280	1417	Zidio	Frontend Web Development	Online	Unpaid	2025-06-15	2025-07-15	\N	\N
71	355	SkillUp	Web development	Online	Unpaid	2025-07-15	2025-08-15	\N	\N
127	1371	IIIT, HYDERABAD	Iot and software integration	Physical	Unpaid	2025-06-01	2025-06-30	\N	\N
131	421	Raise Digital	Web Development (Front-End)	Online	Unpaid	2025-03-01	2025-04-30	\N	\N
133	1355	Edunet	web development	Online	Unpaid	2024-12-09	2025-01-20	\N	\N
198	333	Shri Interworks	Web Development	Online	Unpaid	2025-06-07	2025-07-19	\N	\N
136	375	Eduskills - Python Full Stack Developer	Web Development	Online	Unpaid	2025-08-15	2025-09-15	\N	\N
137	1422	Codec Tecnology	Artificial Intelligence	Online	Unpaid	2025-06-01	2025-06-30	\N	\N
199	1554	Zidio Development Ltd	Data Analysis	Online	Unpaid	2025-05-16	2025-06-16	\N	\N
285	1410	CAIR ,DRDO	N/A	Physical	Paid	2025-08-01	2026-01-31	\N	\N
286	1410	VNIT, Academics / Research	N/A	Physical	Unpaid	2025-06-01	2025-07-16	\N	\N
201	1548	Bartr	FULL STACK WEB DEVELOPEMENT	Physical	Paid	2025-01-20	2025-03-20	\N	\N
294	1565	Ingenious Geo Technologies, Business Development & Technical Support Intern	Marketing and Technical	Physical	Paid	2025-06-02	2025-06-30	\N	\N
207	1545	Zidio development	Data science and analytics	Online	Paid	2025-05-16	2025-06-16	\N	\N
210	1407	Livetechskills	Data Science	Physical	Unpaid	2025-05-28	2025-06-28	\N	\N
211	1407	DRDO-CAIR	Cyber Security, Machine Learning, Neo4j	Physical	Paid	2025-08-18	2026-01-31	\N	\N
212	442	ApexPlanet Software Pvt Ltd	Android App Developer	Online	Unpaid	2025-04-11	2025-05-26	\N	\N
213	442	Edunet Foundation	Cloud AI	Online	Unpaid	2025-05-13	2025-06-13	\N	\N
297	1541	Regional meteorological centre, under IMD, Airport, Nagpur	Full stack web development	Physical	Unpaid	2025-06-11	2025-07-11	\N	\N
215	1424	Edunet	AIML	Online	Unpaid	2025-06-06	2025-07-06	\N	\N
217	1558	India Meteorological Department	Machine Learning, Live Prediction	Physical	Unpaid	\N	\N	\N	\N
220	1547	Zidio	Web Devlopment	Online	Unpaid	2025-05-01	2025-07-01	\N	\N
221	1547	DRDO	AI and ML	Physical	Paid	2025-08-13	2026-01-31	\N	\N
301	1434	Maharashtra Remote Sensing Application Centre	Software Development	Physical	Unpaid	2025-04-07	2025-11-07	\N	\N
302	1393	CAIR, DRDO — Government / PSU / Defence	AI/ML	Physical	Paid	2025-08-01	2026-01-31	\N	\N
224	1440	VNIT	Smart manufacturing	Physical	Unpaid	2023-06-15	2023-07-15	\N	\N
303	1393	Zidio	Frontend Web Developer Intern	Online	Unpaid	2025-06-15	2025-07-15	\N	\N
226	1582	CodSoft	Python Programming	Online	Unpaid	2024-03-15	2024-04-15	\N	\N
304	1568	Zidio Development	Web development	Online	Unpaid	2025-07-30	\N	\N	\N
228	443	Growsoft technology	Web	Physical	Unpaid	2023-06-15	2025-08-31	\N	\N
229	1386	MRSAC(Maharashtra Remote Sensing and Application Center)	AI-ML	Physical	Unpaid	2025-04-07	2025-07-31	\N	\N
230	1386	DRDO(Defence research and Development Organization)	AI-ML	Physical	Paid	2025-08-01	\N	\N	\N
309	1431	Maharashtra Remote Sensing Application Centre (MRSAC)	AI-ML	Physical	Unpaid	2025-04-07	2025-11-07	\N	\N
323	1518	Excel analytics platform	web development	Online	Unpaid	2025-06-16	2025-07-16	\N	\N
241	1561	CodSoft pvt.ltd	UI/UX Designer	Online	Unpaid	2024-04-01	2024-05-01	\N	\N
242	1561	Centre for Artificial Intelligence and Robotics, DRDO	Security (MFA)	Physical	Paid	2025-08-01	2026-01-31	\N	\N
306	1423	SOFTSENSE TECHNOSERVE (I) PVT LTD	Penetration Testing & Ethical Hacking	Physical	Unpaid	2025-05-28	2025-06-28	\N	\N
308	1526	Aarti Multi Services Pvt. Ltd.	Full Stack Web Developer	Physical	Paid	2025-06-09	2025-10-09	\N	\N
348	1572	Cognifyz Technologies	web devlopment	Online	Unpaid	2025-06-01	2025-07-01	\N	\N
315	1520	Vaultofcode	Java	Online	Unpaid	2025-06-01	2025-07-01	\N	\N
316	1520	AICTE	AI Intern	Online	Unpaid	2025-07-01	2025-08-01	\N	\N
351	1567	Zidio Development	Data science	Online	Unpaid	2025-08-20	2025-09-20	\N	\N
456	981	Fast tech software services	Web development	Physical	Unpaid	2023-06-17	2023-08-31	\N	\N
322	1521	Zidio Development	Web Development Intern	Online	Unpaid	2025-06-16	2025-07-16	\N	\N
460	346	Fixverse India Pvt. Ltd.	Website development and management	Physical	Unpaid	2025-09-24	2026-03-24	\N	\N
360	1576	glogic	Frontend devloper	Online	Unpaid	2022-07-01	2022-12-31	\N	\N
361	1576	AppXBuild	web devloper	Online	Unpaid	2024-05-01	2024-06-01	\N	\N
363	1562	Zudio	Data science	Online	Unpaid	2025-05-01	2025-06-01	\N	\N
390	1551	AD  Info Systems	Data Science	Online	Unpaid	2025-06-06	2025-07-06	\N	\N
393	1517	Edunet Foundation	AI	Online	Unpaid	2025-05-13	2025-06-13	\N	\N
419	1522	Edunet Foundation x Microsoft	AI	Online	Unpaid	2025-06-10	2025-07-10	\N	\N
422	1342	Vector Labs Pvt. Ltd.	Website and Software development	Online	Unpaid	2025-03-01	\N	\N	\N
427	440	Technogreeks	Python	Physical	Unpaid	2022-01-01	2022-03-01	\N	\N
428	440	Internpe	Web Development	Online	Unpaid	2025-06-01	2025-07-01	\N	\N
450	1557	India Meteorological Department	Machine Learning	Physical	Unpaid	2025-06-03	2025-07-03	\N	\N
312	1559	India Meteorological Department	ML Intern	Physical	Unpaid	2025-06-03	2025-07-03	\N	\N
359	1573	Code Core Global	Python Web-Developer	Online	Unpaid	2025-06-05	2025-07-05	\N	\N
324	1538	kshitij Foundation	Full-stack development	Online	Unpaid	2024-10-13	2025-03-01	\N	\N
325	1538	Aarti Multi Services Pvt.Ltd	Full-stack development	Physical	Paid	2025-06-01	2025-10-01	\N	\N
328	1534	Unified Mentor	fullstack development	Online	Unpaid	2025-07-01	2025-09-01	\N	\N
374	1516	Zidio	Data science	Online	Unpaid	2025-06-15	2025-07-15	\N	\N
388	1577	VNIT	IIOT - Industry 2.0	Physical	Unpaid	2025-06-03	2025-07-03	\N	\N
389	1577	Unified Mentor	Machine Learning	Online	Unpaid	2025-06-10	2025-12-10	\N	\N
400	1552	YBI Foundation	Artificial intelligence and Data science	Online	Unpaid	\N	\N	\N	\N
402	1433	EduNet	Data Science	Online	Unpaid	2025-06-04	2025-07-10	\N	\N
405	1546	Aarti Multi Services	Full Stack	Physical	Paid	2025-07-20	2025-08-30	\N	\N
418	1530	Feynn Lab services	Machine learning intern	Online	Unpaid	2025-06-02	2025-08-02	\N	\N
426	1374	IIIT-H Research Internship	Speech Analytics	Physical	Unpaid	2025-05-15	2025-08-15	\N	\N
431	348	--	--	Online	Unpaid	\N	\N	\N	\N
432	348	--	--	Online	Unpaid	\N	\N	\N	\N
369	1580	INTERNPE	WEB DEVLOPMENT	Online	Unpaid	2024-04-29	2024-05-26	\N	\N
333	1523	Cybersecurity Using IAM.	Cybersecurity	Online	Unpaid	2025-05-09	2025-05-20	\N	\N
334	1550	Excel analytics platform	N/A	Online	Unpaid	2025-06-15	2025-07-15	\N	\N
371	1515	Codec Technologies Pvt. Ltd	Java Developer Intern	Online	Unpaid	2025-06-11	2025-09-11	\N	\N
336	1408	TS Switch E-Ride Private Limited, Nagpur	Web Development	Physical	Paid	2025-06-01	2025-06-30	\N	\N
376	1533	Zidio Developmet  | IT / Computers - Software  Software Engineer Intern	N/A	Online	Unpaid	2025-05-15	2025-06-15	\N	\N
341	1532	Muktangan Foundation	Full Stack	Online	Paid	2025-07-21	2026-12-31	\N	\N
342	1532	Accrevent Pvt Ltd	Machine Learning	Physical	Unpaid	2025-06-02	2025-07-14	\N	\N
406	424	IEEE summer internship, iit kharagpur	BCI	Online	Unpaid	2025-08-01	\N	\N	\N
409	1537	InternPe	Web development	Online	Unpaid	2024-10-16	2024-11-16	\N	\N
410	1537	Zidio development	Data analysis and data science	Online	Paid	2025-05-16	2025-07-16	\N	\N
413	1404	AICTE Eduskills	AI-ML	Online	Unpaid	2024-07-01	2024-09-01	\N	\N
414	1404	Deloitte	Data Analysis Intern	Online	Unpaid	\N	\N	\N	\N
416	1340	Google	AI ML	Online	Unpaid	2025-04-01	2025-06-01	\N	\N
452	398	SMART MANUFACTURING	MANUFACTURING	Physical	Unpaid	2025-06-10	2025-07-10	\N	\N
454	1383	Manas agro industries, nagpur	Web and app development	Physical	Unpaid	2023-06-07	2023-07-22	\N	\N
471	1343	SkillCraft	Machine learning	Online	Unpaid	2025-08-01	2025-08-31	\N	\N
475	1052	Web development Frontend	Web Development	Online	Unpaid	2005-03-12	2025-09-12	\N	\N
496	342	web dev frontend\n[[KYS_META]]{"designation":"database architect"}	web development\n[[KYS_META]]{"description":"nothing"}	Online	Paid	2026-01-13	2026-06-15	\N	\N
\.


--
-- Data for Name: mentoring_minute; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mentoring_minute (id, student_id, faculty_id, semester, date, remarks, suggestion, action, faculty_name_snapshot, faculty_email_snapshot) FROM stdin;
117	342	12	5	2026-07-26	Yash, your strong CGPA of 9.16 is notable, so focus on highlighting it in your resume.\nYour projects, such as "solar system" and "disco system", demonstrate your skills, so prepare to discuss them in interviews.\nYour internship experience in web development is valuable, so be ready to talk about your accomplishments.\nYou have a clear career objective in web development, so tailor your job search to target companies in this field.\nYour additional technical skills, such as probability and statistics, are an asset, so be prepared to discuss their applications.	take some online courses.	Build discipline and focus on other aspects also like communication and management	Kavita Meshram	kmeshram@stvincentngp.edu.in
19	321	16	3	2025-09-16	Need to work on stage daring	Must practice english language	During the next meeting must show improvement.	Sunil M. Wanjari	swanjari@stvincentngp.edu.in
76	689	3	3	2025-10-04	- shy \n-  need to open up in discussion.\n- need to develop overall personality and communication.	- need to self learn technical courses\n- need to read newspaper to improve communication.\n- need support for internship & project.	- Enroll in reputed online platforms (NPTEL, Coursera, edX, Udemy).\n- Read one English newspaper daily, Participate in group discussions or mock presentations to apply learning.\n- Connect with faculty mentors and placement/internship cells for guidance, Explore online internship platforms (Internshala, LinkedIn, TCS iON).\n- Adjust goals if targets are not met, and seek mentor/peer feedback regularly.	Reema Roychaudhary	rroychaudhary@stvincentngp.edu.in
42	343	3	3	2025-09-16	Shows strong practical learning ability.\nPossesses good speaking and presentation skills.\nDemonstrates effective team management and event management capabilities.\nTends to be over talkative at times.\nTakes more time to grasp theoretical concepts compared to practical ones.\nHighly enthusiastic and eager to participate in multiple activities.\nVery socially active and well-engaged with peers.\nFaces difficulty in balancing studies with social activities.\nRequires parental permission, which sometimes limits participation.	Focus on practical projects and presentations.\nTake leadership in team and event tasks.\nImprove theory learning and communication.\nBalance academics with social activities.\nKeep parents updated for support.	Enhance skills through projects, seminars, and leadership roles.\nImprove theory learning and communication with focused practice.\nBalance academics and social activities through time management.\nKeep parents informed to ensure continued support	Reema Roychaudhary	rroychaudhary@stvincentngp.edu.in
37	325	3	3	2025-09-16	1st semester SGPA= 8\n2nd Semester SGPA = 8.82\nhaving knowledge in : AI, Cyber and Data Science\nstrong point: coding with C/ Python\ndeveloped website as a part of 1st yr mini project\nhaving knowledge in : HTML,,CSS, JAVA script	improve communication.\nimprove public speaking \nLearn emerging technical courses such as Deep Learning (DL) and related advanced domains.	Conduct communication skill workshops and practice sessions.\nEncourage participation in debates, presentations, and group discussions to improve public speaking.\nMotivate students to learn emerging technical courses such as Deep Learning (DL) and other advanced domains through online platforms, workshops, and certification programs.	Reema Roychaudhary	rroychaudhary@stvincentngp.edu.in
40	688	3	3	2025-09-16	SGPA : 1st semester- 8.4, 2nd semester: 8.71\ninterested for application development and software development related projects.\nself learnt : Android Studio, Flutter, and Java script. (quick learner)\nstrength: coding\nweakness: communication , management	Communication, presentation, lack of leadership quality.\nneed to work in team.\nContinue exploring coding-focused projects in application and software development to build a strong portfolio.\nTake part in small team projects or hackathons to practice time management, task delegation, and leadership.	Take up application and software development projects to strengthen practical exposure.\nEnhance coding expertise in Android Studio, Flutter, and JavaScript by building real-time applications and contributing to open-source.\nImprove communication skills through participation in seminars, group discussions, and technical presentations.\nDevelop management skills by handling team-based mini-projects, hackathons, and collaborative tasks.\nLearn advanced technologies such as React Native, Node.js, and AI/ML integration to align with industry trends.	Reema Roychaudhary	rroychaudhary@stvincentngp.edu.in
33	709	3	3	2025-09-16	-1st Semester SGPA- 7.9, 2nd Sem SGPA= 9.6\n- done internship for 3 months in cyber security startup initiated by CSE(CS) dept.\n- created the frontend of website\n-done project of detecting image whether it is AI generated or real image. \n-preferable work of domain: website development, AI, ML, cyber security\n- received award as " star performer of the month" \nhobbies: dancing, lipan art\n- representing CDC coordinator of 3rd semester.	-Need to work on overall personality development.\n-Overcome stage fear and build self-confidence.\n-Improve communication skills for effective interaction.\n-need to learn emerging trend related technical courses	-Organize personality development and soft skills training sessions.\n-Conduct regular presentations, seminars, and group discussions to overcome stage fear and build self-confidence.\n-Arrange communication skills workshops and role-play activities for effective interaction.\n-Motivate students to enroll in online certification programs and workshops on emerging trend-related technical courses.	Reema Roychaudhary	rroychaudhary@stvincentngp.edu.in
14	1326	5	5	2025-09-16	1. Academic performance is constant for all the previous semester.\n2. Short term Goal- placement\n3. Long Term Goal - Trader	1. participate in various co-curricular activities to build confidence level.	1. clearing backlog subject from 3rd as well as 4th sem.\n2. To identify winter / summer training programs	Priti V. Bhagat	pritibhagat@stvincentngp.edu.in
12	313	5	3	2025-09-16	1. Need to focus on improving the SGPA. it constant for both the previous semester.	1. To get involved in various co-curricular activities	1. Identify the winter/ summer training programs to catch up with latest trends.	Priti V. Bhagat	pritibhagat@stvincentngp.edu.in
57	351	6	3	2025-09-17	A dedicated, quick learner student.	Need to enhance technical skills.		Roshan Rajesh Kotkondawar	rkotkondawar@stvincentngp.edu.in
56	375	6	5	2025-09-17	A scholar and intelligent student with leadership skills.	Going well. Keep enhancing skill sets.		Roshan Rajesh Kotkondawar	rkotkondawar@stvincentngp.edu.in
55	428	6	5	2025-09-17	A sincere and hardworking student.	Need to set a goal and priority for the future and career opportunities.		Roshan Rajesh Kotkondawar	rkotkondawar@stvincentngp.edu.in
72	683	7	3	2025-09-18	Should improve in academics and attend the classes regularly	More focus on Programming	Practice programming on daily basis	Yogita Nikhare	ynikhare@stvincentngp.edu.in
74	323	8	3	2025-09-18	Her mother doing private job for survival. She need to grab job immediately after the graduation.	Learn Java, DBMS and Data Structure.	Start learning Java first and then data structure.	Ansar Sheikh	asheikh@stvincentngp.edu.in
75	416	8	5	2025-09-20	She is no clear about her goal right now. She wanted to do internship. but she will decide path after after the graduation.	I suggested her to  complete any programming language like C,C++ and java. Then choose your domain.	You will learn any of mentioned programming language first.	Ansar Sheikh	asheikh@stvincentngp.edu.in
73	1374	8	5	2025-09-18	Ananya is interest in Machine Learning, Deep Learning and Natural language program.	She need to learn all library like Pandas, Numpy, sklearn and others.	First learn python in defth	Ansar Sheikh	asheikh@stvincentngp.edu.in
70	670	8	3	2025-09-18	He is preparing for Data SCience. Now he is preparing R-Language.	I have done my Data Science. I will guide him to reach on top most.	First complete R-Language then move on ML.	Ansar Sheikh	asheikh@stvincentngp.edu.in
69	672	8	3	2025-09-18	He is preparing cloud based technology. He wanted to become cloud engineer or administrator.	I have suggested the name of my friend who is working in Wipro an cloud aministrator.		Ansar Sheikh	asheikh@stvincentngp.edu.in
62	1378	8	5	2025-09-18	His father is businessman. He wanted to continue his business. He has shuttering shop and sells college and school related items.			Ansar Sheikh	asheikh@stvincentngp.edu.in
61	1317	8	5	2025-09-18	His entire family is in Civil Sevice. He is most disciplined toward civil sevice. Preparing UPSC and MPSC. He wanted to become IPS.			Ansar Sheikh	asheikh@stvincentngp.edu.in
21	413	8	5	2025-09-16	He wanted to go in software industry.\nHe is preparing Java advance with data structure.\nHis CGPA is approx 7.5	Need to focus on core concept	Prepare and apply for multiple test or MCQ	Ansar Sheikh	asheikh@stvincentngp.edu.in
53	650	9	3	2025-09-17	Her priority is for defence. Interested in GATE a exam and wants to go for higher study abroad.	Focus should be on core courses for GATE, Physical fitness for defence.	Need to work on fundamentals of core core courses. Also suggested to focus on Aptitude/Reasoning for defence entrance.	Kapil Gupta	kgupta@stvincentngp.edu.in
51	671	9	3	2025-09-17	She wants to go for Higher Study. Preparing for GATE exam. Interested in research.	Focus on core courses.	Prepare core courses for GATE exam.	Kapil Gupta	kgupta@stvincentngp.edu.in
48	981	10	5	2025-09-16	She Average in Academics, she interested in the MPSC, UPSC exam, and wants to pursue higher education.	1. Increase the SGPA above 8.00 to 8.50.\n2. Focus on studies 2 hrs. Regularly   on UPSC and college.\n3. Increase consistency \n4. Keep Backup plan.	1. Meditation at morning and at evening.\n2. Avoid unwanted YouTube and mobile phone access.\n3. Take baby steps and calculated risk.	Nilesh Sadashiv Korde	nkorde@stvincentngp.edu.in
46	647	10	3	2025-09-16	He good in Academics, is interested in the GATE Exam, and wants to pursue higher education.	1. Increase the SGPA above 9.00 to 9.25 \n2. Focus on Core subjects.\n3. Clear concepts	1. Refer to the GATE question papers at GEEKSFORGEEKS.\n2. Start observing and solving the GATE Questions topic-wise.\n3. Practice English language by using AI bots and Editorials	Nilesh Sadashiv Korde	nkorde@stvincentngp.edu.in
45	357	10	3	2025-09-16	She excels in Academics, is interested in the GATE Exam, and wants to pursue higher education.	1. Increase the SGPA above 8.25 to 8.50 \n2. Focus on Core subjects.\n3. Clear concepts	1. Refer to the GATE question papers at GEEKSFORGEEKS.\n2. Start observing and solving the GATE Questions topic-wise.	Nilesh Sadashiv Korde	nkorde@stvincentngp.edu.in
18	1322	11	5	2025-09-16	Jueli is  sincere	public speaking need to improve .		Pallavi Wankhede	pwankhede@stvincentngp.edu.in
68	371	12	3	2025-09-18	Sincere and hardworking, active participation in events	need to improve academic performance	participation in competitive coding platform	Kavita Meshram	kmeshram@stvincentngp.edu.in
66	660	13	3	2025-09-18	1.\tHe is an active learner \n2.\tHe is more focused about placements	I suggest to prepare for groups discussion and technical interviews	Join Offline technical course related to computer science domain	Omesh Wadhwani	owadhwani@stvincentngp.edu.in
65	337	13	3	2025-09-18	1.\tHe is not able to study in hostel.\n2.\tHe is also confused to select domain between AI/ML and cyber security.	I suggest him to go for group study	Join offline cyber security courses	Omesh Wadhwani	owadhwani@stvincentngp.edu.in
64	324	13	3	2025-09-18	1.\tShe is good in Math and DCFM subject.\n2.\tShe knows the logic of Data structure but facing difficulty in writing code.	Some activity should be conducted on Saturday	You must practice on data structure programs like stack, queues	Omesh Wadhwani	owadhwani@stvincentngp.edu.in
63	654	13	3	2025-09-18	1.\tFacing problem in Data structure coding (algorithms)\n2.\tWriting problem. (know the concept but not able to express fully)	To practice more on writing and reading	Reading more books on data structure which are available in library.	Omesh Wadhwani	owadhwani@stvincentngp.edu.in
17	367	13	3	2025-09-16	Your assignments are always well-organized and submitted on time.\nRishita is confused in between Data science and AI domain.	I recommend her to go for data science offline course.		Omesh Wadhwani	owadhwani@stvincentngp.edu.in
15	404	13	5	2025-09-16	Vansh is good student. TOC and OS favorite subjects.	Practical of Web development must be included in syllabus		Omesh Wadhwani	owadhwani@stvincentngp.edu.in
24	1361	14	5	2025-09-16	A sincere and hardworking student with strong technical skills in Python, actively involved in projects that enhance practical learning. He want to go for Placements	o enhance problem-solving and analytical skills by practicing competitive programming and participating in coding contests.	Participate in coding platforms like LeetCode, Codeforces, or HackerRank to strengthen problem-solving.\nRevise core Computer Science fundamentals\nEngage in group discussions and presentations to boost confidence.	Komal Gehani	kjaisinghani@stvincentngp.edu.in
11	651	15	3	2025-09-16	Placement		Placement	Yogesh Golhar	ygolhar@stvincentngp.edu.in
10	648	15	3	2025-09-16	Placement		Placement	Yogesh Golhar	ygolhar@stvincentngp.edu.in
9	365	15	3	2025-09-16	Placement		Placement	Yogesh Golhar	ygolhar@stvincentngp.edu.in
8	338	15	3	2025-09-16	Placement		Placement	Yogesh Golhar	ygolhar@stvincentngp.edu.in
54	681	16	3	2025-09-17	She is determinate and knows where to go. Plan-A.B,C.D are ready.	Avoid multitasking. and focus on goals	During 2nd year, she will work on Python in depth.\nDuring 3rd year, Shewill learn concepts of AI.\nDuring final year will prepare for competitive exams and the entrance exam for joining the forces.	Sunil M. Wanjari	swanjari@stvincentngp.edu.in
22	372	16	3	2025-09-16	Potential to be a programmer. Since  from a rural background, they are poor in communication.	Need to work on oral and written communication. Shift to AI domain immediately.	Need to focus on Java programming.	Sunil M. Wanjari	swanjari@stvincentngp.edu.in
20	339	16	3	2025-09-16	Can Do better	Work on self-confidence and come out of shell.	Interested in Web development, hence need to learn Java Full stack	Sunil M. Wanjari	swanjari@stvincentngp.edu.in
60	664	17	3	2025-09-17	Average in Academic , Interested in Android Development and attend placement training	More focus on academics and try to gain the knowledge about Android and try to develop small applications	Daily one hour to be given for develop the skills sets	Ayaz Ahmed Khan	ayazkhan@stvincentngp.edu.in
59	649	17	3	2025-09-17	He is Average in Academics, he interested in the MPSC, UPSC exam, and wants to pursue higher education.	1.Focus on studies 2 hrs. Regularly   on UPSC and college.\n2. Increase consistency \n3. Keep Backup plan.	1. Meditation at morning and at evening.\n2. Avoid unwanted YouTube and mobile phone access.\n3. Take baby steps and calculated risk.	Ayaz Ahmed Khan	ayazkhan@stvincentngp.edu.in
58	694	17	3	2025-09-17	She is good in Academics but difficulty in the subject like Data Structure . She want to excel in current trends and technology	1. Focus on Core subjects.\n2. Clear concepts and search the video lectures based on Data Structure		Ayaz Ahmed Khan	ayazkhan@stvincentngp.edu.in
43	1372	17	5	2025-09-16	Good in Academic study , want to do internship.	Suggested her to try for the Online as well as offline Internship without hampering the academic study	Contact to the Department Internship In charge for the further Information.	Ayaz Ahmed Khan	ayazkhan@stvincentngp.edu.in
41	350	17	3	2025-09-16	Interested in Higher studies	suggested him to prepare and other entrance exam in future.	https://gate2026.iitg.ac.in/	Ayaz Ahmed Khan	ayazkhan@stvincentngp.edu.in
38	356	17	3	2025-09-16	He is interested in teaching and wanted to do M.tech and Ph.D	Detail about the PG is shared , Suggested him to prepare for the Gate Examination.	Url for the Gate Exam :-https://gate2026.iitg.ac.in/	Ayaz Ahmed Khan	ayazkhan@stvincentngp.edu.in
35	356	17	3	2025-09-16	He want to join Civil Services after the Graduation and required guidance for us.	suggested to join the Civil Services online course like PWOnlyIAS.	He will join the course in future.	Ayaz Ahmed Khan	ayazkhan@stvincentngp.edu.in
34	345	17	3	2025-09-16	She is having Exam phobia (also called test anxiety) is an intense feeling of fear or anxiety that  experience before or during exams. It can interfere with their ability to prepare for or perform well in exams.	Good preparation: Regular study and revision.\n\nPractice relaxation: Deep breathing, meditation.\n\nPositive mindset: Encourage self-confidence and positive thinking.\n\nTime management: Organize study time well.\n\nSeek support: Talk to teachers, counselors, or friends.\n\nHealthy lifestyle: Proper sleep, diet, and exercise.	1.Start Preparing Early\nDon’t wait until the last minute. Create a study schedule that breaks your syllabus into manageable parts and stick to it.\n\n2.Organize Your Study Material\nKeep your notes, textbooks, and resources neat and easy to access to reduce last-minute confusion.\n\n3.Practice Regularly\nSolve past question papers, sample tests, and quizzes. This helps build confidence and familiarity with exam patterns.\n\n4.Use Relaxation Techniques\nPractice deep breathing, meditation, or yoga to calm your mind and reduce anxiety.\n\n5.Stay Positive and Confident\nReplace negative thoughts (“I will fail”) with positive affirmations (“I am prepared and can do well”).\n\n6.Take Care of Your Health\nGet enough sleep, eat nutritious food, and exercise regularly to keep your body and mind strong.	Ayaz Ahmed Khan	ayazkhan@stvincentngp.edu.in
39	408	17	5	2025-09-16	He want to join Civil Services after the Graduation and required guidance for us.	Suggested to join the Civil Services online course like PWOnlyIAS.	He will join the course in future.	Ayaz Ahmed Khan	ayazkhan@stvincentngp.edu.in
71	698	18	3	2025-09-18	She is an average yet hardworking student with a keen interest in learning the Japanese language, which she is studying under the guidance of her uncle. Her goal is to secure a job abroad. She has basic knowledge of programming languages and is currently pursuing a course in Web Development.	You are hardworking and already learning Japanese, which is great for your goal of working abroad. To achieve this, you should also strengthen your technical skills by completing web development projects and improving your communication in both English and Japanese.	Keep practicing Japanese regularly, complete your web development course with hands-on projects, work on improving English fluency	Dhiraj Kumar Gupta	dgupta@stvincentngp.edu.in
49	355	18	3	2025-09-16	The student shows a tendency to overthink and strive for perfection, which sometimes affects productivity. There is a need to improve communication skills and set clear goals to enhance overall performance and career readiness.	You should try to focus on progress rather than perfection, work on improving your communication skills, and set clear short-term and long-term goals.	Practice effective communication, break tasks into manageable steps to avoid overthinking, and create a clear roadmap for your learning and career objectives.	Dhiraj Kumar Gupta	dgupta@stvincentngp.edu.in
47	368	18	3	2025-09-16	The student demonstrates average capability, with knowledge limited to programming skill and does not have any long-term goals.	You should try to set clear long-term goals and work on expanding your skills beyond basic programming	Focus on improving your programming skills,	Dhiraj Kumar Gupta	dgupta@stvincentngp.edu.in
44	406	18	5	2025-09-16	The student demonstrates strong learning abilities and having  interest in acquiring new skills, with some scope to further strengthen coding proficiency.	you should practice coding regularly and try working on small projects to improve your programming skills.	Focus on coding consistently, use online platforms to practice problems, and build small projects to strengthen your programming	Dhiraj Kumar Gupta	dgupta@stvincentngp.edu.in
36	410	18	5	2025-09-16	The student is a quick learner with the potential to excel in technical skills.	The student should focus on improving communication skills and participating in group activities or presentations to enhance overall developments	Work on communication skills through practice, workshops, and group projects, while continuing to strengthen technical knowledge and practical experience	Dhiraj Kumar Gupta	dgupta@stvincentngp.edu.in
32	364	18	3	2025-09-16	The student, though having an average academic performance and facing certain challenges, demonstrates a strong determination to secure a job. Coming from a financially constrained background, he shows motivation to improve and has foundational programming knowledge that can be further developed to enhance his career prospects.	He should improve his programming skills and look for internships to gain experience.	Practice programming regularly to build confidence.	Dhiraj Kumar Gupta	dgupta@stvincentngp.edu.in
31	1323	18	5	2025-09-16	The student is a consistent learner with strong interest in AI, web development, and research, supported by good communication and teaching skills.	She is advised to strengthen time management and self-confidence while actively engaging in projects and advanced skill development.	Focus on improving and enhancing problem-solving skills, and gaining practical exposure through projects and internships.	Dhiraj Kumar Gupta	dgupta@stvincentngp.edu.in
30	1380	18	5	2025-09-16	She has demonstrated good programming skills and prioritizes securing a job as her first preference. Additionally, she successfully managed multiple responsibilities during the hackathon as a member of the media team, showcasing her organizational and multitasking abilities.	She is encouraged to further enhance her leadership skills by taking up active roles in team projects, student organizations, or professional events, which will help her build confidence and decision-making ability.	Strengthen core programming (C, C++, Python) and practice problem-solving on platforms like Hacker Rank/Leet Code.	Dhiraj Kumar Gupta	dgupta@stvincentngp.edu.in
29	1367	18	5	2025-09-16	She is not interested in coding and wants to take up a non-technical job first	She has expressed limited interest in coding and prefers to begin her career with a non-technical role, aiming to gain workplace exposure and professional experience before considering specialization	Identify specific non-technical domains of interest	Dhiraj Kumar Gupta	dgupta@stvincentngp.edu.in
27	439	18	5	2025-09-16	The student performs at an average level and is experiencing problems, and the father is in a financially weak condition.	Set clear long-term goals and continuous practice through real-world projects.	Improve problem-solving, communication, and teamwork through group activities	Dhiraj Kumar Gupta	dgupta@stvincentngp.edu.in
26	1355	18	5	2025-09-16	The student demonstrates average capability, with knowledge limited to C, C++, and Python. The student does not have any long-term goals, except for the ambition of becoming a web developer or data analyst.	The student is advised to set clear long-term goals and strengthen skills beyond C, C++, and Python by focusing on advanced web development frameworks, data analysis tools, and continuous practice through real-world projects.	Set Clear Goals and more focus on Project Work.	Dhiraj Kumar Gupta	dgupta@stvincentngp.edu.in
52	705	19	3	2025-09-17	Academics is good but need more focus to overcome the weakness.\nNeed to participate in co-curricular activities and other forum activities to increase the stage daring.			Minal Chole	mchole@stvincentngp.edu.in
50	704	19	3	2025-09-17	need focus to increase pointer in current semester.\nshould take part in co-curricular activities.\ntry for the internship			Minal Chole	mchole@stvincentngp.edu.in
28	690	20	3	2025-09-16	1. Opting for placement\n2. Technically good and confident\n3. Lacking  in Communication	1. Talk in front of the mirror.\n2. Suggested to use two new English words daily.	For 2nd yr. provide opportunities/platforms to improve overall communication.	Vaibhav Deshpande	vdeshpande@stvincentngp.edu.in
67	1379	21	5	2025-09-18	want to perceive higher studies related with management. She has keen interest in data analytics.	suggest gaining expertise by doing skill courses related with data analysis. Focus on co-curricular activities. do CAT based courses	consistency in study and enrollment for different online/offline skill courses	Sandhya Dhage	sdhage@stvincentngp.edu.in
25	424	21	5	2025-09-16	He has domain interest in AI and ML (application area-Brain Computer Interfacing) and doing 3 months internship in IIT kharagpur(online mode)	Do skill courses in neurosciences, data analytics.	He has done bootcamp course in data analytics and m/c learning	Sandhya Dhage	sdhage@stvincentngp.edu.in
23	712	21	3	2025-09-16	He has interest in data science domain and full stack development. He has weakness for stage daring.	Suggest to do skill courses related with data science and back end development. participate in extra curricular activities to overcome stage daring	department has extra activities and workshops on skill courses	Sandhya Dhage	sdhage@stvincentngp.edu.in
16	326	21	3	2025-09-16	he has desire to do career in cyber security domain. He is facing challenges in data structure related programming in current semester.	Get doubts cleared from subject teacher of DS and do regular study in programming. \nDo skill courses related with cyber security domain.	Department support and conduct workshops for skill courses. Subject teacher always available for doubt solving session	Sandhya Dhage	sdhage@stvincentngp.edu.in
13	346	21	3	2025-09-16	He has desire to perceive career in professor level in esteemed college. he has interest in machine learning(neural n/w) domain.	do skill courses related with machine learning area. Gate preparation for admission in MTech	Department support and conduct various activities/workshops/expert sessions on recent technologies. Department has alumni sessions on GATE preparation	Sandhya Dhage	sdhage@stvincentngp.edu.in
7	382	21	5	2025-09-16	Not actively participation in extra curricular activities. He has desire to do career in web development.	To achieve career objective, he has to enroll for different skill courses related with web development strategies and upgrade resume. Need to focus on extra curricular activities.	Department motivates students for enrollment in NPTEL exam,GATE exam. Workshops on recent technologies/skills has been conducted.	Sandhya Dhage	sdhage@stvincentngp.edu.in
\.


--
-- Data for Name: password_reset_token; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.password_reset_token (id, user_id, token, created_at, expires_at, used) FROM stdin;
2	1	MQ.aMCIBA._XeCKkX4hDZyN3puJbq2aT5Ir-s	2025-09-09 20:03:16.817313	2025-09-09 21:03:16.815248	f
3	1	MQ.aMELvA.NE-ByuGHD77KZc__eLGo3uoAcWg	2025-09-10 05:25:16.853578	2025-09-10 06:25:16.851706	f
4	1	MQ.aMEMTQ.AS1CS9fxrvB0ANZUyrz5qRUDfos	2025-09-10 05:27:41.523782	2025-09-10 06:27:41.523258	f
71	696	Njk2.aMbgyg.RwGNyyKKLXQBT58UkrK1QbOrowo	2025-09-14 15:35:38.736886	2025-09-14 16:35:38.736421	t
7	439	NDM5.aMFRFg.fG9uKoxrpU__lrXUGVp6jR9ggLE	2025-09-10 10:21:10.847551	2025-09-10 11:21:10.847089	f
8	431	NDMx.aMFTLg.dQmmGg5P2Sb5BD6S4y6wfHsaKnM	2025-09-10 10:30:06.849193	2025-09-10 11:30:06.848562	f
9	431	NDMx.aMFTTw.eFEXYIOWVRObwjDEGODb6k5F7Qw	2025-09-10 10:30:39.130304	2025-09-10 11:30:39.129746	f
10	431	NDMx.aMFTiA.UUlwc1L8irgC_Qq5Lc0Sfqs5-mw	2025-09-10 10:31:36.070935	2025-09-10 11:31:36.07038	f
11	431	NDMx.aMFZJA.h9JvW-oHQOgOhSf0VD9wzeqgJFA	2025-09-10 10:55:32.769401	2025-09-10 11:55:32.768969	t
12	431	NDMx.aMFaFA.ebvcHtD-zqFsDbfzXOt5w_brXUc	2025-09-10 10:59:32.482526	2025-09-10 11:59:32.481966	f
13	431	NDMx.aMFaLg.DUlWvXWjAAJvQ3u6lJw8dtSZKew	2025-09-10 10:59:58.035306	2025-09-10 11:59:58.034743	f
14	431	NDMx.aMFaYw.tReu-S8-AjrQSPXGYZfChDANl2s	2025-09-10 11:00:51.166226	2025-09-10 12:00:51.165642	t
15	319	MzE5.aMGG5A.O-CtM21wwkuiW5cTnS7dezGKY2E	2025-09-10 14:10:44.873213	2025-09-10 15:10:44.872697	f
16	326	MzI2.aMGyYg.rMIDTsJJKR0SIxZYCc7ylO7gG2k	2025-09-10 17:16:18.379447	2025-09-10 18:16:18.379031	f
17	326	MzI2.aMGynA.30f1V-ZAFXIY-DilBPeDx9IQquY	2025-09-10 17:17:16.28743	2025-09-10 18:17:16.28699	f
18	655	NjU1.aMHBaA.jZmOJHlImBLxUmEBiICdajxVFko	2025-09-10 18:20:24.487916	2025-09-10 19:20:24.487398	f
19	655	NjU1.aMHBjQ.8N2dU4u41f69mYtkSsQjPLPbahE	2025-09-10 18:21:01.056583	2025-09-10 19:21:01.056023	f
20	1372	MTM3Mg.aMJXlA.APqVakM8bamZTZ8v4zYsvd2waIM	2025-09-11 05:01:08.929121	2025-09-11 06:01:08.927854	f
21	316	MzE2.aMJivA.DOcbTqMsV-XMKC0Ti92dmQLxh4I	2025-09-11 05:48:44.70478	2025-09-11 06:48:44.704407	t
22	340	MzQw.aMLOjA.AwBq1_0ssEqlRwe0i7WboSSqQ8E	2025-09-11 13:28:44.829672	2025-09-11 14:28:44.829212	f
23	340	MzQw.aMLPWg.YPl5mx0orflPuhjZaVphn8505p8	2025-09-11 13:32:10.213023	2025-09-11 14:32:10.212628	f
24	340	MzQw.aMLQHg.k3IE7ZJWcj90HVsrf25HdUjEjUo	2025-09-11 13:35:26.725867	2025-09-11 14:35:26.725428	t
25	358	MzU4.aMLUKQ.5_zSqh6U8d6KplybM0h2Cd4XQqU	2025-09-11 13:52:41.640713	2025-09-11 14:52:41.640296	f
26	358	MzU4.aMLUfA.DVt_V6KB5piQpR-3m-jsxYoPePo	2025-09-11 13:54:04.252185	2025-09-11 14:54:04.251551	f
27	358	MzU4.aMLUjA.5QL6u0ZJIbCSzIMaHHo8tSmbim8	2025-09-11 13:54:20.807727	2025-09-11 14:54:20.807252	f
28	429	NDI5.aML7yg.7oG3H0q4-5SZjFwI1q4N6vkyl2U	2025-09-11 16:41:46.978336	2025-09-11 17:41:46.978007	f
29	429	NDI5.aML8Gw.Wkv27OKE7op72wy8g5cP1C3fK20	2025-09-11 16:43:07.247131	2025-09-11 17:43:07.246659	f
30	429	NDI5.aMMCIA.xNIYCyTxlJeR4hXFamoVdOmhREY	2025-09-11 17:08:48.23607	2025-09-11 18:08:48.235565	f
31	429	NDI5.aMMH7A.LrDXxJogIyrYgg3B5QpRbbHF4XI	2025-09-11 17:33:32.646762	2025-09-11 18:33:32.646352	f
32	429	NDI5.aMMJJw.qtJaTcvmrrwF8qVoxd-wsn736vc	2025-09-11 17:38:48.00037	2025-09-11 18:38:47.999901	t
33	1349	MTM0OQ.aMMW9w.G_2TXrOvnZ9sa6_FgXLhfNyMDWc	2025-09-11 18:37:43.810924	2025-09-11 19:37:43.810404	f
34	1349	MTM0OQ.aMMXYg.AQznCY4_wrpvMytf1pOcb1vVHRU	2025-09-11 18:39:30.475238	2025-09-11 19:39:30.474793	f
35	1349	MTM0OQ.aMMXgQ.ptn7xUKIrVVdkxa16uIti3NmzyY	2025-09-11 18:40:01.68004	2025-09-11 19:40:01.679401	f
36	1349	MTM0OQ.aMMXqA.mb1dATnjummW2-6sIg73IrzYMP4	2025-09-11 18:40:40.894758	2025-09-11 19:40:40.894365	f
37	1349	MTM0OQ.aMMXuA.CLwzlib6AWl9muAhY9d_i_ib-Ps	2025-09-11 18:40:56.40018	2025-09-11 19:40:56.399766	f
38	1373	MTM3Mw.aMOb3Q.CmdjJVNJbbev_DfglH6jV07_dIY	2025-09-12 04:04:45.800485	2025-09-12 05:04:45.80002	f
39	1448	MTQ0OA.aMOiQA.lBhZu2zIC_BC4umQuLy8bBkt6yk	2025-09-12 04:32:00.65756	2025-09-12 05:32:00.657087	f
40	1461	MTQ2MQ.aMOuYw.s6nOGhBgrrW4nZf75sXs_YcZuzs	2025-09-12 05:23:47.713426	2025-09-12 06:23:47.712949	f
42	1458	MTQ1OA.aMPGWw.D8bBptBw5g03RsvQCUvuWPjSHOA	2025-09-12 07:06:03.713678	2025-09-12 08:06:03.712968	f
41	1458	MTQ1OA.aMPFjw.1DghEOT4ihhkKGhVaU_BrJ14c-s	2025-09-12 07:02:39.754362	2025-09-12 08:02:39.752643	t
44	1598	MTU5OA.aMPIrA.K63ih6S__maNM0_Rfon_ZCkg5kA	2025-09-12 07:15:56.829764	2025-09-12 08:15:56.829253	f
43	1350	MTM1MA.aMPImg.cEMMub8sxdPRMxT2mnEwrzsjh4Q	2025-09-12 07:15:38.118771	2025-09-12 08:15:38.118334	t
46	393	Mzkz.aMPPpg.ny5fKPDgKqkIYXaSVHKb7HRfwVo	2025-09-12 07:45:42.047552	2025-09-12 08:45:42.047025	f
47	393	Mzkz.aMPP3w.-Kk7dOoZxbCBuOD_A7KVIiTIFK8	2025-09-12 07:46:39.174987	2025-09-12 08:46:39.174546	f
45	393	Mzkz.aMPPkQ.PnXzT6-1vx5AGueoYcU8VkSe-XE	2025-09-12 07:45:21.75497	2025-09-12 08:45:21.754399	t
48	1448	MTQ0OA.aMPVGA._I5BUHQOdKTu9N_9J6Ml7wBUJuc	2025-09-12 08:08:56.436472	2025-09-12 09:08:56.435946	t
50	1554	MTU1NA.aMQsEQ.AUnzDZ0ZEh8NBo-LPKzbWul4-q0	2025-09-12 14:20:01.056979	2025-09-12 15:20:01.056444	f
51	1554	MTU1NA.aMQsHQ.03golxWtK5uBj_CUJWWNm9gEoMQ	2025-09-12 14:20:13.766511	2025-09-12 15:20:13.766119	f
49	1554	MTU1NA.aMQrwQ.TDUiD7VY2Ky7tOPTY9DLk9O2WUY	2025-09-12 14:18:41.154106	2025-09-12 15:18:41.151825	t
52	1567	MTU2Nw.aMQxbA.1oArHIKhxEP992oB8hq2lD5CJ-c	2025-09-12 14:42:52.473235	2025-09-12 15:42:52.472652	f
53	1567	MTU2Nw.aMQx8Q.aM0q_5ku554NZ4qTh3MPm_R2xqI	2025-09-12 14:45:05.769177	2025-09-12 15:45:05.76862	f
54	1421	MTQyMQ.aMT7Cg.smlOwBDuZ8s5-5LozDnrpudymv0	2025-09-13 05:03:06.885674	2025-09-13 06:03:06.884121	f
55	1414	MTQxNA.aMT7KQ.r1j6Mdo_Zq_a0pq67sWWEWW8vDw	2025-09-13 05:03:37.665708	2025-09-13 06:03:37.66509	f
56	1421	MTQyMQ.aMT7Rg.GYeem7iqjRPwe1AfvIajr1E1mKk	2025-09-13 05:04:06.764542	2025-09-13 06:04:06.76417	f
57	1421	MTQyMQ.aMT7aA.XYSw030N8g_0FbIWnYUGeIKEQ3s	2025-09-13 05:04:40.844042	2025-09-13 06:04:40.843599	t
58	446	NDQ2.aMUHdA.SWYENuFLGoP2G82V5Irpacq9-JI	2025-09-13 05:56:04.134024	2025-09-13 06:56:04.132758	f
59	1554	MTU1NA.aMUP_g.crSnPX8vSKkMYg7316KpR9Smwjo	2025-09-13 06:32:30.448096	2025-09-13 07:32:30.446104	t
60	1589	MTU4OQ.aMUc7Q.UHQjDgTWSvP1TSx-aRJUMnV3pF0	2025-09-13 07:27:41.257272	2025-09-13 08:27:41.256774	f
61	1589	MTU4OQ.aMUdmw.DS96slLjqm7LTc10iBGl12tW-F8	2025-09-13 07:30:35.689244	2025-09-13 08:30:35.688678	f
62	1589	MTU4OQ.aMUd9A.oruimAk6l3RC9o2CDu46v-95c4s	2025-09-13 07:32:04.591204	2025-09-13 08:32:04.590559	t
63	1563	MTU2Mw.aMU-nA.YQDkKDmn4A2Dm1mYCoCPRPOlvtI	2025-09-13 09:51:24.22503	2025-09-13 10:51:24.224335	f
64	1563	MTU2Mw.aMU_KA.VWXSLG64TPHnAU04Vx-GYPylvMg	2025-09-13 09:53:44.48734	2025-09-13 10:53:44.485227	t
65	1555	MTU1NQ.aMVEhQ.0-6Odgub3rTB8SY-WAG2x9Msa0s	2025-09-13 10:16:37.758008	2025-09-13 11:16:37.757451	f
66	707	NzA3.aMVMpA._lrEdhiqeYqRLvmaLL1AZz494Dg	2025-09-13 10:51:16.045791	2025-09-13 11:51:16.045217	t
67	1362	MTM2Mg.aMZ0NQ.G-p2-ku00mBmdwQGWYvjXthzVpk	2025-09-14 07:52:21.735255	2025-09-14 08:52:21.733629	f
68	1362	MTM2Mg.aMZ0UQ._kdudDOhrsMysS8Q0dwjXoko8O0	2025-09-14 07:52:49.523658	2025-09-14 08:52:49.523148	f
69	1362	MTM2Mg.aMZ0pw.quqFqwxAVI9e0rIryI9ZetBgqQA	2025-09-14 07:54:15.046972	2025-09-14 08:54:15.046465	f
70	696	Njk2.aMbfxw.Ej0zTwVWCB9RhPi2qgH9ICM3G0M	2025-09-14 15:31:19.494068	2025-09-14 16:31:19.492614	f
72	1362	MTM2Mg.aMcF1g.dvF0qGEgrZW41_dCwldvgsWMwCI	2025-09-14 18:13:42.216054	2025-09-14 19:13:42.215591	t
73	1386	MTM4Ng.aMgPWg.b1x2WxkxP2YlBSl03N_y-7P8NKY	2025-09-15 13:06:34.805483	2025-09-15 14:06:34.805008	f
74	1614	MTYxNA.aMkYEA._DBSCxeF5mOL5P3M4Ox8KHCIFpQ	2025-09-16 07:56:00.666838	2025-09-16 08:56:00.666455	f
75	1397	MTM5Nw.aMkYLg.DaCaWih-NDUkqkCm-KXPoHn4Cks	2025-09-16 07:56:30.222567	2025-09-16 08:56:30.222053	f
76	1397	MTM5Nw.aMkYig.fZFoSS5H19z0kGNCajYVaXcV2zQ	2025-09-16 07:58:02.87448	2025-09-16 08:58:02.873986	t
77	332	MzMy.aMkhOQ.Uxpb6zwYYmYT7bsbApRDg0iJVS8	2025-09-16 08:35:05.980226	2025-09-16 09:35:05.979756	f
78	330	MzMw.aMkheg.MmsUo1povOFmHK2Xea9XHR8AzZI	2025-09-16 08:36:10.91994	2025-09-16 09:36:10.919537	f
79	330	MzMw.aMkhyA.6jEDbH6-CwLQLabFnIhVZbCPRsM	2025-09-16 08:37:28.288328	2025-09-16 09:37:28.287963	f
80	330	MzMw.aMkiHQ.ELu0POCzHjl_xsSjuzSEUOlrXEw	2025-09-16 08:38:53.531761	2025-09-16 09:38:53.531321	f
81	1611	MTYxMQ.aMt_RQ.VWqGZwFbTY_2jTdxZTkOT2nzCOw	2025-09-18 03:40:53.53608	2025-09-18 04:40:53.534504	f
82	383	Mzgz.aOScKw.gmrOsMVgLAFPw-c-2B6h5sd_tZc	2025-10-07 04:50:51.011347	2025-10-07 05:50:51.010835	f
\.


--
-- Data for Name: past_education; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.past_education (id, student_id, exam_name, percentage, year_of_passing, exam_score, exam_date, board, exam_type) FROM stdin;
253	401	SSC	93.8	2021	\N	\N	\N	\N
254	401	HSSC	70.5	2023	\N	\N	\N	\N
726	656	SSC	84	2022	\N	\N	\N	\N
727	656	HSSC	62.17	2024	\N	\N	\N	\N
368	664	SSC	78	2022	\N	\N	\N	\N
369	664	HSSC	68	2024	\N	\N	\N	\N
165	328	SSC	87	2022	\N	\N	\N	\N
166	328	HSSC	72	2024	\N	\N	\N	\N
734	435	SSC	95	2021	\N	\N	\N	\N
735	435	HSSC	61.67	2023	\N	\N	\N	\N
71	659	SSC	64	2022	\N	\N	\N	\N
72	659	HSSC	53	2024	\N	\N	\N	\N
167	367	SSC	92	2022	\N	\N	\N	\N
168	367	HSSC	80.17	2024	\N	\N	\N	\N
75	366	SSC	75	2021	\N	\N	\N	\N
76	366	HSSC	70.6	2023	\N	\N	\N	\N
257	319	SSC	74.8	2021	\N	\N	\N	\N
258	319	HSSC	74.67	2023	\N	\N	\N	\N
79	688	SSC	79.5	2022	\N	\N	\N	\N
80	688	HSSC	72.5	2024	\N	\N	\N	\N
484	671	SSC	96.8	2022	\N	\N	\N	\N
485	671	HSSC	81	2024	\N	\N	\N	\N
488	415	SSC	87	2020	\N	\N	\N	\N
2575	1546	SSC	95	2020	\N	\N	\N	\N
175	352	SSC	84.6	2021	\N	\N	\N	\N
176	352	HSSC	71.5	2023	\N	\N	\N	\N
374	344	SSC	73	2022	\N	\N	\N	\N
375	344	HSSC	73	2024	\N	\N	\N	\N
179	315	SSC	74	2022	\N	\N	\N	\N
180	315	HSSC	65	2024	\N	\N	\N	\N
91	704	SSC	81.2	2020	\N	\N	\N	\N
92	704	HSSC	79	2022	\N	\N	\N	\N
1156	391	SSC	87	2021	\N	\N	\N	\N
95	660	SSC	92.2	2022	\N	\N	\N	\N
96	660	HSSC	78	2024	\N	\N	\N	\N
183	372	SSC	83.2	2021	\N	\N	\N	\N
184	372	HSSC	56	2023	\N	\N	\N	\N
267	381	SSC	78	2021	\N	\N	\N	\N
268	381	HSSC	67	2023	\N	\N	\N	\N
1157	391	HSSC	61.5	2023	\N	\N	\N	\N
1889	1558	SSC	86	2020	\N	\N	\N	\N
1890	1558	HSSC	67	2022	\N	\N	\N	\N
764	320	SSC	84.8	2022	\N	\N	\N	\N
109	647	SSC	88.2	2022	\N	\N	\N	\N
110	647	HSSC	74.17	2024	\N	\N	\N	\N
111	364	SSC	86.6	2022	\N	\N	\N	\N
112	364	HSSC	62.83	2024	\N	\N	\N	\N
1903	1337	SSC	8	2021	\N	\N	\N	\N
765	320	HSSC	61.67	2024	\N	\N	\N	\N
774	357	SSC	92	2022	\N	\N	\N	\N
278	675	SSC	89	2022	\N	\N	\N	\N
279	675	HSSC	66.5	2024	\N	\N	\N	\N
775	357	HSSC	83	2024	\N	\N	\N	\N
1904	1337	HSSC	56.5	2023	\N	\N	\N	\N
1907	1381	SSC	96	2021	\N	\N	\N	\N
119	667	SSC	90	2022	\N	\N	\N	\N
120	667	HSSC	70	2024	\N	\N	\N	\N
121	343	SSC	84.8	2022	\N	\N	\N	\N
122	343	HSSC	64.44	2024	\N	\N	\N	\N
123	653	SSC	86	2022	\N	\N	\N	\N
124	653	HSSC	87	2024	\N	\N	\N	\N
794	407	SSC	75.4	2021	\N	\N	\N	\N
284	698	SSC	92	2022	\N	\N	\N	\N
1908	1381	HSSC	83.85	2024	\N	\N	\N	\N
1915	1401	SSC	85	2020	\N	\N	\N	\N
285	698	HSSC	74	2024	\N	\N	\N	\N
390	687	SSC	92.6	2022	\N	\N	\N	\N
133	361	SSC	89	2021	\N	\N	\N	\N
134	361	HSSC	67.33	2023	\N	\N	\N	\N
391	687	HSSC	70.33	2024	\N	\N	\N	\N
795	407	HSSC	64.67	2023	\N	\N	\N	\N
141	334	SSC	81	2022	\N	\N	\N	\N
142	334	HSSC	90	2024	\N	\N	\N	\N
1916	1401	HSSC	75	2022	\N	\N	\N	\N
145	358	SSC	86.8	2022	\N	\N	\N	\N
146	358	HSSC	72.5	2024	\N	\N	\N	\N
396	322	SSC	80	2022	\N	\N	\N	\N
2447	1519	SSC	54	2019	\N	\N	\N	\N
2448	1519	HSSC	83.4	2021	\N	\N	\N	\N
397	322	HSSC	49.83	2024	\N	\N	\N	\N
296	672	SSC	88	2022	\N	\N	\N	\N
297	672	HSSC	66.5	2024	\N	\N	\N	\N
221	326	SSC	76	2022	\N	\N	\N	\N
222	326	HSSC	65	2024	\N	\N	\N	\N
400	654	SSC	89.6	2022	\N	\N	\N	\N
401	654	HSSC	70.5	2024	\N	\N	\N	\N
302	702	SSC	84.4	2022	\N	\N	\N	\N
231	353	SSC	92	2022	\N	\N	\N	\N
232	353	HSSC	72.2	2024	\N	\N	\N	\N
303	702	HSSC	63.67	2024	\N	\N	\N	\N
306	707	SSC	91.8	2022	\N	\N	\N	\N
307	707	HSSC	76.5	2024	\N	\N	\N	\N
310	369	SSC	85	2022	\N	\N	\N	\N
311	369	HSSC	65	2024	\N	\N	\N	\N
414	693	SSC	75	2022	\N	\N	\N	\N
415	693	HSSC	68.33	2024	\N	\N	\N	\N
320	705	SSC	88.4	2022	\N	\N	\N	\N
251	436	SSC	88.6	2021	\N	\N	\N	\N
252	436	HSSC	83.66	2024	\N	\N	\N	\N
321	705	HSSC	78.67	2024	\N	\N	\N	\N
324	356	SSC	79.5	2022	\N	\N	\N	\N
325	356	HSSC	75.33	2024	\N	\N	\N	\N
330	386	SSC	74.2	2021	\N	\N	\N	\N
331	386	HSSC	82.33	2023	\N	\N	\N	\N
332	712	SSC	81	2021	\N	\N	\N	\N
333	712	HSSC	62	2023	\N	\N	\N	\N
354	668	SSC	91.6	2022	\N	\N	\N	\N
355	668	HSSC	76.17	2024	\N	\N	\N	\N
356	324	SSC	82.2	2022	\N	\N	\N	\N
357	324	HSSC	68.17	2024	\N	\N	\N	\N
490	384	SSC	91	2021	\N	\N	\N	\N
491	384	HSSC	65.83	2023	\N	\N	\N	\N
596	1332	SSC	81	2021	\N	\N	\N	\N
597	1332	HSSC	78	2023	\N	\N	\N	\N
502	650	SSC	89.9	2022	\N	\N	\N	\N
503	650	HSSC	79.33	2024	\N	\N	\N	\N
506	648	SSC	78	2022	\N	\N	\N	\N
507	648	HSSC	62	2024	\N	\N	\N	\N
1875	1424	SSC	89	2019	\N	\N	\N	\N
1876	1424	HSSC	91.33	2021	\N	\N	\N	\N
2097	1563	SSC	82	2019	\N	\N	\N	\N
2098	1563	HSSC	95	2021	\N	\N	\N	\N
536	1325	SSC	89	2021	\N	\N	\N	\N
537	1325	HSSC	72	2023	\N	\N	\N	\N
614	336	SSC	100	2021	\N	\N	\N	\N
615	336	HSSC	76.17	2024	\N	\N	\N	\N
1158	1341	SSC	89.4	2021	\N	\N	\N	\N
1159	1341	HSSC	87	2023	\N	\N	\N	\N
1164	400	SSC	92	2021	\N	\N	\N	\N
1165	400	HSSC	65	2023	\N	\N	\N	\N
2101	1430	SSC	89	2019	\N	\N	\N	\N
2102	1430	HSSC	88.6	2021	\N	\N	\N	\N
626	684	SSC	82.4	2022	\N	\N	\N	\N
627	684	HSSC	60.4	2024	\N	\N	\N	\N
630	378	SSC	94.2	2021	\N	\N	\N	\N
631	378	HSSC	74.83	2023	\N	\N	\N	\N
2855	1367	SSC	91.6	2021	\N	\N	\N	\N
2856	1367	HSSC	77	2023	\N	\N	\N	\N
564	1321	SSC	86	2021	\N	\N	\N	\N
565	1321	HSSC	72.67	2023	\N	\N	\N	\N
648	405	SSC	89.4	2021	\N	\N	\N	\N
649	405	HSSC	73.23	2023	\N	\N	\N	\N
578	1372	SSC	70	2020	\N	\N	\N	\N
579	1372	HSSC	79.8	2022	\N	\N	\N	\N
1180	385	SSC	83	2021	\N	\N	\N	\N
1181	385	HSSC	79	2023	\N	\N	\N	\N
584	370	SSC	84	2022	\N	\N	\N	\N
585	370	HSSC	81	2024	\N	\N	\N	\N
588	690	SSC	89	2022	\N	\N	\N	\N
589	690	HSSC	80	2024	\N	\N	\N	\N
2459	1400	SSC	87.4	2020	\N	\N	\N	\N
2460	1400	HSSC	70.83	2022	\N	\N	\N	\N
2469	1552	SSC	92.6	2020	\N	\N	\N	\N
1038	1384	SSC	92.4	2022	\N	\N	\N	\N
674	1394	SSC	86.2	2019	\N	\N	\N	\N
675	1394	HSSC	92.67	2021	\N	\N	\N	\N
2470	1552	HSSC	87.33	2022	\N	\N	\N	\N
1192	377	SSC	89.4	2021	\N	\N	\N	\N
1560	696	SSC	89	2022	\N	\N	\N	\N
1561	696	HSSC	74	2024	\N	\N	\N	\N
1193	377	HSSC	80.2	2023	\N	\N	\N	\N
1564	669	SSC	97	2021	\N	\N	\N	\N
1569	1328	SSC	93	2020	\N	\N	\N	\N
1200	419	SSC	93	2021	\N	\N	\N	\N
1201	419	HSSC	89	2023	\N	\N	\N	\N
1570	1328	HSSC	86	2022	\N	\N	\N	\N
1057	1376	SSC	86.3	2021	\N	\N	\N	\N
1058	1376	HSSC	83.4	2023	\N	\N	\N	\N
714	368	SSC	93.8	2022	\N	\N	\N	\N
715	368	HSSC	75.2	2024	\N	\N	\N	\N
718	365	SSC	89.6	2022	\N	\N	\N	\N
719	365	HSSC	76	2024	\N	\N	\N	\N
1061	349	SSC	60	2022	\N	\N	\N	\N
947	363	SSC	86.64	2022	\N	\N	\N	\N
948	363	HSSC	82.17	2024	\N	\N	\N	\N
839	428	SSC	84	2021	\N	\N	\N	\N
840	428	HSSC	75	2023	\N	\N	\N	\N
1062	349	HSSC	53	2024	\N	\N	\N	\N
1571	1385	SSC	94.4	2020	\N	\N	\N	\N
1572	1385	HSSC	74.6	2022	\N	\N	\N	\N
1354	1406	SSC	79.2	2020	\N	\N	\N	\N
1210	1373	SSC	86	2021	\N	\N	\N	\N
1211	1373	HSSC	59	2023	\N	\N	\N	\N
1212	425	SSC	85	2021	\N	\N	\N	\N
1073	337	SSC	89.6	2022	\N	\N	\N	\N
1074	337	HSSC	72.88	2024	\N	\N	\N	\N
1213	425	HSSC	83	2023	\N	\N	\N	\N
1355	1406	HSSC	65.83	2022	\N	\N	\N	\N
967	1365	SSC	89	2021	\N	\N	\N	\N
968	1365	HSSC	80	2023	\N	\N	\N	\N
1575	1388	SSC	79.85	2020	\N	\N	\N	\N
1576	1388	HSSC	95.17	2022	\N	\N	\N	\N
977	432	SSC	92.6	2021	\N	\N	\N	\N
978	432	HSSC	79.6	2023	\N	\N	\N	\N
981	681	SSC	92.2	2022	\N	\N	\N	\N
982	681	HSSC	86	2024	\N	\N	\N	\N
1222	1437	SSC	73.2	2019	\N	\N	\N	\N
1223	1437	HSSC	77	2021	\N	\N	\N	\N
993	1336	SSC	79	2021	\N	\N	\N	\N
994	1336	HSSC	54	2023	\N	\N	\N	\N
1238	1355	SSC	68	2021	\N	\N	\N	\N
1239	1355	HSSC	69	2023	\N	\N	\N	\N
1368	423	SSC	89	2021	\N	\N	\N	\N
1369	423	HSSC	78	2023	\N	\N	\N	\N
1109	1329	SSC	92.2	2021	\N	\N	\N	\N
1110	1329	HSSC	64.83	2023	\N	\N	\N	\N
1378	396	SSC	71	2020	\N	\N	\N	\N
1379	396	HSSC	60.5	2022	\N	\N	\N	\N
1380	1391	SSC	92.8	2020	\N	\N	\N	\N
1381	1391	HSSC	87	2022	\N	\N	\N	\N
1384	1411	SSC	89	2020	\N	\N	\N	\N
1385	1411	HSSC	75	2022	\N	\N	\N	\N
1388	1361	SSC	75	2021	\N	\N	\N	\N
1389	1361	HSSC	56	2023	\N	\N	\N	\N
1272	1351	SSC	80	2021	\N	\N	\N	\N
1141	441	SSC	94	2020	\N	\N	\N	\N
1273	1351	HSSC	70	2023	\N	\N	\N	\N
1274	375	SSC	93.6	2021	\N	\N	\N	\N
1275	375	HSSC	73.5	2023	\N	\N	\N	\N
1148	413	SSC	79	2021	\N	\N	\N	\N
1149	413	HSSC	69	2023	\N	\N	\N	\N
1284	389	SSC	96	2021	\N	\N	\N	\N
1285	389	HSSC	67	2023	\N	\N	\N	\N
1286	1422	SSC	88.8	2020	\N	\N	\N	\N
1287	1422	HSSC	75.14	2022	\N	\N	\N	\N
1290	392	SSC	84	2021	\N	\N	\N	\N
1291	392	HSSC	73	2023	\N	\N	\N	\N
1308	1416	SSC	83.4	2020	\N	\N	\N	\N
1309	1416	HSSC	67.67	2022	\N	\N	\N	\N
1318	345	SSC	87.8	2022	\N	\N	\N	\N
1319	345	HSSC	53.5	2024	\N	\N	\N	\N
1320	395	SSC	76	2021	\N	\N	\N	\N
1321	395	HSSC	60	2023	\N	\N	\N	\N
2091	1428	SSC	91.4	2020	\N	\N	\N	\N
2092	1428	HSSC	85	2022	\N	\N	\N	\N
489	415	HSSC	70	2022	\N	\N	\N	\N
730	651	SSC	72.6	2022	\N	\N	\N	\N
731	651	HSSC	80	2024	\N	\N	\N	\N
2576	1546	HSSC	83.17	2022	\N	\N	\N	\N
420	695	SSC	90	2021	\N	\N	\N	\N
421	695	HSSC	68.5	2023	\N	\N	\N	\N
2851	314	SSC	76.8	2022	\N	\N	\N	\N
604	313	SSC	71	2022	\N	\N	\N	\N
426	679	SSC	70	2021	\N	\N	\N	\N
427	679	HSSC	70	2023	\N	\N	\N	\N
605	313	HSSC	70	2024	\N	\N	\N	\N
1009	1334	SSC	89.9	2021	\N	\N	\N	\N
430	680	SSC	84	2022	\N	\N	\N	\N
431	680	HSSC	68	2024	\N	\N	\N	\N
1010	1334	HSSC	68.6	2023	\N	\N	\N	\N
618	1360	SSC	87	2021	\N	\N	\N	\N
619	1360	HSSC	70	2023	\N	\N	\N	\N
2852	314	HSSC	65.33	2024	\N	\N	\N	\N
1013	1347	SSC	97.4	2020	\N	\N	\N	\N
1014	1347	HSSC	78.17	2023	\N	\N	\N	\N
1162	1426	SSC	60.4	2020	\N	\N	\N	\N
1163	1426	HSSC	79.67	2022	\N	\N	\N	\N
1019	1353	SSC	74.4	2021	\N	\N	\N	\N
444	686	SSC	78	2022	\N	\N	\N	\N
445	686	HSSC	56	2024	\N	\N	\N	\N
1020	1353	HSSC	57.67	2023	\N	\N	\N	\N
528	1322	SSC	91.87	2021	\N	\N	\N	\N
529	1322	HSSC	85	2023	\N	\N	\N	\N
644	1318	SSC	89	2021	\N	\N	\N	\N
645	1318	HSSC	81	2023	\N	\N	\N	\N
1516	430	SSC	80	2020	\N	\N	\N	\N
770	703	SSC	96	2022	\N	\N	\N	\N
454	694	SSC	92.6	2022	\N	\N	\N	\N
455	694	HSSC	72.33	2024	\N	\N	\N	\N
771	703	HSSC	82	2024	\N	\N	\N	\N
889	340	SSC	92.2	2022	\N	\N	\N	\N
890	340	HSSC	78.17	2024	\N	\N	\N	\N
1517	430	HSSC	63	2022	\N	\N	\N	\N
460	665	SSC	85.84	2022	\N	\N	\N	\N
461	665	HSSC	84.83	2024	\N	\N	\N	\N
1524	433	SSC	87	2020	\N	\N	\N	\N
782	1429	SSC	89.8	2020	\N	\N	\N	\N
464	706	SSC	84	2022	\N	\N	\N	\N
465	706	HSSC	81	2024	\N	\N	\N	\N
783	1429	HSSC	88.17	2022	\N	\N	\N	\N
786	387	SSC	91.4	2021	\N	\N	\N	\N
787	387	HSSC	90.83	2023	\N	\N	\N	\N
666	380	SSC	90.8	2020	\N	\N	\N	\N
667	380	HSSC	74.6	2022	\N	\N	\N	\N
895	1382	SSC	81.04	2021	\N	\N	\N	\N
472	677	SSC	90.4	2022	\N	\N	\N	\N
473	677	HSSC	85.33	2024	\N	\N	\N	\N
896	1382	HSSC	84.05	2024	\N	\N	\N	\N
670	700	SSC	88	2022	\N	\N	\N	\N
671	700	HSSC	72	2024	\N	\N	\N	\N
2874	329	SSC	89.2	2022	\N	\N	\N	\N
478	709	SSC	89	2022	\N	\N	\N	\N
479	709	HSSC	82.63	2024	\N	\N	\N	\N
2875	329	HSSC	76	2024	\N	\N	\N	\N
2649	1320	SSC	97	2021	\N	\N	\N	\N
2650	1320	HSSC	73	2023	\N	\N	\N	\N
800	649	SSC	85	2022	\N	\N	\N	\N
801	649	HSSC	87	2024	\N	\N	\N	\N
684	1344	SSC	85	2021	\N	\N	\N	\N
685	1344	HSSC	71.17	2023	\N	\N	\N	\N
688	355	SSC	77	2022	\N	\N	\N	\N
689	355	HSSC	70	2024	\N	\N	\N	\N
692	331	SSC	60	2022	\N	\N	\N	\N
693	331	HSSC	82	2024	\N	\N	\N	\N
696	1438	SSC	94.6	2020	\N	\N	\N	\N
697	1438	HSSC	83.4	2022	\N	\N	\N	\N
700	332	SSC	89.6	2022	\N	\N	\N	\N
701	332	HSSC	77.33	2024	\N	\N	\N	\N
704	359	SSC	77	2022	\N	\N	\N	\N
705	359	HSSC	66.83	2024	\N	\N	\N	\N
1031	434	SSC	69	2021	\N	\N	\N	\N
1032	434	HSSC	81	2023	\N	\N	\N	\N
708	683	SSC	94.4	2024	\N	\N	\N	\N
709	683	HSSC	75.8	2024	\N	\N	\N	\N
1911	1547	SSC	89	2020	\N	\N	\N	\N
1912	1547	HSSC	80.69	2022	\N	\N	\N	\N
1358	1444	SSC	80.8	2018	\N	\N	\N	\N
1359	1444	HSSC	79.77	2023	\N	\N	\N	\N
1947	1427	SSC	81	2020	\N	\N	\N	\N
1948	1427	HSSC	70.33	2022	\N	\N	\N	\N
1969	330	SSC	90.4	2022	\N	\N	\N	\N
1970	330	HSSC	69.5	2024	\N	\N	\N	\N
1184	379	SSC	93.6	2021	\N	\N	\N	\N
2196	1524	SSC	91.4	2019	\N	\N	\N	\N
1049	1345	SSC	90.6	2021	\N	\N	\N	\N
1050	1345	HSSC	74.83	2023	\N	\N	\N	\N
921	416	SSC	86.6	2021	\N	\N	\N	\N
922	416	HSSC	65.17	2023	\N	\N	\N	\N
1051	1357	SSC	92	2021	\N	\N	\N	\N
1052	1357	HSSC	80	2023	\N	\N	\N	\N
1055	1445	SSC	84.4	2020	\N	\N	\N	\N
1056	1445	HSSC	71.4	2023	\N	\N	\N	\N
1059	360	SSC	86.6	2022	\N	\N	\N	\N
1060	360	HSSC	68	2024	\N	\N	\N	\N
1185	379	HSSC	67.67	2023	\N	\N	\N	\N
2197	1524	HSSC	96.8	2021	\N	\N	\N	\N
939	699	SSC	89.4	2022	\N	\N	\N	\N
940	699	HSSC	78.17	2024	\N	\N	\N	\N
1071	321	SSC	91.2	2022	\N	\N	\N	\N
1072	321	HSSC	66.64	2024	\N	\N	\N	\N
1081	652	SSC	91	2021	\N	\N	\N	\N
1082	652	HSSC	71	2023	\N	\N	\N	\N
2271	1575	SSC	90.4	2020	\N	\N	\N	\N
1196	1366	SSC	97	2023	\N	\N	\N	\N
1197	1366	HSSC	74.5	2023	\N	\N	\N	\N
964	312	SSC	80	2024	\N	\N	\N	\N
973	1371	SSC	91.2	2021	\N	\N	\N	\N
974	1371	HSSC	62	2023	\N	\N	\N	\N
985	1378	SSC	91	2020	\N	\N	\N	\N
986	1378	HSSC	81.8	2022	\N	\N	\N	\N
1111	1346	SSC	87.2	2021	\N	\N	\N	\N
1112	1346	HSSC	70.17	2023	\N	\N	\N	\N
2319	1573	SSC	96.4	2020	\N	\N	\N	\N
1131	663	SSC	78.96	2022	\N	\N	\N	\N
1132	663	HSSC	68.56	2024	\N	\N	\N	\N
1135	1352	SSC	90.8	2020	\N	\N	\N	\N
1136	1352	HSSC	70.83	2022	\N	\N	\N	\N
2320	1573	HSSC	83.1	2023	\N	\N	\N	\N
1232	421	SSC	87	2021	\N	\N	\N	\N
1233	421	HSSC	55	2023	\N	\N	\N	\N
1244	323	SSC	87	2021	\N	\N	\N	\N
1245	323	HSSC	69.5	2023	\N	\N	\N	\N
1881	1379	SSC	85	2020	\N	\N	\N	\N
1882	1379	HSSC	85.5	2023	\N	\N	\N	\N
2853	409	SSC	88	2020	\N	\N	\N	\N
1412	1390	SSC	87.4	2020	\N	\N	\N	\N
1413	1390	HSSC	78.67	2022	\N	\N	\N	\N
2854	409	HSSC	61	2022	\N	\N	\N	\N
1522	1425	SSC	73	2019	\N	\N	\N	\N
1523	1425	HSSC	81.5	2021	\N	\N	\N	\N
1532	1584	SSC	92	2020	\N	\N	\N	\N
1533	1584	HSSC	84.5	2022	\N	\N	\N	\N
1448	445	SSC	89	2020	\N	\N	\N	\N
1449	445	HSSC	92	2022	\N	\N	\N	\N
2599	1544	SSC	81	2019	\N	\N	\N	\N
2117	1436	SSC	85.6	2020	\N	\N	\N	\N
2118	1436	HSSC	58.6	2022	\N	\N	\N	\N
2202	1431	SSC	81.6	2020	\N	\N	\N	\N
1899	1398	SSC	79	2020	\N	\N	\N	\N
1900	1398	HSSC	53	2022	\N	\N	\N	\N
2203	1431	HSSC	72.5	2022	\N	\N	\N	\N
2600	1544	HSSC	97	2021	\N	\N	\N	\N
2882	1383	SSC	66.2	2021	\N	\N	\N	\N
2224	1539	SSC	83	2020	\N	\N	\N	\N
1629	383	SSC	81	2021	\N	\N	\N	\N
1630	383	HSSC	61	2023	\N	\N	\N	\N
1943	1582	SSC	81.8	2018	\N	\N	\N	\N
1944	1582	HSSC	66.46	2020	\N	\N	\N	\N
2225	1539	HSSC	86	2022	\N	\N	\N	\N
2232	1518	SSC	90	2020	\N	\N	\N	\N
1967	1386	SSC	94.4	2020	\N	\N	\N	\N
1968	1386	HSSC	75.5	2022	\N	\N	\N	\N
2233	1518	HSSC	84	2022	\N	\N	\N	\N
2248	1553	SSC	77	2020	\N	\N	\N	\N
2249	1553	HSSC	72	2022	\N	\N	\N	\N
1981	1561	SSC	93	2019	\N	\N	\N	\N
1982	1561	HSSC	95.67	2021	\N	\N	\N	\N
1667	1413	SSC	86.2	2020	\N	\N	\N	\N
1668	1413	HSSC	65.33	2022	\N	\N	\N	\N
1987	1389	SSC	94.6	2020	\N	\N	\N	\N
1988	1389	HSSC	82.4	2022	\N	\N	\N	\N
2617	408	SSC	90.8	2021	\N	\N	\N	\N
2618	408	HSSC	70.6	2023	\N	\N	\N	\N
1993	1560	SSC	95	2020	\N	\N	\N	\N
1994	1560	HSSC	85.6	2022	\N	\N	\N	\N
2003	1556	SSC	76.8	2020	\N	\N	\N	\N
1865	442	SSC	85	2021	\N	\N	\N	\N
1866	442	HSSC	85.49	2024	\N	\N	\N	\N
2004	1556	HSSC	67.67	2022	\N	\N	\N	\N
2633	1530	SSC	91	2019	\N	\N	\N	\N
2634	1530	HSSC	94	2021	\N	\N	\N	\N
2292	1532	SSC	89.6	2020	\N	\N	\N	\N
2293	1532	HSSC	79.33	2022	\N	\N	\N	\N
2665	376	SSC	93	2021	\N	\N	\N	\N
2666	376	HSSC	82.6	2023	\N	\N	\N	\N
2667	412	SSC	81.6	2021	\N	\N	\N	\N
2668	412	HSSC	74.5	2023	\N	\N	\N	\N
2695	417	SSC	88	2021	\N	\N	\N	\N
2696	417	HSSC	71	2023	\N	\N	\N	\N
2719	1331	SSC	74	2021	\N	\N	\N	\N
2720	1331	HSSC	60	2023	\N	\N	\N	\N
2755	658	SSC	90.8	2022	\N	\N	\N	\N
2756	658	HSSC	91.8	2024	\N	\N	\N	\N
2769	348	SSC	75	2022	\N	\N	\N	\N
2770	348	HSSC	58	2024	\N	\N	\N	\N
2809	398	SSC	94.2	2021	\N	\N	\N	\N
2810	398	HSSC	74.6	2023	\N	\N	\N	\N
2835	662	SSC	82	2022	\N	\N	\N	\N
2836	662	HSSC	66	2024	\N	\N	\N	\N
2353	1580	SSC	66	2019	\N	\N	\N	\N
2354	1580	HSSC	81.5	2021	\N	\N	\N	\N
1885	350	SSC	90	2022	\N	\N	\N	\N
1886	350	HSSC	76	2024	\N	\N	\N	\N
2115	1412	SSC	89.5	2020	\N	\N	\N	\N
2116	1412	HSSC	75	2022	\N	\N	\N	\N
1434	1403	SSC	86	2020	\N	\N	\N	\N
1435	1403	HSSC	58	2021	\N	\N	\N	\N
1536	362	SSC	96.02	2022	\N	\N	\N	\N
1537	362	HSSC	79	2024	\N	\N	\N	\N
1739	1333	SSC	67.5	2021	\N	\N	\N	\N
1740	1333	HSSC	59.33	2023	\N	\N	\N	\N
1743	1368	SSC	85	2021	\N	\N	\N	\N
1744	1368	HSSC	65	2023	\N	\N	\N	\N
2857	410	SSC	81.8	2020	\N	\N	\N	\N
2858	410	HSSC	71.83	2022	\N	\N	\N	\N
1573	1388	SSC	79.85	2020	\N	\N	\N	\N
1574	1388	HSSC	95.17	2022	\N	\N	\N	\N
2371	1581	SSC	84	2019	\N	\N	\N	\N
2372	1581	HSSC	64	2021	\N	\N	\N	\N
2375	1515	SSC	82	2020	\N	\N	\N	\N
2376	1515	HSSC	81.33	2022	\N	\N	\N	\N
2389	1533	SSC	77	2020	\N	\N	\N	\N
2390	1533	HSSC	47.67	2022	\N	\N	\N	\N
1789	657	SSC	86	2022	\N	\N	\N	\N
1790	657	HSSC	82	2023	\N	\N	\N	\N
1641	1420	SSC	86	2018	\N	\N	\N	\N
1642	1420	HSSC	75	2020	\N	\N	\N	\N
1797	341	SSC	81.2	2022	\N	\N	\N	\N
1798	341	HSSC	64.5	2024	\N	\N	\N	\N
2001	1535	SSC	92.8	2020	\N	\N	\N	\N
2002	1535	HSSC	92.17	2022	\N	\N	\N	\N
1681	1441	SSC	81.2	2020	\N	\N	\N	\N
1682	1441	HSSC	82.06	2023	\N	\N	\N	\N
1815	333	SSC	77	2022	\N	\N	\N	\N
1816	333	HSSC	74	2024	\N	\N	\N	\N
2262	1523	SSC	72	2020	\N	\N	\N	\N
2263	1523	HSSC	77.4	2022	\N	\N	\N	\N
1831	1548	SSC	80	2020	\N	\N	\N	\N
1832	1548	HSSC	67.5	2022	\N	\N	\N	\N
2264	1550	SSC	84	2020	\N	\N	\N	\N
2265	1550	HSSC	75.5	2022	\N	\N	\N	\N
2397	1514	SSC	76	2019	\N	\N	\N	\N
2398	1514	HSSC	89	2020	\N	\N	\N	\N
2613	424	SSC	83	2020	\N	\N	\N	\N
2614	424	HSSC	66	2022	\N	\N	\N	\N
1863	1407	SSC	95.2	2020	\N	\N	\N	\N
1864	1407	HSSC	87.67	2022	\N	\N	\N	\N
2861	388	SSC	94.6	2021	\N	\N	\N	\N
2862	388	HSSC	87	2023	\N	\N	\N	\N
2621	1537	SSC	89	2020	\N	\N	\N	\N
2622	1537	HSSC	60	2022	\N	\N	\N	\N
2296	1572	SSC	82	2020	\N	\N	\N	\N
2863	1583	SSC	73.4	2021	\N	\N	\N	\N
2864	1583	HSSC	70.83	2023	\N	\N	\N	\N
2876	327	SSC	90.8	2022	\N	\N	\N	\N
2877	327	HSSC	80.5	2024	\N	\N	\N	\N
2891	438	SSC	80.8	2021	\N	\N	\N	\N
2892	438	HSSC	86.29	2024	\N	\N	\N	\N
2327	1562	SSC	86	2020	\N	\N	\N	\N
2328	1562	HSSC	76.67	2022	\N	\N	\N	\N
2465	1402	SSC	83	2020	\N	\N	\N	\N
2466	1402	HSSC	78	2022	\N	\N	\N	\N
2341	1543	SSC	90	2020	\N	\N	\N	\N
2342	1543	HSSC	74.17	2022	\N	\N	\N	\N
2913	981	SSC	62	2020	\N	\N	\N	\N
2705	411	SSC	87.8	2021	\N	\N	\N	\N
2706	411	HSSC	60.5	2023	\N	\N	\N	\N
2914	981	HSSC	55	2022	\N	\N	\N	\N
2929	346	SSC	87.2	2022	\N	\N	\N	\N
2747	440	SSC	69	2020	\N	\N	\N	\N
2748	440	HSSC	68	2023	\N	\N	\N	\N
2930	346	HSSC	68.83	2024	\N	\N	\N	\N
2819	710	SSC	86.8	2022	\N	\N	\N	\N
2820	710	HSSC	66.67	2024	\N	\N	\N	\N
2872	338	SSC	97	2022	\N	\N	\N	\N
2873	338	HSSC	80	2024	\N	\N	\N	\N
1426	1435	SSC	65	2022	\N	\N	\N	\N
1427	1435	HSSC	69	2022	\N	\N	\N	\N
1717	1348	SSC	92	2021	\N	\N	\N	\N
1718	1348	HSSC	79.17	2023	\N	\N	\N	\N
1446	1414	SSC	93	2020	\N	\N	\N	\N
1447	1414	HSSC	87.17	2022	\N	\N	\N	\N
1452	1387	SSC	83.17	2020	\N	\N	\N	\N
1453	1387	HSSC	86.7	2022	\N	\N	\N	\N
1518	394	SSC	70	2020	\N	\N	\N	\N
1519	394	HSSC	55	2022	\N	\N	\N	\N
1925	1549	SSC	75.4	2020	\N	\N	\N	\N
1926	1549	HSSC	75.17	2022	\N	\N	\N	\N
1550	1317	SSC	75	2020	\N	\N	\N	\N
1551	1317	HSSC	80	2022	\N	\N	\N	\N
2887	1370	SSC	95.3	2021	\N	\N	\N	\N
2888	1370	HSSC	93.4	2023	\N	\N	\N	\N
2635	666	SSC	68	2020	\N	\N	\N	\N
2636	666	HSSC	63	2023	\N	\N	\N	\N
1585	354	SSC	86	2020	\N	\N	\N	\N
1586	354	HSSC	67	2023	\N	\N	\N	\N
1589	1392	SSC	92	2019	\N	\N	\N	\N
1590	1392	HSSC	87.5	2021	\N	\N	\N	\N
1931	1440	SSC	83	2020	\N	\N	\N	\N
1932	1440	HSSC	69	2022	\N	\N	\N	\N
1611	1421	SSC	88.84	2020	\N	\N	\N	\N
1612	1421	HSSC	75.33	2022	\N	\N	\N	\N
2895	1330	SSC	77	2021	\N	\N	\N	\N
2896	1330	HSSC	77	2023	\N	\N	\N	\N
2007	1566	SSC	74	2020	\N	\N	\N	\N
2008	1566	HSSC	63	2022	\N	\N	\N	\N
1851	1545	SSC	91	2020	\N	\N	\N	\N
1852	1545	HSSC	80	2022	\N	\N	\N	\N
1861	422	SSC	90.6	2021	\N	\N	\N	\N
1862	422	HSSC	64.4	2023	\N	\N	\N	\N
2017	1540	SSC	91	2020	\N	\N	\N	\N
2018	1540	HSSC	83.17	2022	\N	\N	\N	\N
2417	1551	SSC	85.8	2020	\N	\N	\N	\N
2418	1551	HSSC	78.17	2022	\N	\N	\N	\N
2164	1434	SSC	93.2	2020	\N	\N	\N	\N
2165	1434	HSSC	66.5	2022	\N	\N	\N	\N
2703	406	SSC	88.4	2021	\N	\N	\N	\N
2423	1517	SSC	93.4	2020	\N	\N	\N	\N
2424	1517	HSSC	80	2022	\N	\N	\N	\N
2704	406	HSSC	84.5	2023	\N	\N	\N	\N
2473	1433	SSC	82.4	2020	\N	\N	\N	\N
2194	1338	SSC	96.6	2021	\N	\N	\N	\N
2195	1338	HSSC	77.33	2023	\N	\N	\N	\N
2474	1433	HSSC	68.4	2022	\N	\N	\N	\N
2713	1522	SSC	91.2	2020	\N	\N	\N	\N
2079	1579	SSC	73.4	2019	\N	\N	\N	\N
2080	1579	HSSC	95.83	2021	\N	\N	\N	\N
2208	1559	SSC	89.8	2020	\N	\N	\N	\N
2209	1559	HSSC	83.4	2022	\N	\N	\N	\N
2714	1522	HSSC	84.67	2022	\N	\N	\N	\N
2731	1342	SSC	82.4	2020	\N	\N	\N	\N
2732	1342	HSSC	79	2022	\N	\N	\N	\N
2234	1538	SSC	92.6	2020	\N	\N	\N	\N
2235	1538	HSSC	87.5	2022	\N	\N	\N	\N
2238	1528	SSC	71	2020	\N	\N	\N	\N
2239	1528	HSSC	60	2022	\N	\N	\N	\N
2244	1534	SSC	86	2020	\N	\N	\N	\N
2245	1534	HSSC	86	2022	\N	\N	\N	\N
2268	1408	SSC	85.2	2020	\N	\N	\N	\N
2269	1408	HSSC	77.25	2022	\N	\N	\N	\N
2545	982	SSC	55	2020	\N	\N	\N	\N
2546	982	HSSC	77.17	2022	\N	\N	\N	\N
2817	351	SSC	88	2022	\N	\N	\N	\N
2818	351	HSSC	67.33	2024	\N	\N	\N	\N
2841	1369	SSC	62.8	2021	\N	\N	\N	\N
2842	1369	HSSC	60.8	2023	\N	\N	\N	\N
2845	316	SSC	77	2021	\N	\N	\N	\N
2846	316	HSSC	63	2023	\N	\N	\N	\N
1525	433	HSSC	83	2023	\N	\N	\N	\N
2357	1570	SSC	81.2	2020	\N	\N	\N	\N
2358	1570	HSSC	78.17	2022	\N	\N	\N	\N
1923	1419	SSC	83	2020	\N	\N	\N	\N
1924	1419	HSSC	72	2022	\N	\N	\N	\N
2589	403	SSC	88.2	2020	\N	\N	\N	\N
2590	403	HSSC	87.33	2022	\N	\N	\N	\N
1597	1432	SSC	91.2	2020	\N	\N	\N	\N
1598	1432	HSSC	92.7	2022	\N	\N	\N	\N
1935	1354	SSC	95	2021	\N	\N	\N	\N
1936	1354	HSSC	84.17	2023	\N	\N	\N	\N
2919	1358	SSC	82	2021	\N	\N	\N	\N
1955	1397	SSC	90	2020	\N	\N	\N	\N
1956	1397	HSSC	74	2022	\N	\N	\N	\N
1625	1350	SSC	70.6	2021	\N	\N	\N	\N
1626	1350	HSSC	66.5	2023	\N	\N	\N	\N
1965	1578	SSC	76.4	2019	\N	\N	\N	\N
1966	1578	HSSC	83.8	2022	\N	\N	\N	\N
2920	1358	HSSC	80	2023	\N	\N	\N	\N
2009	1399	SSC	78	2020	\N	\N	\N	\N
2010	1399	HSSC	85	2022	\N	\N	\N	\N
2019	1527	SSC	76	2020	\N	\N	\N	\N
2020	1527	HSSC	65	2022	\N	\N	\N	\N
1819	1359	SSC	92	2021	\N	\N	\N	\N
1820	1359	HSSC	87	2023	\N	\N	\N	\N
2141	1564	SSC	76.8	2020	\N	\N	\N	\N
2142	1564	HSSC	64.83	2022	\N	\N	\N	\N
2145	1565	SSC	90	2020	\N	\N	\N	\N
2146	1565	HSSC	75	2022	\N	\N	\N	\N
2051	1555	SSC	89	2020	\N	\N	\N	\N
2052	1555	HSSC	91	2022	\N	\N	\N	\N
2059	1542	SSC	94.2	2020	\N	\N	\N	\N
2060	1542	HSSC	85	2022	\N	\N	\N	\N
2067	1417	SSC	85.8	2020	\N	\N	\N	\N
2068	1417	HSSC	85.6	2022	\N	\N	\N	\N
2155	1541	SSC	97.8	2020	\N	\N	\N	\N
2156	1541	HSSC	92.67	2022	\N	\N	\N	\N
2166	1393	SSC	93.6	2020	\N	\N	\N	\N
2167	1393	HSSC	88	2022	\N	\N	\N	\N
2170	1568	SSC	94	2020	\N	\N	\N	\N
2171	1568	HSSC	88	2022	\N	\N	\N	\N
2180	1536	SSC	91.6	2020	\N	\N	\N	\N
2181	1536	HSSC	63.4	2022	\N	\N	\N	\N
2425	427	SSC	92.2	2021	\N	\N	\N	\N
2426	427	HSSC	67.5	2023	\N	\N	\N	\N
2646	317	HSSC	80	2023	\N	\N	\N	\N
2212	1520	SSC	76.6	2020	\N	\N	\N	\N
2213	1520	HSSC	74.17	2022	\N	\N	\N	\N
2675	426	SSC	87	2021	\N	\N	\N	\N
2676	426	HSSC	67	2023	\N	\N	\N	\N
2230	1521	SSC	92	2020	\N	\N	\N	\N
2231	1521	HSSC	81.17	2022	\N	\N	\N	\N
2681	685	SSC	84.45	2022	\N	\N	\N	\N
2682	685	HSSC	65.55	2024	\N	\N	\N	\N
2691	444	SSC	54	2020	\N	\N	\N	\N
2254	691	SSC	86	2022	\N	\N	\N	\N
2255	691	HSSC	61.83	2024	\N	\N	\N	\N
2692	444	HSSC	74	2022	\N	\N	\N	\N
2723	1324	SSC	90.02	2021	\N	\N	\N	\N
2724	1324	HSSC	63.5	2023	\N	\N	\N	\N
2745	1326	SSC	94.6	2020	\N	\N	\N	\N
2746	1326	HSSC	66.4	2022	\N	\N	\N	\N
2759	1319	SSC	95	2021	\N	\N	\N	\N
2760	1319	HSSC	70.33	2023	\N	\N	\N	\N
2831	682	SSC	73.4	2021	\N	\N	\N	\N
2832	682	HSSC	49.67	2023	\N	\N	\N	\N
1406	393	SSC	75	2021	\N	\N	\N	\N
1407	393	HSSC	60	2023	\N	\N	\N	\N
1735	692	SSC	96.8	2021	\N	\N	\N	\N
1736	692	HSSC	63.67	2023	\N	\N	\N	\N
1440	418	SSC	86.6	2021	\N	\N	\N	\N
1441	418	HSSC	60.1	2023	\N	\N	\N	\N
1565	1380	SSC	92.6	2021	\N	\N	\N	\N
1566	1380	HSSC	85.05	2024	\N	\N	\N	\N
1959	443	SSC	90	2021	\N	\N	\N	\N
1960	443	HSSC	83.66	2024	\N	\N	\N	\N
2625	1404	SSC	89	2020	\N	\N	\N	\N
2626	1404	HSSC	89.83	2022	\N	\N	\N	\N
1763	655	SSC	81	2022	\N	\N	\N	\N
1764	655	HSSC	53.5	2024	\N	\N	\N	\N
1631	399	SSC	75	2021	\N	\N	\N	\N
1632	399	HSSC	71	2023	\N	\N	\N	\N
2023	1439	SSC	96.5	2020	\N	\N	\N	\N
2024	1439	HSSC	84.5	2022	\N	\N	\N	\N
1647	1327	SSC	81	2017	\N	\N	\N	\N
1648	1327	HSSC	77.2	2019	\N	\N	\N	\N
1470	1363	SSC	89.6	2021	\N	\N	\N	\N
1471	1363	HSSC	78.67	2023	\N	\N	\N	\N
1472	1442	SSC	89.8	2020	\N	\N	\N	\N
1473	1442	HSSC	81.95	2023	\N	\N	\N	\N
1653	1349	SSC	95.6	2021	\N	\N	\N	\N
1654	1349	HSSC	82.17	2023	\N	\N	\N	\N
1659	437	SSC	87.8	2021	\N	\N	\N	\N
1660	437	HSSC	84	2024	\N	\N	\N	\N
2629	1340	SSC	85	2021	\N	\N	\N	\N
1480	420	SSC	92	2021	\N	\N	\N	\N
1481	420	HSSC	73.4	2023	\N	\N	\N	\N
2385	1516	SSC	95	2020	\N	\N	\N	\N
2386	1516	HSSC	78.83	2022	\N	\N	\N	\N
2630	1340	HSSC	74	2023	\N	\N	\N	\N
2909	339	SSC	90.4	2022	\N	\N	\N	\N
2910	339	HSSC	69.17	2024	\N	\N	\N	\N
2921	402	SSC	97.8	2021	\N	\N	\N	\N
2176	1423	SSC	91.6	2020	\N	\N	\N	\N
2177	1423	HSSC	73.14	2022	\N	\N	\N	\N
1793	311	SSC	86.5	2022	\N	\N	\N	\N
1794	311	HSSC	79.83	2024	\N	\N	\N	\N
2922	402	HSSC	71.5	2023	\N	\N	\N	\N
2647	318	SSC	92	2022	\N	\N	\N	\N
2415	1577	SSC	80.8	2020	\N	\N	\N	\N
2416	1577	HSSC	71.6	2023	\N	\N	\N	\N
2190	371	SSC	82	2022	\N	\N	\N	\N
2191	371	HSSC	71	2024	\N	\N	\N	\N
1821	1554	SSC	93.8	2020	\N	\N	\N	\N
1822	1554	HSSC	82.8	2022	\N	\N	\N	\N
2648	318	HSSC	82	2024	\N	\N	\N	\N
2200	1526	SSC	91.4	2020	\N	\N	\N	\N
2201	1526	HSSC	75.33	2022	\N	\N	\N	\N
2284	1409	SSC	85	2020	\N	\N	\N	\N
2285	1409	HSSC	79.5	2022	\N	\N	\N	\N
2677	382	SSC	86.6	2021	\N	\N	\N	\N
2301	1567	SSC	81	2020	\N	\N	\N	\N
2302	1567	HSSC	77.5	2022	\N	\N	\N	\N
2075	1410	SSC	94.8	2020	\N	\N	\N	\N
2076	1410	HSSC	81.8	2022	\N	\N	\N	\N
2311	1529	SSC	86.2	2020	\N	\N	\N	\N
2312	1529	HSSC	80.17	2022	\N	\N	\N	\N
2678	382	HSSC	66	2023	\N	\N	\N	\N
2322	1576	SSC	88	2020	\N	\N	\N	\N
2323	1576	HSSC	83.25	2023	\N	\N	\N	\N
2687	1531	SSC	70	2019	\N	\N	\N	\N
2688	1531	HSSC	81.2	2021	\N	\N	\N	\N
2699	983	SSC	69	2020	\N	\N	\N	\N
2700	983	HSSC	80	2022	\N	\N	\N	\N
2711	397	SSC	88	2020	\N	\N	\N	\N
2712	397	HSSC	72	2022	\N	\N	\N	\N
2727	701	SSC	73	2021	\N	\N	\N	\N
2728	701	HSSC	57	2023	\N	\N	\N	\N
2739	1374	SSC	90	2021	\N	\N	\N	\N
2740	1374	HSSC	70	2023	\N	\N	\N	\N
2761	347	SSC	90	2022	\N	\N	\N	\N
2762	347	HSSC	81.83	2024	\N	\N	\N	\N
2805	1557	SSC	83	2020	\N	\N	\N	\N
2806	1557	HSSC	77	2022	\N	\N	\N	\N
2833	373	SSC	75	2021	\N	\N	\N	\N
2834	373	HSSC	60	2023	\N	\N	\N	\N
2978	1343	SSC	88	2021	\N	\N	\N	\N
2979	1343	HSSC	74	2023	\N	\N	\N	\N
2982	1685	SSC	90	2021	\N	\N	\N	\N
2983	1685	HSSC	99	2023	\N	\N	\N	\N
2988	414	SSC	93.6	2021	\N	\N	\N	\N
2989	414	HSSC	81.6	2023	\N	\N	\N	\N
2990	414	DIPLOMA	99	2023	\N	\N	\N	\N
3000	1052	SSC	86.67	2021	\N	\N	\N	\N
3001	1052	HSSC	58	2023	\N	\N	\N	\N
3002	1052	DIPLOMA	95	2023	\N	\N	\N	\N
3102	342	ENTRANCE_EXAM[[KYS_META]]{"exam_type":"MHT-CET"}	89.29	2024	\N	\N	\N	\N
3100	342	SSC[[KYS_META]]{"board":"CBSE"}	96.2	2021	\N	\N	\N	\N
3101	342	HSSC[[KYS_META]]{"board":"State Board"}	73.15	2024	\N	\N	\N	\N
\.


--
-- Data for Name: post_admission_academic_record; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post_admission_academic_record (id, student_id, semester, sgpa, backlog_subjects, season, year_of_passing, college_rank, academic_awards, backlog_count) FROM stdin;
5614	402	1	9.4	N/A	\N	\N	\N	\N	\N
5615	402	2	9.7	N/A	\N	\N	\N	\N	\N
226	328	1	6.8	N/A	\N	\N	\N	\N	\N
3143	1545	1	8.5	N/A	\N	\N	\N	\N	\N
3144	1545	2	9.1	N/A	\N	\N	\N	\N	\N
5616	402	3	8.3	N/A	\N	\N	\N	\N	\N
5617	402	4	8.09	N/A	\N	\N	\N	\N	\N
227	328	2	6.8	N/A	\N	\N	\N	\N	\N
228	367	1	7.9	N/A	\N	\N	\N	\N	\N
229	367	2	8.5	N/A	\N	\N	\N	\N	\N
135	659	1	6.36	N/A	\N	\N	\N	\N	\N
136	659	2	6.59	N/A	\N	\N	\N	\N	\N
3345	1354	1	9.36	N/A	\N	\N	\N	\N	\N
3346	1354	2	9.77	N/A	\N	\N	\N	\N	\N
3347	1354	3	9.1	N/A	\N	\N	\N	\N	\N
3348	1354	4	9	N/A	\N	\N	\N	\N	\N
5173	426	1	8.82	N/A	\N	\N	\N	\N	\N
5174	426	2	9.59	N/A	\N	\N	\N	\N	\N
139	366	1	6.64	N/A	\N	\N	\N	\N	\N
140	366	2	7.5	N/A	\N	\N	\N	\N	\N
5175	426	3	8.24	N/A	\N	\N	\N	\N	\N
4876	982	1	5.93	Epms, Ep1 , LBC , Am1	\N	\N	\N	\N	\N
4877	982	2	6.41	Ec&Es , Am2 , Ep2	\N	\N	\N	\N	\N
5176	426	4	8.48	N/A	\N	\N	\N	\N	\N
4878	982	3	5.95	Cao , Am3 , Ds, Dcfm ,	\N	\N	\N	\N	\N
241	315	2	6	Phy , maths	\N	\N	\N	\N	\N
5193	417	1	7.27	N/A	\N	\N	\N	\N	\N
5194	417	2	8.5	N/A	\N	\N	\N	\N	\N
244	372	1	8.32	N/A	\N	\N	\N	\N	\N
245	372	2	8.27	N/A	\N	\N	\N	\N	\N
5195	417	3	7.25	N/A	\N	\N	\N	\N	\N
155	704	1	7.7	N/A	\N	\N	\N	\N	\N
156	704	2	7.07	N/A	\N	\N	\N	\N	\N
3543	1527	1	5.64	N/A	\N	\N	\N	\N	\N
1858	379	1	9.41	N/A	\N	\N	\N	\N	\N
2069	1416	1	7.23	N/A	\N	\N	\N	\N	\N
337	401	1	9.5	N/A	\N	\N	\N	\N	\N
338	401	2	9.45	N/A	\N	\N	\N	\N	\N
339	401	3	9.1	N/A	\N	\N	\N	\N	\N
340	401	4	8.61	N/A	\N	\N	\N	\N	\N
2070	1416	2	7.45	N/A	\N	\N	\N	\N	\N
2071	1416	3	7.19	N/A	\N	\N	\N	\N	\N
343	319	1	6.95	N/A	\N	\N	\N	\N	\N
344	319	2	6.82	N/A	\N	\N	\N	\N	\N
471	344	1	5.7	N/A	\N	\N	\N	\N	\N
2072	1416	4	6.25	N/A	\N	\N	\N	\N	\N
173	647	1	8.87	N/A	\N	\N	\N	\N	\N
174	647	2	8.82	N/A	\N	\N	\N	\N	\N
175	364	1	6.91	N/A	\N	\N	\N	\N	\N
176	364	2	7.41	N/A	\N	\N	\N	\N	\N
583	709	1	7.9	N/A	\N	\N	\N	\N	\N
271	326	1	6.91	N/A	\N	\N	\N	\N	\N
272	326	2	7.27	N/A	\N	\N	\N	\N	\N
5297	1335	1	6.95	N/A	\N	\N	\N	\N	\N
584	709	2	9.6	N/A	\N	\N	\N	\N	\N
236	352	1	6.91	N/A	\N	\N	\N	\N	\N
183	667	1	7.55	N/A	\N	\N	\N	\N	\N
184	667	2	7.66	N/A	\N	\N	\N	\N	\N
185	653	1	8.41	N/A	\N	\N	\N	\N	\N
186	653	2	8.18	N/A	\N	\N	\N	\N	\N
5298	1335	2	7.05	N/A	\N	\N	\N	\N	\N
143	688	1	8.09	N/A	\N	\N	\N	\N	\N
423	712	1	8.41	N/A	\N	\N	\N	\N	\N
424	712	2	8.77	N/A	\N	\N	\N	\N	\N
391	702	1	7.32	N/A	\N	\N	\N	\N	\N
5299	1335	3	6.98	N/A	\N	\N	\N	\N	\N
392	702	2	8.05	N/A	\N	\N	\N	\N	\N
4422	1516	1	8.36	N/A	\N	\N	\N	\N	\N
3389	443	1	7.57	N/A	\N	\N	\N	\N	\N
281	353	1	7.73	N/A	\N	\N	\N	\N	\N
4423	1516	2	9.18	N/A	\N	\N	\N	\N	\N
282	353	2	8.59	N/A	\N	\N	\N	\N	\N
3390	443	2	8.24	N/A	\N	\N	\N	\N	\N
3391	443	3	7.57	N/A	\N	\N	\N	\N	\N
3392	443	4	8.24	N/A	\N	\N	\N	\N	\N
355	381	1	8.6	N/A	\N	\N	\N	\N	\N
356	381	2	8.9	N/A	\N	\N	\N	\N	\N
5322	658	1	8.4	N/A	\N	\N	\N	\N	\N
1509	1378	1	9.1	N/A	\N	\N	\N	\N	\N
357	381	3	8.1	N/A	\N	\N	\N	\N	\N
358	381	4	8.6	N/A	\N	\N	\N	\N	\N
1510	1378	2	9.86	N/A	\N	\N	\N	\N	\N
1511	1378	3	8.05	N/A	\N	\N	\N	\N	\N
1512	1378	4	8.3	N/A	\N	\N	\N	\N	\N
5323	658	2	7.8	N/A	\N	\N	\N	\N	\N
5340	348	1	6	N/A	\N	\N	\N	\N	\N
3515	1399	1	6.5	N/A	\N	\N	\N	\N	\N
373	698	1	8.36	N/A	\N	\N	\N	\N	\N
374	698	2	8.23	N/A	\N	\N	\N	\N	\N
3516	1399	2	6.5	N/A	\N	\N	\N	\N	\N
3517	1399	3	6.5	N/A	\N	\N	\N	\N	\N
3518	1399	4	6.5	N/A	\N	\N	\N	\N	\N
3519	1399	5	6.5	Toc , AI	\N	\N	\N	\N	\N
3520	1399	6	6.5	Daa , DWM , OE-II , CAPSTONE COURSE , ml	\N	\N	\N	\N	\N
313	436	1	8.14	N/A	\N	\N	\N	\N	\N
314	436	2	8.14	N/A	\N	\N	\N	\N	\N
315	436	3	8.14	N/A	\N	\N	\N	\N	\N
316	436	4	8.26	N/A	\N	\N	\N	\N	\N
385	325	1	8	N/A	\N	\N	\N	\N	\N
386	325	2	8.82	N/A	\N	\N	\N	\N	\N
395	707	1	8.55	N/A	\N	\N	\N	\N	\N
396	707	2	9.77	N/A	\N	\N	\N	\N	\N
400	369	2	5.3	Python, Maths	\N	\N	\N	\N	\N
409	705	1	7.27	N/A	\N	\N	\N	\N	\N
410	705	2	8.91	N/A	\N	\N	\N	\N	\N
413	356	1	7.91	N/A	\N	\N	\N	\N	\N
414	356	2	8.32	N/A	\N	\N	\N	\N	\N
419	386	1	8.82	N/A	\N	\N	\N	\N	\N
420	386	2	9.64	N/A	\N	\N	\N	\N	\N
421	386	3	8.19	N/A	\N	\N	\N	\N	\N
422	386	4	7.61	N/A	\N	\N	\N	\N	\N
447	324	1	7.29	N/A	\N	\N	\N	\N	\N
448	324	2	8.41	N/A	\N	\N	\N	\N	\N
445	668	1	7.68	N/A	\N	\N	\N	\N	\N
446	668	2	7.95	N/A	\N	\N	\N	\N	\N
972	368	1	8.13	N/A	\N	\N	\N	\N	\N
973	368	2	8.41	N/A	\N	\N	\N	\N	\N
976	365	1	7.9	N/A	\N	\N	\N	\N	\N
977	365	2	8.02	N/A	\N	\N	\N	\N	\N
465	664	1	6.5	N/A	\N	\N	\N	\N	\N
466	664	2	6.5	N/A	\N	\N	\N	\N	\N
1000	651	1	6.23	N/A	\N	\N	\N	\N	\N
1001	651	2	6.36	N/A	\N	\N	\N	\N	\N
472	344	2	5.91	N/A	\N	\N	\N	\N	\N
1619	1384	1	9.04	N/A	\N	\N	\N	\N	\N
1620	1384	2	9.95	N/A	\N	\N	\N	\N	\N
710	1321	1	8.36	N/A	\N	\N	\N	\N	\N
711	1321	2	9.05	N/A	\N	\N	\N	\N	\N
4394	1515	1	7.14	N/A	\N	\N	\N	\N	\N
4395	1515	2	7.64	N/A	\N	\N	\N	\N	\N
4396	1515	3	6.87	N/A	\N	\N	\N	\N	\N
4397	1515	4	6.8	N/A	\N	\N	\N	\N	\N
595	415	1	8.64	N/A	\N	\N	\N	\N	\N
596	415	2	9.27	N/A	\N	\N	\N	\N	\N
597	415	3	7.95	N/A	\N	\N	\N	\N	\N
598	415	4	8.65	N/A	\N	\N	\N	\N	\N
599	384	1	8.73	N/A	\N	\N	\N	\N	\N
600	384	2	9.23	N/A	\N	\N	\N	\N	\N
712	1321	3	8.38	N/A	\N	\N	\N	\N	\N
713	1321	4	8.57	N/A	\N	\N	\N	\N	\N
3060	333	1	7.86	N/A	\N	\N	\N	\N	\N
3061	333	2	8.05	N/A	\N	\N	\N	\N	\N
497	322	1	5.91	N/A	\N	\N	\N	\N	\N
498	322	2	6.73	N/A	\N	\N	\N	\N	\N
501	654	1	7.05	N/A	\N	\N	\N	\N	\N
502	654	2	7.56	N/A	\N	\N	\N	\N	\N
4398	1515	5	8.27	N/A	\N	\N	\N	\N	\N
4399	1515	6	8.14	N/A	\N	\N	\N	\N	\N
611	650	1	8.32	N/A	\N	\N	\N	\N	\N
612	650	2	9.41	N/A	\N	\N	\N	\N	\N
2073	1416	5	7.36	N/A	\N	\N	\N	\N	\N
2074	1416	6	7.64	N/A	\N	\N	\N	\N	\N
3145	1545	3	8.4	N/A	\N	\N	\N	\N	\N
3146	1545	4	8.3	N/A	\N	\N	\N	\N	\N
4879	982	4	5.65	Dcom , OOP,  DBMS,	\N	\N	\N	\N	\N
5233	1522	1	8.64	N/A	\N	\N	\N	\N	\N
615	648	1	6.7	N/A	\N	\N	\N	\N	\N
616	648	2	7.2	N/A	\N	\N	\N	\N	\N
842	1318	1	8.73	N/A	\N	\N	\N	\N	\N
843	1318	2	8.95	N/A	\N	\N	\N	\N	\N
844	1318	3	8.82	N/A	\N	\N	\N	\N	\N
845	1318	4	9.01	N/A	\N	\N	\N	\N	\N
1060	703	1	7.6	N/A	\N	\N	\N	\N	\N
1061	703	2	7.8	N/A	\N	\N	\N	\N	\N
5234	1522	2	9.73	N/A	\N	\N	\N	\N	\N
5235	1522	3	8.78	N/A	\N	\N	\N	\N	\N
1497	432	1	7.9	N/A	\N	\N	\N	\N	\N
5236	1522	4	9.15	N/A	\N	\N	\N	\N	\N
850	405	1	9.77	N/A	\N	\N	\N	\N	\N
851	405	2	9.86	N/A	\N	\N	\N	\N	\N
531	679	1	6	Chemistry	\N	\N	\N	\N	\N
852	405	3	8.64	N/A	\N	\N	\N	\N	\N
853	405	4	8.72	N/A	\N	\N	\N	\N	\N
535	680	1	7.5	N/A	\N	\N	\N	\N	\N
536	680	2	7.83	N/A	\N	\N	\N	\N	\N
4432	1533	1	5.64	N/A	\N	\N	\N	\N	\N
589	671	1	9.5	N/A	\N	\N	\N	\N	\N
590	671	2	10	N/A	\N	\N	\N	\N	\N
1645	1357	1	8.94	N/A	\N	\N	\N	\N	\N
4433	1533	2	6.45	N/A	\N	\N	\N	\N	\N
4434	1533	3	6.3	N/A	\N	\N	\N	\N	\N
4435	1533	4	6.15	N/A	\N	\N	\N	\N	\N
738	1372	1	7.5	N/A	\N	\N	\N	\N	\N
739	1372	2	9	N/A	\N	\N	\N	\N	\N
740	1372	3	7.05	N/A	\N	\N	\N	\N	\N
741	1372	4	7.7	N/A	\N	\N	\N	\N	\N
549	686	1	6.2	N/A	\N	\N	\N	\N	\N
550	686	2	5.34	S&P	\N	\N	\N	\N	\N
1646	1357	2	9.64	N/A	\N	\N	\N	\N	\N
491	687	1	7.8	N/A	\N	\N	\N	\N	\N
492	687	2	9.4	N/A	\N	\N	\N	\N	\N
2297	1390	1	8.55	N/A	\N	\N	\N	\N	\N
2298	1390	2	9	N/A	\N	\N	\N	\N	\N
519	693	1	7.18	N/A	\N	\N	\N	\N	\N
748	370	1	8.86	N/A	\N	\N	\N	\N	\N
749	370	2	8.01	N/A	\N	\N	\N	\N	\N
559	694	1	7.82	N/A	\N	\N	\N	\N	\N
560	694	2	9.09	N/A	\N	\N	\N	\N	\N
654	1325	1	9.36	N/A	\N	\N	\N	\N	\N
655	1325	2	9.36	N/A	\N	\N	\N	\N	\N
520	693	2	6.77	N/A	\N	\N	\N	\N	\N
565	665	1	6.68	N/A	\N	\N	\N	\N	\N
566	665	2	6.4	N/A	\N	\N	\N	\N	\N
656	1325	3	9.18	N/A	\N	\N	\N	\N	\N
657	1325	4	9.03	N/A	\N	\N	\N	\N	\N
569	706	1	8.09	N/A	\N	\N	\N	\N	\N
570	706	2	8.77	N/A	\N	\N	\N	\N	\N
752	690	1	7.77	N/A	\N	\N	\N	\N	\N
753	690	2	7.75	N/A	\N	\N	\N	\N	\N
4124	1575	3	6.7	N/A	\N	\N	\N	\N	\N
4125	1575	4	6.9	N/A	\N	\N	\N	\N	\N
4126	1575	5	6.39	N/A	\N	\N	\N	\N	\N
4127	1575	6	7.4	N/A	\N	\N	\N	\N	\N
577	677	1	7.79	N/A	\N	\N	\N	\N	\N
578	677	2	8.18	N/A	\N	\N	\N	\N	\N
766	1332	1	8	N/A	\N	\N	\N	\N	\N
767	1332	2	8.9	N/A	\N	\N	\N	\N	\N
768	1332	3	7.42	N/A	\N	\N	\N	\N	\N
769	1332	4	7.62	N/A	\N	\N	\N	\N	\N
776	313	1	7	N/A	\N	\N	\N	\N	\N
777	313	2	7	N/A	\N	\N	\N	\N	\N
886	380	1	9.09	N/A	\N	\N	\N	\N	\N
887	380	2	10	N/A	\N	\N	\N	\N	\N
888	380	3	8.9	N/A	\N	\N	\N	\N	\N
889	380	4	9.17	N/A	\N	\N	\N	\N	\N
786	336	1	9.41	N/A	\N	\N	\N	\N	\N
787	336	2	9.59	N/A	\N	\N	\N	\N	\N
892	700	1	5.86	N/A	\N	\N	\N	\N	\N
893	700	2	6.8	N/A	\N	\N	\N	\N	\N
792	1360	1	8.9	N/A	\N	\N	\N	\N	\N
793	1360	2	9.45	N/A	\N	\N	\N	\N	\N
794	1360	3	8.23	N/A	\N	\N	\N	\N	\N
795	1360	4	8.04	N/A	\N	\N	\N	\N	\N
900	1394	1	7.59	N/A	\N	\N	\N	\N	\N
901	1394	2	7.59	N/A	\N	\N	\N	\N	\N
902	1394	3	6.13	N/A	\N	\N	\N	\N	\N
903	1394	4	5.25	N/A	\N	\N	\N	\N	\N
904	1394	5	7.32	N/A	\N	\N	\N	\N	\N
905	1394	6	3.64	Acn	\N	\N	\N	\N	\N
814	378	1	9.09	N/A	\N	\N	\N	\N	\N
815	378	2	9.32	N/A	\N	\N	\N	\N	\N
816	378	3	8.14	N/A	\N	\N	\N	\N	\N
817	378	4	8.26	N/A	\N	\N	\N	\N	\N
5237	1522	5	8.64	N/A	\N	\N	\N	\N	\N
5238	1522	6	9.27	N/A	\N	\N	\N	\N	\N
1471	312	1	7.95	N/A	\N	\N	\N	\N	\N
1472	312	2	8.5	N/A	\N	\N	\N	\N	\N
2365	418	1	8.18	N/A	\N	\N	\N	\N	\N
1859	379	2	9.5	N/A	\N	\N	\N	\N	\N
5267	1342	1	8.91	N/A	\N	\N	\N	\N	\N
1860	379	3	9.14	N/A	\N	\N	\N	\N	\N
5268	1342	2	9.41	N/A	\N	\N	\N	\N	\N
5269	1342	3	7.57	N/A	\N	\N	\N	\N	\N
5270	1342	4	7.87	N/A	\N	\N	\N	\N	\N
4008	1521	1	8.77	N/A	\N	\N	\N	\N	\N
4009	1521	2	9.14	N/A	\N	\N	\N	\N	\N
4010	1521	3	7.96	N/A	\N	\N	\N	\N	\N
1489	1371	1	9.05	N/A	\N	\N	\N	\N	\N
1490	1371	2	8.91	N/A	\N	\N	\N	\N	\N
1491	1371	3	8	N/A	\N	\N	\N	\N	\N
1492	1371	4	7.9	N/A	\N	\N	\N	\N	\N
1498	432	2	8.9	N/A	\N	\N	\N	\N	\N
1499	432	3	7.5	N/A	\N	\N	\N	\N	\N
1500	432	4	8.2	N/A	\N	\N	\N	\N	\N
1219	428	1	9.32	N/A	\N	\N	\N	\N	\N
1220	428	2	9.77	N/A	\N	\N	\N	\N	\N
1221	428	3	8.05	N/A	\N	\N	\N	\N	\N
1222	428	4	8.61	N/A	\N	\N	\N	\N	\N
1861	379	4	9.26	N/A	\N	\N	\N	\N	\N
4011	1521	4	8.65	N/A	\N	\N	\N	\N	\N
4012	1521	5	8.09	N/A	\N	\N	\N	\N	\N
4013	1521	6	8.64	N/A	\N	\N	\N	\N	\N
2090	345	2	6.18	1	\N	\N	\N	\N	\N
3604	1555	1	7.86	N/A	\N	\N	\N	\N	\N
2366	418	2	8.7	N/A	\N	\N	\N	\N	\N
2367	418	3	8.1	N/A	\N	\N	\N	\N	\N
2368	418	4	8.28	N/A	\N	\N	\N	\N	\N
2299	1390	3	9.09	N/A	\N	\N	\N	\N	\N
1657	1376	1	9.14	N/A	\N	\N	\N	\N	\N
1658	1376	2	9.64	N/A	\N	\N	\N	\N	\N
1659	1376	3	7	N/A	\N	\N	\N	\N	\N
1660	1376	4	7.91	N/A	\N	\N	\N	\N	\N
2300	1390	4	8.95	N/A	\N	\N	\N	\N	\N
2301	1390	5	8.77	N/A	\N	\N	\N	\N	\N
1874	1366	1	8.91	N/A	\N	\N	\N	\N	\N
1875	1366	2	9.5	N/A	\N	\N	\N	\N	\N
1876	1366	3	7.9	N/A	\N	\N	\N	\N	\N
3605	1555	2	8.18	N/A	\N	\N	\N	\N	\N
3606	1555	3	7.13	N/A	\N	\N	\N	\N	\N
3607	1555	4	7.05	N/A	\N	\N	\N	\N	\N
3608	1555	5	7.91	N/A	\N	\N	\N	\N	\N
3609	1555	6	8.23	N/A	\N	\N	\N	\N	\N
3737	1436	1	6.95	N/A	\N	\N	\N	\N	\N
1877	1366	4	8.1	N/A	\N	\N	\N	\N	\N
1882	419	1	9.36	N/A	\N	\N	\N	\N	\N
1883	419	2	9.68	N/A	\N	\N	\N	\N	\N
1577	1353	1	8	N/A	\N	\N	\N	\N	\N
1578	1353	2	9.14	N/A	\N	\N	\N	\N	\N
1579	1353	3	7.71	N/A	\N	\N	\N	\N	\N
1580	1353	4	8.26	N/A	\N	\N	\N	\N	\N
1675	337	1	6.64	N/A	\N	\N	\N	\N	\N
1676	337	2	6.84	N/A	\N	\N	\N	\N	\N
1884	419	3	9.31	N/A	\N	\N	\N	\N	\N
1885	419	4	9.17	N/A	\N	\N	\N	\N	\N
2302	1390	6	8.82	N/A	\N	\N	\N	\N	\N
3738	1436	2	7.05	N/A	\N	\N	\N	\N	\N
3739	1436	3	6.48	N/A	\N	\N	\N	\N	\N
3740	1436	4	6.1	N/A	\N	\N	\N	\N	\N
3741	1436	5	5.64	N/A	\N	\N	\N	\N	\N
3742	1436	6	6.18	N/A	\N	\N	\N	\N	\N
1605	434	1	7.2	N/A	\N	\N	\N	\N	\N
1606	434	2	8.3	N/A	\N	\N	\N	\N	\N
1607	434	3	7.1	N/A	\N	\N	\N	\N	\N
1608	434	4	7.4	N/A	\N	\N	\N	\N	\N
1722	1329	1	8.64	N/A	\N	\N	\N	\N	\N
1723	1329	2	9.23	N/A	\N	\N	\N	\N	\N
1724	1329	3	8	N/A	\N	\N	\N	\N	\N
1725	1329	4	7.87	N/A	\N	\N	\N	\N	\N
1726	1346	1	8.09	N/A	\N	\N	\N	\N	\N
1727	1346	2	8.64	N/A	\N	\N	\N	\N	\N
1728	1346	3	7.81	N/A	\N	\N	\N	\N	\N
1729	1346	4	7.61	N/A	\N	\N	\N	\N	\N
1906	425	1	9.2	N/A	\N	\N	\N	\N	\N
1907	425	2	9.9	N/A	\N	\N	\N	\N	\N
1908	425	3	8.5	N/A	\N	\N	\N	\N	\N
1909	425	4	8.3	N/A	\N	\N	\N	\N	\N
2281	393	1	7	N/A	\N	\N	\N	\N	\N
1782	413	1	7.64	N/A	\N	\N	\N	\N	\N
1783	413	2	8.68	N/A	\N	\N	\N	\N	\N
1784	413	3	7.3	N/A	\N	\N	\N	\N	\N
1785	413	4	7.9	N/A	\N	\N	\N	\N	\N
1798	391	1	9.41	N/A	\N	\N	\N	\N	\N
1799	391	2	9.73	N/A	\N	\N	\N	\N	\N
1800	391	3	8.95	N/A	\N	\N	\N	\N	\N
1801	391	4	8.4	N/A	\N	\N	\N	\N	\N
1812	1426	1	6.68	N/A	\N	\N	\N	\N	\N
1813	1426	2	7.09	N/A	\N	\N	\N	\N	\N
1814	1426	3	7.57	N/A	\N	\N	\N	\N	\N
1815	1426	4	7.08	N/A	\N	\N	\N	\N	\N
1816	1426	5	7.23	N/A	\N	\N	\N	\N	\N
1817	1426	6	7.41	N/A	\N	\N	\N	\N	\N
1818	400	1	8.5	N/A	\N	\N	\N	\N	\N
1819	400	2	9	N/A	\N	\N	\N	\N	\N
1820	400	3	7.6	N/A	\N	\N	\N	\N	\N
1821	400	4	7.9	N/A	\N	\N	\N	\N	\N
2282	393	2	7.59	N/A	\N	\N	\N	\N	\N
2283	393	3	6.8	N/A	\N	\N	\N	\N	\N
1942	421	1	7.14	N/A	\N	\N	\N	\N	\N
1943	421	2	7.91	N/A	\N	\N	\N	\N	\N
1944	421	3	6.86	N/A	\N	\N	\N	\N	\N
1945	421	4	7.7	N/A	\N	\N	\N	\N	\N
2284	393	4	6.88	N/A	\N	\N	\N	\N	\N
2382	445	1	6.22	N/A	\N	\N	\N	\N	\N
2383	445	2	6.7	N/A	\N	\N	\N	\N	\N
2384	445	3	5.96	N/A	\N	\N	\N	\N	\N
2385	445	4	6	DCOM, DBMS, OOP	\N	\N	\N	\N	\N
2416	1363	1	9.41	N/A	\N	\N	\N	\N	\N
2417	1363	2	9.45	N/A	\N	\N	\N	\N	\N
2418	1363	3	8.14	N/A	\N	\N	\N	\N	\N
2419	1363	4	8	N/A	\N	\N	\N	\N	\N
2420	1442	1	1	N/A	\N	\N	\N	\N	\N
2421	1442	2	1	N/A	\N	\N	\N	\N	\N
2422	1442	3	8.78	N/A	\N	\N	\N	\N	\N
2423	1442	4	8.75	N/A	\N	\N	\N	\N	\N
2424	1442	5	8.97	N/A	\N	\N	\N	\N	\N
2425	1442	6	9.45	N/A	\N	\N	\N	\N	\N
928	1344	1	8.36	N/A	\N	\N	\N	\N	\N
929	1344	2	9.18	N/A	\N	\N	\N	\N	\N
930	1344	3	7.46	N/A	\N	\N	\N	\N	\N
931	1344	4	7.35	N/A	\N	\N	\N	\N	\N
3990	1539	1	7.45	N/A	\N	\N	\N	\N	\N
938	331	1	6.05	N/A	\N	\N	\N	\N	\N
939	331	2	5.91	N/A	\N	\N	\N	\N	\N
3991	1539	2	9.27	N/A	\N	\N	\N	\N	\N
3992	1539	3	7.5	N/A	\N	\N	\N	\N	\N
3993	1539	4	7.9	N/A	\N	\N	\N	\N	\N
3994	1539	5	8.15	N/A	\N	\N	\N	\N	\N
3995	1539	6	8.32	N/A	\N	\N	\N	\N	\N
4014	1518	1	9.5	N/A	\N	\N	\N	\N	\N
1850	385	1	8.72	N/A	\N	\N	\N	\N	\N
1851	385	2	9.91	N/A	\N	\N	\N	\N	\N
1852	385	3	8.75	N/A	\N	\N	\N	\N	\N
1853	385	4	8.62	N/A	\N	\N	\N	\N	\N
1054	320	1	6.91	N/A	\N	\N	\N	\N	\N
1055	320	2	6.71	N/A	\N	\N	\N	\N	\N
1064	357	1	7.36	N/A	\N	\N	\N	\N	\N
1065	357	2	7.36	N/A	\N	\N	\N	\N	\N
4015	1518	2	9.64	N/A	\N	\N	\N	\N	\N
4016	1518	3	8.48	N/A	\N	\N	\N	\N	\N
4017	1518	4	8.15	N/A	\N	\N	\N	\N	\N
4018	1518	5	8.5	N/A	\N	\N	\N	\N	\N
4019	1518	6	8.68	N/A	\N	\N	\N	\N	\N
5624	346	1	8.05	N/A	\N	\N	\N	\N	\N
2541	394	4	6.3	3	\N	\N	\N	\N	\N
3147	1545	5	8.32	N/A	\N	\N	\N	\N	\N
1112	407	1	8.77	N/A	\N	\N	\N	\N	\N
1113	407	2	9	N/A	\N	\N	\N	\N	\N
1114	407	3	8.14	N/A	\N	\N	\N	\N	\N
1115	407	4	8.57	N/A	\N	\N	\N	\N	\N
5625	346	2	8.45	N/A	\N	\N	\N	\N	\N
1120	649	1	7.5	N/A	\N	\N	\N	\N	\N
1121	649	2	7.9	N/A	\N	\N	\N	\N	\N
4158	1532	1	9	N/A	\N	\N	\N	\N	\N
1477	1365	1	8.7	N/A	\N	\N	\N	\N	\N
1478	1365	2	9.1	N/A	\N	\N	\N	\N	\N
1479	1365	3	7.5	N/A	\N	\N	\N	\N	\N
1480	1365	4	7.6	N/A	\N	\N	\N	\N	\N
1419	416	1	8.64	N/A	\N	\N	\N	\N	\N
1420	416	2	8.88	N/A	\N	\N	\N	\N	\N
1421	416	3	7.13	N/A	\N	\N	\N	\N	\N
1422	416	4	7.51	N/A	\N	\N	\N	\N	\N
4159	1532	2	9.05	N/A	\N	\N	\N	\N	\N
4160	1532	3	7.83	N/A	\N	\N	\N	\N	\N
4161	1532	4	7.95	N/A	\N	\N	\N	\N	\N
4162	1532	5	8.36	N/A	\N	\N	\N	\N	\N
2093	395	3	6	2	\N	\N	\N	\N	\N
2094	395	4	6	5	\N	\N	\N	\N	\N
1525	1336	1	7.14	N/A	\N	\N	\N	\N	\N
1526	1336	2	7.05	N/A	\N	\N	\N	\N	\N
1527	1336	3	7	N/A	\N	\N	\N	\N	\N
1528	1336	4	7	N/A	\N	\N	\N	\N	\N
3148	1545	6	8.3	N/A	\N	\N	\N	\N	\N
934	355	1	6.93	N/A	\N	\N	\N	\N	\N
2333	1435	1	6.55	N/A	\N	\N	\N	\N	\N
2334	1435	2	7.14	N/A	\N	\N	\N	\N	\N
2335	1435	3	6.35	N/A	\N	\N	\N	\N	\N
1565	1347	1	9.09	N/A	\N	\N	\N	\N	\N
1566	1347	2	9.68	N/A	\N	\N	\N	\N	\N
1567	1347	3	8.14	N/A	\N	\N	\N	\N	\N
1568	1347	4	8.2	N/A	\N	\N	\N	\N	\N
2336	1435	4	7.5	N/A	\N	\N	\N	\N	\N
2337	1435	5	7.55	N/A	\N	\N	\N	\N	\N
2338	1435	6	8.05	N/A	\N	\N	\N	\N	\N
2173	1444	3	7	N/A	\N	\N	\N	\N	\N
2174	1444	4	7.8	N/A	\N	\N	\N	\N	\N
1902	1373	1	8.23	N/A	\N	\N	\N	\N	\N
1903	1373	2	8.5	N/A	\N	\N	\N	\N	\N
1904	1373	3	7.52	N/A	\N	\N	\N	\N	\N
1905	1373	4	8.39	N/A	\N	\N	\N	\N	\N
2175	1444	5	7.95	N/A	\N	\N	\N	\N	\N
2176	1444	6	8.41	N/A	\N	\N	\N	\N	\N
2194	423	1	8.68	N/A	\N	\N	\N	\N	\N
2195	423	2	9.14	N/A	\N	\N	\N	\N	\N
2196	423	3	6.81	N/A	\N	\N	\N	\N	\N
2197	423	4	8.48	N/A	\N	\N	\N	\N	\N
4163	1532	6	8.36	N/A	\N	\N	\N	\N	\N
3399	330	1	7.59	N/A	\N	\N	\N	\N	\N
3400	330	2	7.64	N/A	\N	\N	\N	\N	\N
1762	1352	1	7.91	N/A	\N	\N	\N	\N	\N
1763	1352	2	8.91	N/A	\N	\N	\N	\N	\N
1764	1352	3	7.71	N/A	\N	\N	\N	\N	\N
1765	1352	4	8.17	N/A	\N	\N	\N	\N	\N
1802	1341	1	8.59	N/A	\N	\N	\N	\N	\N
1803	1341	2	9.14	N/A	\N	\N	\N	\N	\N
1804	1341	3	8.62	N/A	\N	\N	\N	\N	\N
1805	1341	4	8.52	N/A	\N	\N	\N	\N	\N
4328	1580	1	6.36	N/A	\N	\N	\N	\N	\N
4329	1580	2	6.95	N/A	\N	\N	\N	\N	\N
4330	1580	3	5.79	N/A	\N	\N	\N	\N	\N
4331	1580	4	5.95	N/A	\N	\N	\N	\N	\N
4332	1580	5	6.14	N/A	\N	\N	\N	\N	\N
4333	1580	6	7.27	N/A	\N	\N	\N	\N	\N
3942	1559	1	8.73	N/A	\N	\N	\N	\N	\N
3943	1559	2	9	N/A	\N	\N	\N	\N	\N
3944	1559	3	8.17	N/A	\N	\N	\N	\N	\N
3945	1559	4	7.35	N/A	\N	\N	\N	\N	\N
3946	1559	5	7.95	N/A	\N	\N	\N	\N	\N
3947	1559	6	8.45	N/A	\N	\N	\N	\N	\N
4620	1400	1	6.86	N/A	\N	\N	\N	\N	\N
4382	1581	1	6.68	N/A	\N	\N	\N	\N	\N
4383	1581	2	7.77	N/A	\N	\N	\N	\N	\N
4384	1581	3	6.25	DS,COA	\N	\N	\N	\N	\N
4385	1581	4	6.28	DBMS, DM	\N	\N	\N	\N	\N
4386	1581	5	5.85	N/A	\N	\N	\N	\N	\N
4387	1581	6	6.82	ACN,DAA	\N	\N	\N	\N	\N
2035	1422	1	7.82	N/A	\N	\N	\N	\N	\N
2036	1422	2	8.55	N/A	\N	\N	\N	\N	\N
2037	1422	3	8	N/A	\N	\N	\N	\N	\N
2038	1422	4	7.3	N/A	\N	\N	\N	\N	\N
2039	1422	5	7.86	N/A	\N	\N	\N	\N	\N
2040	1422	6	7.86	N/A	\N	\N	\N	\N	\N
4621	1400	2	7.64	N/A	\N	\N	\N	\N	\N
4622	1400	3	7.26	N/A	\N	\N	\N	\N	\N
4623	1400	4	6.9	N/A	\N	\N	\N	\N	\N
4624	1400	5	7.41	N/A	\N	\N	\N	\N	\N
2045	392	1	7.7	N/A	\N	\N	\N	\N	\N
2046	392	2	8.8	N/A	\N	\N	\N	\N	\N
2047	392	3	7.83	N/A	\N	\N	\N	\N	\N
2048	392	4	7.3	N/A	\N	\N	\N	\N	\N
4625	1400	6	7.9	N/A	\N	\N	\N	\N	\N
4650	1552	1	8.89	N/A	\N	\N	\N	\N	\N
4651	1552	2	9.68	N/A	\N	\N	\N	\N	\N
2462	420	1	8.75	N/A	\N	\N	\N	\N	\N
2463	420	2	9.77	N/A	\N	\N	\N	\N	\N
2464	420	3	7.38	N/A	\N	\N	\N	\N	\N
2465	420	4	8.66	N/A	\N	\N	\N	\N	\N
996	656	1	7	N/A	\N	\N	\N	\N	\N
997	656	2	7	N/A	\N	\N	\N	\N	\N
1439	699	1	7.64	N/A	\N	\N	\N	\N	\N
1440	699	2	8.5	N/A	\N	\N	\N	\N	\N
947	1438	2	8.32	Engineering practices 2	\N	\N	\N	\N	\N
948	1438	3	7.22	N/A	\N	\N	\N	\N	\N
949	1438	4	7.15	N/A	\N	\N	\N	\N	\N
950	1438	5	7.4	N/A	\N	\N	\N	\N	\N
951	1438	6	7.5	N/A	\N	\N	\N	\N	\N
1641	1345	1	8.55	N/A	\N	\N	\N	\N	\N
1642	1345	2	9.27	N/A	\N	\N	\N	\N	\N
954	332	1	8.45	N/A	\N	\N	\N	\N	\N
955	332	2	8.45	N/A	\N	\N	\N	\N	\N
1643	1345	3	8.3	N/A	\N	\N	\N	\N	\N
1644	1345	4	8.55	N/A	\N	\N	\N	\N	\N
958	359	1	8.27	N/A	\N	\N	\N	\N	\N
959	359	2	8.45	N/A	\N	\N	\N	\N	\N
1447	363	1	8.81	N/A	\N	\N	\N	\N	\N
1448	363	2	8.55	N/A	\N	\N	\N	\N	\N
1653	1445	3	6.61	N/A	\N	\N	\N	\N	\N
1654	1445	4	6.05	N/A	\N	\N	\N	\N	\N
964	683	1	6	N/A	\N	\N	\N	\N	\N
965	683	2	6	Problem solving with python,modern web technology	\N	\N	\N	\N	\N
3066	1359	1	9.2	N/A	\N	\N	\N	\N	\N
3067	1359	2	9.9	N/A	\N	\N	\N	\N	\N
3068	1359	3	8.1	N/A	\N	\N	\N	\N	\N
3069	1359	4	8.6	N/A	\N	\N	\N	\N	\N
1655	1445	5	7.41	N/A	\N	\N	\N	\N	\N
1656	1445	6	6.45	N/A	\N	\N	\N	\N	\N
1663	349	1	5.92	N/A	\N	\N	\N	\N	\N
1664	349	2	5.5	Physics	\N	\N	\N	\N	\N
1673	321	1	6.64	N/A	\N	\N	\N	\N	\N
1674	321	2	6.86	N/A	\N	\N	\N	\N	\N
1687	652	1	7.2	N/A	\N	\N	\N	\N	\N
1688	652	2	7	N/A	\N	\N	\N	\N	\N
1357	1382	3	7.62	N/A	\N	\N	\N	\N	\N
1358	1382	4	8.04	N/A	\N	\N	\N	\N	\N
2534	430	1	7.14	N/A	\N	\N	\N	\N	\N
2535	430	2	8.06	N/A	\N	\N	\N	\N	\N
1503	681	1	9.09	N/A	\N	\N	\N	\N	\N
1504	681	2	10	N/A	\N	\N	\N	\N	\N
2536	430	3	7.43	N/A	\N	\N	\N	\N	\N
2537	430	4	7.91	N/A	\N	\N	\N	\N	\N
2351	1403	1	6.64	N/A	\N	\N	\N	\N	\N
2352	1403	2	6.95	N/A	\N	\N	\N	\N	\N
1084	1429	1	7.45	N/A	\N	\N	\N	\N	\N
1085	1429	2	8	N/A	\N	\N	\N	\N	\N
1086	1429	3	7.48	N/A	\N	\N	\N	\N	\N
1087	1429	4	7.25	N/A	\N	\N	\N	\N	\N
1088	1429	5	7.82	N/A	\N	\N	\N	\N	\N
1089	1429	6	7.95	N/A	\N	\N	\N	\N	\N
1094	387	1	9.77	N/A	\N	\N	\N	\N	\N
1095	387	2	9.86	N/A	\N	\N	\N	\N	\N
1096	387	3	9	N/A	\N	\N	\N	\N	\N
1097	387	4	8.95	N/A	\N	\N	\N	\N	\N
1954	1355	1	8.23	N/A	\N	\N	\N	\N	\N
1955	1355	2	9.64	N/A	\N	\N	\N	\N	\N
1557	1334	1	8.41	N/A	\N	\N	\N	\N	\N
1558	1334	2	9.18	N/A	\N	\N	\N	\N	\N
1559	1334	3	7.62	N/A	\N	\N	\N	\N	\N
1560	1334	4	7.65	N/A	\N	\N	\N	\N	\N
1956	1355	3	7.52	N/A	\N	\N	\N	\N	\N
1957	1355	4	8.4	N/A	\N	\N	\N	\N	\N
2353	1403	3	7.04	N/A	\N	\N	\N	\N	\N
2354	1403	4	7.95	N/A	\N	\N	\N	\N	\N
2355	1403	5	7.41	N/A	\N	\N	\N	\N	\N
2356	1403	6	7.68	N/A	\N	\N	\N	\N	\N
4020	1538	1	8.23	N/A	\N	\N	\N	\N	\N
4021	1538	2	9.18	N/A	\N	\N	\N	\N	\N
4022	1538	3	8.7	N/A	\N	\N	\N	\N	\N
4023	1538	4	8.4	N/A	\N	\N	\N	\N	\N
4024	1538	5	8.23	N/A	\N	\N	\N	\N	\N
4025	1538	6	8.36	N/A	\N	\N	\N	\N	\N
2542	433	1	7.9	N/A	\N	\N	\N	\N	\N
2543	433	2	8.5	N/A	\N	\N	\N	\N	\N
2544	433	3	7.78	N/A	\N	\N	\N	\N	\N
2545	433	4	7.52	N/A	\N	\N	\N	\N	\N
2011	375	1	9.73	N/A	\N	\N	\N	\N	\N
2012	375	2	10	N/A	\N	\N	\N	\N	\N
2013	375	3	8.95	N/A	\N	\N	\N	\N	\N
2014	375	4	9.48	N/A	\N	\N	\N	\N	\N
2231	1411	1	7.77	N/A	\N	\N	\N	\N	\N
2232	1411	2	7.73	N/A	\N	\N	\N	\N	\N
2233	1411	3	7.61	N/A	\N	\N	\N	\N	\N
2234	1411	4	7.75	N/A	\N	\N	\N	\N	\N
1006	435	1	9.23	N/A	\N	\N	\N	\N	\N
1007	435	2	9.59	N/A	\N	\N	\N	\N	\N
1008	435	3	8.81	N/A	\N	\N	\N	\N	\N
1009	435	4	8.83	N/A	\N	\N	\N	\N	\N
2031	389	1	8.08	N/A	\N	\N	\N	\N	\N
2032	389	2	8.98	N/A	\N	\N	\N	\N	\N
2033	389	3	7.6	N/A	\N	\N	\N	\N	\N
2034	389	4	9.03	N/A	\N	\N	\N	\N	\N
2163	1406	1	7.73	N/A	\N	\N	\N	\N	\N
2164	1406	2	8.32	N/A	\N	\N	\N	\N	\N
946	1438	1	8.64	N/A	\N	\N	\N	\N	\N
3668	1579	1	6.61	N/A	\N	\N	\N	\N	\N
3669	1579	2	6.91	N/A	\N	\N	\N	\N	\N
3670	1579	3	5.5	N/A	\N	\N	\N	\N	\N
3671	1579	4	5.3	N/A	\N	\N	\N	\N	\N
3672	1579	5	6	1	\N	\N	\N	\N	\N
3673	1579	6	6	2	\N	\N	\N	\N	\N
3684	1428	1	7.77	N/A	\N	\N	\N	\N	\N
3685	1428	2	7.77	N/A	\N	\N	\N	\N	\N
3686	1428	3	7.43	N/A	\N	\N	\N	\N	\N
3687	1428	4	7.65	N/A	\N	\N	\N	\N	\N
3688	1428	5	7.86	N/A	\N	\N	\N	\N	\N
3689	1428	6	8.64	N/A	\N	\N	\N	\N	\N
2215	396	1	6.91	N/A	\N	\N	\N	\N	\N
2216	396	2	7.16	N/A	\N	\N	\N	\N	\N
2217	396	3	6.96	N/A	\N	\N	\N	\N	\N
2218	396	4	7	dbms,oops	\N	\N	\N	\N	\N
2219	1391	1	8.82	N/A	\N	\N	\N	\N	\N
2220	1391	2	7.36	N/A	\N	\N	\N	\N	\N
2221	1391	3	7.52	N/A	\N	\N	\N	\N	\N
2222	1391	4	7.25	N/A	\N	\N	\N	\N	\N
2223	1391	5	7.91	N/A	\N	\N	\N	\N	\N
2224	1391	6	7.8	N/A	\N	\N	\N	\N	\N
2241	1361	1	7.59	N/A	\N	\N	\N	\N	\N
2242	1361	2	7.91	N/A	\N	\N	\N	\N	\N
2243	1361	3	7.71	N/A	\N	\N	\N	\N	\N
2244	1361	4	7.72	N/A	\N	\N	\N	\N	\N
3070	1554	1	9.09	N/A	\N	\N	\N	\N	\N
3071	1554	2	10	N/A	\N	\N	\N	\N	\N
3072	1554	3	8.35	N/A	\N	\N	\N	\N	\N
3073	1554	4	9.15	N/A	\N	\N	\N	\N	\N
3074	1554	5	8.09	N/A	\N	\N	\N	\N	\N
3075	1554	6	9.73	N/A	\N	\N	\N	\N	\N
2746	1350	1	7.77	N/A	\N	\N	\N	\N	\N
2747	1350	2	8.41	N/A	\N	\N	\N	\N	\N
2566	362	1	7.45	N/A	\N	\N	\N	\N	\N
2567	362	2	7.45	N/A	\N	\N	\N	\N	\N
2748	1350	3	7.48	N/A	\N	\N	\N	\N	\N
2749	1350	4	8.13	N/A	\N	\N	\N	\N	\N
3201	1424	1	8.36	N/A	\N	\N	\N	\N	\N
3202	1424	2	7.59	N/A	\N	\N	\N	\N	\N
3203	1424	3	7.74	N/A	\N	\N	\N	\N	\N
3204	1424	4	8.2	N/A	\N	\N	\N	\N	\N
3205	1424	5	8.23	N/A	\N	\N	\N	\N	\N
3206	1424	6	9.05	N/A	\N	\N	\N	\N	\N
2754	383	1	8.41	N/A	\N	\N	\N	\N	\N
2755	383	2	9.05	N/A	\N	\N	\N	\N	\N
2756	383	3	7.71	N/A	\N	\N	\N	\N	\N
2757	383	4	8.61	N/A	\N	\N	\N	\N	\N
3379	1427	1	7.68	N/A	\N	\N	\N	\N	\N
3380	1427	2	8.32	N/A	\N	\N	\N	\N	\N
3381	1427	3	7.61	N/A	\N	\N	\N	\N	\N
3382	1427	4	6.8	N/A	\N	\N	\N	\N	\N
3383	1427	5	7.68	N/A	\N	\N	\N	\N	\N
3384	1427	6	7.69	N/A	\N	\N	\N	\N	\N
5283	1374	1	8.27	N/A	\N	\N	\N	\N	\N
5284	1374	2	9.95	N/A	\N	\N	\N	\N	\N
4176	1572	1	7.09	N/A	\N	\N	\N	\N	\N
4177	1572	2	8.5	N/A	\N	\N	\N	\N	\N
4178	1572	3	6.39	N/A	\N	\N	\N	\N	\N
4179	1572	4	6.55	N/A	\N	\N	\N	\N	\N
5285	1374	3	9	N/A	\N	\N	\N	\N	\N
5286	1374	4	8.87	N/A	\N	\N	\N	\N	\N
5328	1319	1	8.89	N/A	\N	\N	\N	\N	\N
4076	691	1	8	N/A	\N	\N	\N	\N	\N
4077	691	2	7.4	N/A	\N	\N	\N	\N	\N
3277	1381	1	7.8	N/A	\N	\N	\N	\N	\N
3278	1381	2	8.1	N/A	\N	\N	\N	\N	\N
3279	1381	3	7.8	N/A	\N	\N	\N	\N	\N
3280	1381	4	8.1	N/A	\N	\N	\N	\N	\N
3299	1401	1	6.14	N/A	\N	\N	\N	\N	\N
3300	1401	2	6.16	N/A	\N	\N	\N	\N	\N
3301	1401	3	6.28	N/A	\N	\N	\N	\N	\N
3302	1401	4	6.29	N/A	\N	\N	\N	\N	\N
3303	1401	5	6.45	N/A	\N	\N	\N	\N	\N
3304	1401	6	6.52	N/A	\N	\N	\N	\N	\N
2620	696	1	7.1	N/A	\N	\N	\N	\N	\N
2621	696	2	7.2	N/A	\N	\N	\N	\N	\N
3431	1561	1	8.59	N/A	\N	\N	\N	\N	\N
3432	1561	2	9.73	N/A	\N	\N	\N	\N	\N
2624	1380	3	8.14	N/A	\N	\N	\N	\N	\N
2625	1380	4	8.17	N/A	\N	\N	\N	\N	\N
3433	1561	3	9	N/A	\N	\N	\N	\N	\N
3434	1561	4	9.2	N/A	\N	\N	\N	\N	\N
3435	1561	5	8.82	N/A	\N	\N	\N	\N	\N
3436	1561	6	9.18	N/A	\N	\N	\N	\N	\N
2630	1328	1	8.6	N/A	\N	\N	\N	\N	\N
2631	1328	2	9.45	N/A	\N	\N	\N	\N	\N
2632	1328	3	9.01	N/A	\N	\N	\N	\N	\N
2633	1328	4	8.4	N/A	\N	\N	\N	\N	\N
2634	1385	1	9.41	N/A	\N	\N	\N	\N	\N
2635	1385	2	9.41	N/A	\N	\N	\N	\N	\N
2636	1385	3	8.7	N/A	\N	\N	\N	\N	\N
2637	1385	4	9	N/A	\N	\N	\N	\N	\N
2638	1385	5	9	N/A	\N	\N	\N	\N	\N
2639	1385	6	8.23	N/A	\N	\N	\N	\N	\N
3449	1389	1	9.45	N/A	\N	\N	\N	\N	\N
3450	1389	2	9.68	N/A	\N	\N	\N	\N	\N
3451	1389	3	9.36	N/A	\N	\N	\N	\N	\N
3452	1389	4	9.22	N/A	\N	\N	\N	\N	\N
3453	1389	5	9.11	N/A	\N	\N	\N	\N	\N
3454	1389	6	9.11	N/A	\N	\N	\N	\N	\N
2646	1388	1	8.9	N/A	\N	\N	\N	\N	\N
2647	1388	2	8.5	N/A	\N	\N	\N	\N	\N
2648	1388	3	7.4	N/A	\N	\N	\N	\N	\N
2649	1388	4	7.8	N/A	\N	\N	\N	\N	\N
2650	1388	5	8.5	N/A	\N	\N	\N	\N	\N
2651	1388	6	8.5	N/A	\N	\N	\N	\N	\N
2664	1392	1	9.09	N/A	\N	\N	\N	\N	\N
2665	1392	2	8.64	N/A	\N	\N	\N	\N	\N
2666	1392	3	7.48	N/A	\N	\N	\N	\N	\N
2667	1392	4	7.4	N/A	\N	\N	\N	\N	\N
2668	1392	5	7.3	N/A	\N	\N	\N	\N	\N
2669	1392	6	7.95	N/A	\N	\N	\N	\N	\N
2686	1432	1	9.27	N/A	\N	\N	\N	\N	\N
2687	1432	2	9.32	N/A	\N	\N	\N	\N	\N
2688	1432	3	9.28	N/A	\N	\N	\N	\N	\N
2689	1432	4	8.51	N/A	\N	\N	\N	\N	\N
2690	1432	5	8.81	N/A	\N	\N	\N	\N	\N
2691	1432	6	9.08	N/A	\N	\N	\N	\N	\N
2716	1421	1	9.23	N/A	\N	\N	\N	\N	\N
2717	1421	2	9.27	N/A	\N	\N	\N	\N	\N
2718	1421	3	8.96	N/A	\N	\N	\N	\N	\N
2719	1421	4	8.8	N/A	\N	\N	\N	\N	\N
2720	1421	5	8.64	N/A	\N	\N	\N	\N	\N
2721	1421	6	8.32	N/A	\N	\N	\N	\N	\N
2758	399	1	8.2	N/A	\N	\N	\N	\N	\N
2759	399	2	8.6	N/A	\N	\N	\N	\N	\N
2760	399	3	6.9	N/A	\N	\N	\N	\N	\N
2761	399	4	6.7	N/A	\N	\N	\N	\N	\N
2767	1349	1	9.59	N/A	\N	\N	\N	\N	\N
2768	1349	2	10	N/A	\N	\N	\N	\N	\N
2769	1349	3	8.48	N/A	\N	\N	\N	\N	\N
2770	1349	4	8.87	N/A	\N	\N	\N	\N	\N
2774	437	3	7.8	N/A	\N	\N	\N	\N	\N
2775	437	4	8.5	N/A	\N	\N	\N	\N	\N
2788	1413	1	8.2	N/A	\N	\N	\N	\N	\N
2789	1413	2	8.86	N/A	\N	\N	\N	\N	\N
2790	1413	3	8.22	N/A	\N	\N	\N	\N	\N
2791	1413	4	8.15	N/A	\N	\N	\N	\N	\N
2792	1413	5	8.32	N/A	\N	\N	\N	\N	\N
2793	1413	6	7.8	N/A	\N	\N	\N	\N	\N
3367	1582	1	6.09	2	\N	\N	\N	\N	\N
3368	1582	2	6.16	N/A	\N	\N	\N	\N	\N
3369	1582	3	5.79	2	\N	\N	\N	\N	\N
3370	1582	4	5.52	2	\N	\N	\N	\N	\N
3371	1582	5	6.55	1	\N	\N	\N	\N	\N
3372	1582	6	7.41	N/A	\N	\N	\N	\N	\N
3259	1398	1	7.91	N/A	\N	\N	\N	\N	\N
3260	1398	2	8.64	N/A	\N	\N	\N	\N	\N
3261	1398	3	7.35	N/A	\N	\N	\N	\N	\N
3262	1398	4	7.8	N/A	\N	\N	\N	\N	\N
3263	1398	5	8.89	N/A	\N	\N	\N	\N	\N
3264	1398	6	8.1	N/A	\N	\N	\N	\N	\N
3215	1379	1	8	N/A	\N	\N	\N	\N	\N
3216	1379	2	8	N/A	\N	\N	\N	\N	\N
3217	1379	3	7.9	N/A	\N	\N	\N	\N	\N
3218	1379	4	8.5	N/A	\N	\N	\N	\N	\N
2964	692	1	6.91	N/A	\N	\N	\N	\N	\N
2965	692	2	6.68	N/A	\N	\N	\N	\N	\N
4032	1528	1	5.72	N/A	\N	\N	\N	\N	\N
3656	1410	1	9.77	N/A	\N	\N	\N	\N	\N
3657	1410	2	10	N/A	\N	\N	\N	\N	\N
3658	1410	3	9.99	N/A	\N	\N	\N	\N	\N
3659	1410	4	10	N/A	\N	\N	\N	\N	\N
3660	1410	5	9.93	N/A	\N	\N	\N	\N	\N
3661	1410	6	9.98	N/A	\N	\N	\N	\N	\N
4033	1528	2	5.64	N/A	\N	\N	\N	\N	\N
4034	1528	3	5.48	N/A	\N	\N	\N	\N	\N
4035	1528	4	6.95	N/A	\N	\N	\N	\N	\N
4036	1528	5	6.41	N/A	\N	\N	\N	\N	\N
4037	1528	6	6.68	N/A	\N	\N	\N	\N	\N
4050	1534	1	7.23	N/A	\N	\N	\N	\N	\N
4051	1534	2	7.32	N/A	\N	\N	\N	\N	\N
4052	1534	3	6.39	N/A	\N	\N	\N	\N	\N
4053	1534	4	7.15	N/A	\N	\N	\N	\N	\N
4054	1534	5	6.45	N/A	\N	\N	\N	\N	\N
4055	1534	6	7.15	N/A	\N	\N	\N	\N	\N
3179	442	1	8.5	N/A	\N	\N	\N	\N	\N
3180	442	2	8.5	N/A	\N	\N	\N	\N	\N
3181	442	3	8.14	N/A	\N	\N	\N	\N	\N
3182	442	4	8.5	N/A	\N	\N	\N	\N	\N
4424	1516	3	7.82	N/A	\N	\N	\N	\N	\N
3870	1423	1	7.32	N/A	\N	\N	\N	\N	\N
3871	1423	2	8.05	N/A	\N	\N	\N	\N	\N
3872	1423	3	7.04	N/A	\N	\N	\N	\N	\N
3873	1423	4	6.15	N/A	\N	\N	\N	\N	\N
3874	1423	5	7.86	N/A	\N	\N	\N	\N	\N
3875	1423	6	7.27	N/A	\N	\N	\N	\N	\N
4425	1516	4	8	N/A	\N	\N	\N	\N	\N
4426	1516	5	7.83	N/A	\N	\N	\N	\N	\N
4427	1516	6	8	N/A	\N	\N	\N	\N	\N
5101	666	1	5.95	N/A	\N	\N	\N	\N	\N
4520	427	1	9.32	N/A	\N	\N	\N	\N	\N
3918	1526	1	8.41	N/A	\N	\N	\N	\N	\N
3919	1526	2	9.23	N/A	\N	\N	\N	\N	\N
3920	1526	3	8.09	N/A	\N	\N	\N	\N	\N
3287	1547	1	8.36	N/A	\N	\N	\N	\N	\N
3288	1547	2	9.5	N/A	\N	\N	\N	\N	\N
3289	1547	3	8.74	N/A	\N	\N	\N	\N	\N
3290	1547	4	8.85	N/A	\N	\N	\N	\N	\N
3291	1547	5	8.23	N/A	\N	\N	\N	\N	\N
3292	1547	6	9.05	N/A	\N	\N	\N	\N	\N
3921	1526	4	8.7	N/A	\N	\N	\N	\N	\N
3922	1526	5	8.41	N/A	\N	\N	\N	\N	\N
3923	1526	6	8.68	N/A	\N	\N	\N	\N	\N
3954	1520	1	7.61	N/A	\N	\N	\N	\N	\N
3955	1520	2	9.41	N/A	\N	\N	\N	\N	\N
3956	1520	3	7.68	N/A	\N	\N	\N	\N	\N
3957	1520	4	7.95	N/A	\N	\N	\N	\N	\N
3958	1520	5	7.95	N/A	\N	\N	\N	\N	\N
3959	1520	6	8.63	N/A	\N	\N	\N	\N	\N
4521	427	2	9.77	N/A	\N	\N	\N	\N	\N
4522	427	3	9.05	N/A	\N	\N	\N	\N	\N
4523	427	4	9.57	N/A	\N	\N	\N	\N	\N
4114	1408	1	9.18	N/A	\N	\N	\N	\N	\N
4115	1408	2	9.27	N/A	\N	\N	\N	\N	\N
4116	1408	3	8.52	N/A	\N	\N	\N	\N	\N
4117	1408	4	8.85	N/A	\N	\N	\N	\N	\N
4118	1408	5	8.77	N/A	\N	\N	\N	\N	\N
4119	1408	6	9.18	N/A	\N	\N	\N	\N	\N
3896	371	1	8	N/A	\N	\N	\N	\N	\N
3897	371	2	8	N/A	\N	\N	\N	\N	\N
5045	424	1	8.01	N/A	\N	\N	\N	\N	\N
5046	424	2	8.03	N/A	\N	\N	\N	\N	\N
5047	424	3	6.9	N/A	\N	\N	\N	\N	\N
5048	424	4	7.69	N/A	\N	\N	\N	\N	\N
5063	1537	1	6.8	N/A	\N	\N	\N	\N	\N
5064	1537	2	6.9	N/A	\N	\N	\N	\N	\N
5065	1537	3	6.7	N/A	\N	\N	\N	\N	\N
5066	1537	4	6.5	N/A	\N	\N	\N	\N	\N
5067	1537	5	6.7	N/A	\N	\N	\N	\N	\N
5068	1537	6	6.6	N/A	\N	\N	\N	\N	\N
5098	1530	4	8.2	N/A	\N	\N	\N	\N	\N
5099	1530	5	7.95	N/A	\N	\N	\N	\N	\N
5100	1530	6	8.18	N/A	\N	\N	\N	\N	\N
5102	666	2	4.85	3	\N	\N	\N	\N	\N
5121	317	1	6.3	N/A	\N	\N	\N	\N	\N
5122	317	2	6.25	Python practical	\N	\N	\N	\N	\N
5125	1320	1	8.9	N/A	\N	\N	\N	\N	\N
5126	1320	2	9.7	N/A	\N	\N	\N	\N	\N
5127	1320	3	9.33	N/A	\N	\N	\N	\N	\N
5128	1320	4	9.1	N/A	\N	\N	\N	\N	\N
5157	376	1	9.05	N/A	\N	\N	\N	\N	\N
5158	376	2	10	N/A	\N	\N	\N	\N	\N
5159	376	3	9.37	N/A	\N	\N	\N	\N	\N
5160	376	4	9.13	N/A	\N	\N	\N	\N	\N
5161	412	1	8.76	N/A	\N	\N	\N	\N	\N
5162	412	2	8.86	N/A	\N	\N	\N	\N	\N
5163	412	3	7.5	N/A	\N	\N	\N	\N	\N
5164	412	4	7.48	N/A	\N	\N	\N	\N	\N
3085	1548	1	8.91	N/A	\N	\N	\N	\N	\N
3086	1548	2	9.23	N/A	\N	\N	\N	\N	\N
3087	1548	3	8.13	N/A	\N	\N	\N	\N	\N
3088	1548	4	8.15	N/A	\N	\N	\N	\N	\N
3089	1548	5	8.5	N/A	\N	\N	\N	\N	\N
3090	1548	6	8.55	N/A	\N	\N	\N	\N	\N
144	688	2	8.71	N/A	\N	\N	\N	\N	\N
237	352	2	7.63	N/A	\N	\N	\N	\N	\N
240	315	1	5.95	N/A	\N	\N	\N	\N	\N
159	660	1	8.77	N/A	\N	\N	\N	\N	\N
160	660	2	9	N/A	\N	\N	\N	\N	\N
3702	1563	1	7.5	N/A	\N	\N	\N	\N	\N
3703	1563	2	7.59	N/A	\N	\N	\N	\N	\N
3704	1563	3	6.91	N/A	\N	\N	\N	\N	\N
195	361	1	7.02	N/A	\N	\N	\N	\N	\N
196	361	2	7.76	N/A	\N	\N	\N	\N	\N
203	334	1	7.05	N/A	\N	\N	\N	\N	\N
204	334	2	7.59	N/A	\N	\N	\N	\N	\N
207	358	1	6.5	N/A	\N	\N	\N	\N	\N
3169	422	1	8.55	N/A	\N	\N	\N	\N	\N
3170	422	2	8.55	N/A	\N	\N	\N	\N	\N
3171	422	3	7.38	N/A	\N	\N	\N	\N	\N
3172	422	4	8.09	N/A	\N	\N	\N	\N	\N
208	358	2	7.55	N/A	\N	\N	\N	\N	\N
399	369	1	5.85	N/A	\N	\N	\N	\N	\N
525	695	1	7.55	N/A	\N	\N	\N	\N	\N
526	695	2	8.09	N/A	\N	\N	\N	\N	\N
3221	350	1	8.32	N/A	\N	\N	\N	\N	\N
3222	350	2	7	N/A	\N	\N	\N	\N	\N
532	679	2	7	N/A	\N	\N	\N	\N	\N
638	1322	1	9.5	N/A	\N	\N	\N	\N	\N
639	1322	2	9.2	N/A	\N	\N	\N	\N	\N
640	1322	3	9.1	N/A	\N	\N	\N	\N	\N
641	1322	4	9	N/A	\N	\N	\N	\N	\N
808	684	1	6.18	N/A	\N	\N	\N	\N	\N
809	684	2	7.82	N/A	\N	\N	\N	\N	\N
2089	345	1	6.55	N/A	\N	\N	\N	\N	\N
1351	340	1	7.23	N/A	\N	\N	\N	\N	\N
1352	340	2	8.32	N/A	\N	\N	\N	\N	\N
1647	1357	3	9.07	N/A	\N	\N	\N	\N	\N
1648	1357	4	8.84	N/A	\N	\N	\N	\N	\N
935	355	2	7.63	N/A	\N	\N	\N	\N	\N
2538	394	1	7.59	N/A	\N	\N	\N	\N	\N
2539	394	2	7.75	N/A	\N	\N	\N	\N	\N
2540	394	3	7.25	N/A	\N	\N	\N	\N	\N
2091	395	1	6.56	N/A	\N	\N	\N	\N	\N
2092	395	2	6.76	N/A	\N	\N	\N	\N	\N
1661	360	1	8	N/A	\N	\N	\N	\N	\N
1662	360	2	7.9	N/A	\N	\N	\N	\N	\N
1756	663	1	6.36	N/A	\N	\N	\N	\N	\N
1757	663	2	6.06	N/A	\N	\N	\N	\N	\N
1964	323	1	7.5	N/A	\N	\N	\N	\N	\N
1965	323	2	8.23	N/A	\N	\N	\N	\N	\N
2376	1414	1	9.05	N/A	\N	\N	\N	\N	\N
2377	1414	2	8.91	N/A	\N	\N	\N	\N	\N
2378	1414	3	8.54	N/A	\N	\N	\N	\N	\N
2379	1414	4	8.47	N/A	\N	\N	\N	\N	\N
2380	1414	5	8.32	N/A	\N	\N	\N	\N	\N
2381	1414	6	8.44	N/A	\N	\N	\N	\N	\N
2392	1387	1	8.45	N/A	\N	\N	\N	\N	\N
2393	1387	2	8.77	N/A	\N	\N	\N	\N	\N
2394	1387	3	6.87	N/A	\N	\N	\N	\N	\N
2395	1387	4	6.7	N/A	\N	\N	\N	\N	\N
2396	1387	5	8.14	N/A	\N	\N	\N	\N	\N
2397	1387	6	8.02	N/A	\N	\N	\N	\N	\N
2235	1411	5	7.82	N/A	\N	\N	\N	\N	\N
2236	1411	6	7.95	N/A	\N	\N	\N	\N	\N
2165	1406	3	7.26	N/A	\N	\N	\N	\N	\N
2166	1406	4	7.65	N/A	\N	\N	\N	\N	\N
2167	1406	5	7.82	N/A	\N	\N	\N	\N	\N
2168	1406	6	7.45	N/A	\N	\N	\N	\N	\N
3628	1542	1	8.05	N/A	\N	\N	\N	\N	\N
3629	1542	2	8.68	N/A	\N	\N	\N	\N	\N
3630	1542	3	8.13	N/A	\N	\N	\N	\N	\N
3631	1542	4	8.55	N/A	\N	\N	\N	\N	\N
3632	1542	5	7.14	N/A	\N	\N	\N	\N	\N
3633	1542	6	8.59	N/A	\N	\N	\N	\N	\N
3637	1417	1	9.36	N/A	\N	\N	\N	\N	\N
3638	1417	2	10	N/A	\N	\N	\N	\N	\N
3639	1417	3	9.61	N/A	\N	\N	\N	\N	\N
3640	1417	4	9.65	N/A	\N	\N	\N	\N	\N
3641	1417	5	9.55	N/A	\N	\N	\N	\N	\N
3642	1417	6	9.73	N/A	\N	\N	\N	\N	\N
3902	1338	1	7.5	N/A	\N	\N	\N	\N	\N
3903	1338	2	8.16	N/A	\N	\N	\N	\N	\N
4096	1523	1	7.27	N/A	\N	\N	\N	\N	\N
4097	1523	2	7.16	N/A	\N	\N	\N	\N	\N
4098	1523	3	6.57	N/A	\N	\N	\N	\N	\N
4099	1523	4	5.9	N/A	\N	\N	\N	\N	\N
4100	1523	5	6.82	N/A	\N	\N	\N	\N	\N
4101	1523	6	7.23	N/A	\N	\N	\N	\N	\N
4102	1550	1	7.91	N/A	\N	\N	\N	\N	\N
4103	1550	2	7.82	N/A	\N	\N	\N	\N	\N
4104	1550	3	7.04	N/A	\N	\N	\N	\N	\N
4105	1550	4	7.15	N/A	\N	\N	\N	\N	\N
4106	1550	5	7.05	N/A	\N	\N	\N	\N	\N
4107	1550	6	7.05	N/A	\N	\N	\N	\N	\N
3904	1338	3	7.58	N/A	\N	\N	\N	\N	\N
3905	1338	4	7.68	N/A	\N	\N	\N	\N	\N
3844	1434	1	7.82	N/A	\N	\N	\N	\N	\N
3845	1434	2	8.91	N/A	\N	\N	\N	\N	\N
3846	1434	3	8.17	N/A	\N	\N	\N	\N	\N
3847	1434	4	8.65	N/A	\N	\N	\N	\N	\N
3848	1434	5	9.09	N/A	\N	\N	\N	\N	\N
3849	1434	6	8.82	N/A	\N	\N	\N	\N	\N
4236	1573	3	6.96	N/A	\N	\N	\N	\N	\N
4237	1573	4	7.25	N/A	\N	\N	\N	\N	\N
4238	1573	5	6.73	N/A	\N	\N	\N	\N	\N
4239	1573	6	7.1	N/A	\N	\N	\N	\N	\N
5300	1326	1	6.78	N/A	\N	\N	\N	\N	\N
5301	1326	2	6.64	N/A	\N	\N	\N	\N	\N
5302	1326	3	6.78	2	\N	\N	\N	\N	\N
5303	1326	4	6.64	2	\N	\N	\N	\N	\N
3924	1431	1	9.41	N/A	\N	\N	\N	\N	\N
3925	1431	2	9.68	N/A	\N	\N	\N	\N	\N
3926	1431	3	8.78	N/A	\N	\N	\N	\N	\N
3927	1431	4	9.05	N/A	\N	\N	\N	\N	\N
3928	1431	5	9.08	N/A	\N	\N	\N	\N	\N
3929	1431	6	8.14	N/A	\N	\N	\N	\N	\N
5341	348	2	5.8	Engineering Physics and Material Science	\N	\N	\N	\N	\N
5247	1331	1	6.32	N/A	\N	\N	\N	\N	\N
5248	1331	2	7.8	N/A	\N	\N	\N	\N	\N
5249	1331	3	7.5	N/A	\N	\N	\N	\N	\N
5250	1331	4	7.8	N/A	\N	\N	\N	\N	\N
4064	1553	3	6.04	1	\N	\N	\N	\N	\N
2970	1333	1	6.77	N/A	\N	\N	\N	\N	\N
2971	1333	2	7.05	N/A	\N	\N	\N	\N	\N
2972	1333	3	6.71	N/A	\N	\N	\N	\N	\N
4440	1514	1	5.95	3	\N	\N	\N	\N	\N
4441	1514	2	7	2	\N	\N	\N	\N	\N
3850	1393	1	9.64	N/A	\N	\N	\N	\N	\N
3173	1407	1	8.86	N/A	\N	\N	\N	\N	\N
3174	1407	2	9.68	N/A	\N	\N	\N	\N	\N
3175	1407	3	8.96	N/A	\N	\N	\N	\N	\N
3176	1407	4	9.4	N/A	\N	\N	\N	\N	\N
3177	1407	5	9.08	N/A	\N	\N	\N	\N	\N
3178	1407	6	9.23	N/A	\N	\N	\N	\N	\N
2973	1333	4	6.08	3	\N	\N	\N	\N	\N
3851	1393	2	10	N/A	\N	\N	\N	\N	\N
3852	1393	3	9.39	N/A	\N	\N	\N	\N	\N
3853	1393	4	10	N/A	\N	\N	\N	\N	\N
3467	1560	1	9.36	N/A	\N	\N	\N	\N	\N
3468	1560	2	9.82	N/A	\N	\N	\N	\N	\N
3469	1560	3	9.39	N/A	\N	\N	\N	\N	\N
3470	1560	4	9.85	N/A	\N	\N	\N	\N	\N
3471	1560	5	9.18	N/A	\N	\N	\N	\N	\N
3472	1560	6	9.18	N/A	\N	\N	\N	\N	\N
3854	1393	5	9.5	N/A	\N	\N	\N	\N	\N
3855	1393	6	9.73	N/A	\N	\N	\N	\N	\N
3857	1568	1	8.45	N/A	\N	\N	\N	\N	\N
3858	1568	2	8.73	N/A	\N	\N	\N	\N	\N
3859	1568	3	8.35	N/A	\N	\N	\N	\N	\N
3229	1558	1	7.55	N/A	\N	\N	\N	\N	\N
3230	1558	2	7.82	N/A	\N	\N	\N	\N	\N
3231	1558	3	7.3	N/A	\N	\N	\N	\N	\N
3232	1558	4	6.35	N/A	\N	\N	\N	\N	\N
3233	1558	5	7.09	N/A	\N	\N	\N	\N	\N
3234	1558	6	8	N/A	\N	\N	\N	\N	\N
3269	1337	1	8.77	N/A	\N	\N	\N	\N	\N
3270	1337	2	9.32	N/A	\N	\N	\N	\N	\N
3271	1337	3	8.75	N/A	\N	\N	\N	\N	\N
3272	1337	4	8.55	N/A	\N	\N	\N	\N	\N
3860	1568	4	8.95	N/A	\N	\N	\N	\N	\N
3497	1556	1	8.86	N/A	\N	\N	\N	\N	\N
3498	1556	2	9.55	N/A	\N	\N	\N	\N	\N
3499	1556	3	7.48	N/A	\N	\N	\N	\N	\N
3500	1556	4	8	N/A	\N	\N	\N	\N	\N
3501	1556	5	7.73	N/A	\N	\N	\N	\N	\N
3317	1549	1	8.55	N/A	\N	\N	\N	\N	\N
3318	1549	2	8.41	N/A	\N	\N	\N	\N	\N
3319	1549	3	7.13	N/A	\N	\N	\N	\N	\N
3320	1549	4	8.75	N/A	\N	\N	\N	\N	\N
3321	1549	5	8	N/A	\N	\N	\N	\N	\N
3322	1549	6	8.77	N/A	\N	\N	\N	\N	\N
3502	1556	6	7.23	N/A	\N	\N	\N	\N	\N
3861	1568	5	8.55	N/A	\N	\N	\N	\N	\N
3862	1568	6	8.45	N/A	\N	\N	\N	\N	\N
3882	1536	1	9	N/A	\N	\N	\N	\N	\N
3883	1536	2	9.14	N/A	\N	\N	\N	\N	\N
3555	1439	1	6.45	N/A	\N	\N	\N	\N	\N
3335	1440	1	6.64	N/A	\N	\N	\N	\N	\N
3336	1440	2	6.5	N/A	\N	\N	\N	\N	\N
3337	1440	3	6.43	Digital circuits and fundamentals of microprocessor	\N	\N	\N	\N	\N
3338	1440	4	7	Discrete mathematics	\N	\N	\N	\N	\N
3339	1440	5	7.05	N/A	\N	\N	\N	\N	\N
3340	1440	6	7.68	N/A	\N	\N	\N	\N	\N
3556	1439	2	6.32	N/A	\N	\N	\N	\N	\N
3557	1439	3	6.22	1	\N	\N	\N	\N	\N
3558	1439	4	6.9	1	\N	\N	\N	\N	\N
3559	1439	5	6.64	N/A	\N	\N	\N	\N	\N
3560	1439	6	6.95	N/A	\N	\N	\N	\N	\N
3884	1536	3	7.57	N/A	\N	\N	\N	\N	\N
3885	1536	4	8.2	N/A	\N	\N	\N	\N	\N
3886	1536	5	8.23	N/A	\N	\N	\N	\N	\N
3887	1536	6	8.77	N/A	\N	\N	\N	\N	\N
4240	1576	3	6.39	N/A	\N	\N	\N	\N	\N
4241	1576	4	6.51	N/A	\N	\N	\N	\N	\N
4242	1576	5	7.1	N/A	\N	\N	\N	\N	\N
4243	1576	6	7.3	N/A	\N	\N	\N	\N	\N
5308	1323	1	9	N/A	\N	\N	\N	\N	\N
5309	1323	2	9.77	N/A	\N	\N	\N	\N	\N
5310	1323	3	8.97	N/A	\N	\N	\N	\N	\N
5311	1323	4	8.94	N/A	\N	\N	\N	\N	\N
4964	1546	1	8.5	N/A	\N	\N	\N	\N	\N
4965	1546	2	8.95	N/A	\N	\N	\N	\N	\N
4966	1546	3	7.52	N/A	\N	\N	\N	\N	\N
4967	1546	4	7.9	N/A	\N	\N	\N	\N	\N
4496	1551	1	8.5	N/A	\N	\N	\N	\N	\N
4497	1551	2	9.23	N/A	\N	\N	\N	\N	\N
4498	1551	3	8	N/A	\N	\N	\N	\N	\N
4499	1551	4	8.15	N/A	\N	\N	\N	\N	\N
4500	1551	5	8.23	N/A	\N	\N	\N	\N	\N
4501	1551	6	8.45	N/A	\N	\N	\N	\N	\N
4968	1546	5	7.86	N/A	\N	\N	\N	\N	\N
4969	1546	6	7.45	N/A	\N	\N	\N	\N	\N
5022	1544	1	7.59	N/A	\N	\N	\N	\N	\N
5023	1544	2	8.27	N/A	\N	\N	\N	\N	\N
5024	1544	3	7.52	N/A	\N	\N	\N	\N	\N
5025	1544	4	7.75	N/A	\N	\N	\N	\N	\N
5026	1544	5	7.09	N/A	\N	\N	\N	\N	\N
5027	1544	6	7	N/A	\N	\N	\N	\N	\N
4062	1553	1	5.64	N/A	\N	\N	\N	\N	\N
4063	1553	2	6.77	N/A	\N	\N	\N	\N	\N
4065	1553	4	5.85	N/A	\N	\N	\N	\N	\N
4639	1402	2	7.5	N/A	\N	\N	\N	\N	\N
4640	1402	3	7.5	N/A	\N	\N	\N	\N	\N
4641	1402	4	7.5	N/A	\N	\N	\N	\N	\N
4642	1402	5	7.5	N/A	\N	\N	\N	\N	\N
4643	1402	6	7.5	N/A	\N	\N	\N	\N	\N
4652	1552	3	6.69	N/A	\N	\N	\N	\N	\N
4653	1552	4	7.75	N/A	\N	\N	\N	\N	\N
4654	1552	5	8.68	N/A	\N	\N	\N	\N	\N
4655	1552	6	9	N/A	\N	\N	\N	\N	\N
4066	1553	5	5.64	N/A	\N	\N	\N	\N	\N
4067	1553	6	6.5	N/A	\N	\N	\N	\N	\N
4514	1517	1	8.5	N/A	\N	\N	\N	\N	\N
4515	1517	2	9.64	N/A	\N	\N	\N	\N	\N
4516	1517	3	8.55	N/A	\N	\N	\N	\N	\N
4517	1517	4	8.96	N/A	\N	\N	\N	\N	\N
4518	1517	5	7.86	N/A	\N	\N	\N	\N	\N
4519	1517	6	9.05	N/A	\N	\N	\N	\N	\N
4638	1402	1	7.5	N/A	\N	\N	\N	\N	\N
5053	408	1	9.73	N/A	\N	\N	\N	\N	\N
5054	408	2	9.59	N/A	\N	\N	\N	\N	\N
5055	408	3	8.24	N/A	\N	\N	\N	\N	\N
5056	408	4	8.22	N/A	\N	\N	\N	\N	\N
5075	1404	1	8.45	N/A	\N	\N	\N	\N	\N
5076	1404	2	8.95	N/A	\N	\N	\N	\N	\N
5077	1404	3	8.09	N/A	\N	\N	\N	\N	\N
5078	1404	4	8.2	N/A	\N	\N	\N	\N	\N
5079	1404	5	7.14	N/A	\N	\N	\N	\N	\N
5080	1404	6	7.29	N/A	\N	\N	\N	\N	\N
5095	1530	1	8.09	N/A	\N	\N	\N	\N	\N
5096	1530	2	9	N/A	\N	\N	\N	\N	\N
5097	1530	3	7.87	N/A	\N	\N	\N	\N	\N
3000	655	1	6.2	N/A	\N	\N	\N	\N	\N
3001	655	2	6.3	N/A	\N	\N	\N	\N	\N
3714	1430	1	8	N/A	\N	\N	\N	\N	\N
3715	1430	2	7.82	N/A	\N	\N	\N	\N	\N
3716	1430	3	6.87	N/A	\N	\N	\N	\N	\N
3717	1430	4	5.55	N/A	\N	\N	\N	\N	\N
3393	1386	1	9.32	N/A	\N	\N	\N	\N	\N
2912	1348	1	8.32	N/A	\N	\N	\N	\N	\N
2913	1348	2	9.05	N/A	\N	\N	\N	\N	\N
2914	1348	3	7.62	N/A	\N	\N	\N	\N	\N
2915	1348	4	7.61	N/A	\N	\N	\N	\N	\N
3394	1386	2	9.81	N/A	\N	\N	\N	\N	\N
3395	1386	3	9.43	N/A	\N	\N	\N	\N	\N
3396	1386	4	10	N/A	\N	\N	\N	\N	\N
3397	1386	5	9.59	N/A	\N	\N	\N	\N	\N
3398	1386	6	9.63	N/A	\N	\N	\N	\N	\N
3718	1430	5	6.77	N/A	\N	\N	\N	\N	\N
3719	1430	6	6.68	N/A	\N	\N	\N	\N	\N
3731	1412	1	8.55	N/A	\N	\N	\N	\N	\N
3732	1412	2	7.91	N/A	\N	\N	\N	\N	\N
3733	1412	3	7.91	N/A	\N	\N	\N	\N	\N
3734	1412	4	7.75	N/A	\N	\N	\N	\N	\N
3491	1535	1	9.59	N/A	\N	\N	\N	\N	\N
3492	1535	2	10	N/A	\N	\N	\N	\N	\N
3493	1535	3	9.43	N/A	\N	\N	\N	\N	\N
3494	1535	4	9.45	N/A	\N	\N	\N	\N	\N
3495	1535	5	8.95	N/A	\N	\N	\N	\N	\N
3496	1535	6	9.14	N/A	\N	\N	\N	\N	\N
3509	1566	1	5.91	N/A	\N	\N	\N	\N	\N
3510	1566	2	6.5	N/A	\N	\N	\N	\N	\N
3511	1566	3	6.31	N/A	\N	\N	\N	\N	\N
3512	1566	4	5.8	N/A	\N	\N	\N	\N	\N
3513	1566	5	6.14	N/A	\N	\N	\N	\N	\N
3514	1566	6	6.19	N/A	\N	\N	\N	\N	\N
3735	1412	5	7.55	N/A	\N	\N	\N	\N	\N
2978	1368	1	8.23	N/A	\N	\N	\N	\N	\N
2979	1368	2	8.9	N/A	\N	\N	\N	\N	\N
2980	1368	3	7.6	N/A	\N	\N	\N	\N	\N
2981	1368	4	7.7	N/A	\N	\N	\N	\N	\N
3736	1412	6	7.59	N/A	\N	\N	\N	\N	\N
5255	1324	1	9.32	N/A	\N	\N	\N	\N	\N
4250	1562	1	8.45	N/A	\N	\N	\N	\N	\N
5256	1324	2	9.55	N/A	\N	\N	\N	\N	\N
5257	1324	3	7.76	N/A	\N	\N	\N	\N	\N
4139	1409	1	5.59	N/A	\N	\N	\N	\N	\N
4140	1409	2	6.77	N/A	\N	\N	\N	\N	\N
3789	1564	1	7.86	N/A	\N	\N	\N	\N	\N
3790	1564	2	7.91	N/A	\N	\N	\N	\N	\N
3537	1540	1	9.05	N/A	\N	\N	\N	\N	\N
3538	1540	2	9.59	N/A	\N	\N	\N	\N	\N
3539	1540	3	9	N/A	\N	\N	\N	\N	\N
3540	1540	4	9.6	N/A	\N	\N	\N	\N	\N
3541	1540	5	9.5	N/A	\N	\N	\N	\N	\N
3542	1540	6	9.45	N/A	\N	\N	\N	\N	\N
3791	1564	3	7.61	N/A	\N	\N	\N	\N	\N
3792	1564	4	7.95	N/A	\N	\N	\N	\N	\N
3793	1564	5	7.68	N/A	\N	\N	\N	\N	\N
3794	1564	6	8.27	N/A	\N	\N	\N	\N	\N
3801	1565	1	9.09	N/A	\N	\N	\N	\N	\N
3802	1565	2	10	N/A	\N	\N	\N	\N	\N
3803	1565	3	8.96	N/A	\N	\N	\N	\N	\N
3804	1565	4	9.15	N/A	\N	\N	\N	\N	\N
3805	1565	5	8.55	N/A	\N	\N	\N	\N	\N
3806	1565	6	9	N/A	\N	\N	\N	\N	\N
4141	1409	3	6.65	N/A	\N	\N	\N	\N	\N
4142	1409	4	5.7	N/A	\N	\N	\N	\N	\N
4143	1409	5	6	N/A	\N	\N	\N	\N	\N
4144	1409	6	6	N/A	\N	\N	\N	\N	\N
5258	1324	4	7.09	N/A	\N	\N	\N	\N	\N
4190	1567	1	7.41	N/A	\N	\N	\N	\N	\N
4191	1567	2	8.82	N/A	\N	\N	\N	\N	\N
3821	1541	1	9.09	N/A	\N	\N	\N	\N	\N
3822	1541	2	8.91	N/A	\N	\N	\N	\N	\N
3823	1541	3	8.09	N/A	\N	\N	\N	\N	\N
3024	311	1	8.23	N/A	\N	\N	\N	\N	\N
3025	311	2	7.95	N/A	\N	\N	\N	\N	\N
3824	1541	4	8.54	N/A	\N	\N	\N	\N	\N
3825	1541	5	8.14	N/A	\N	\N	\N	\N	\N
3028	341	1	6.41	N/A	\N	\N	\N	\N	\N
3029	341	2	6.2	N/A	\N	\N	\N	\N	\N
3826	1541	6	8.47	N/A	\N	\N	\N	\N	\N
4192	1567	3	7.35	N/A	\N	\N	\N	\N	\N
4193	1567	4	7.75	N/A	\N	\N	\N	\N	\N
3906	1524	1	7.18	N/A	\N	\N	\N	\N	\N
3907	1524	2	8.77	N/A	\N	\N	\N	\N	\N
3908	1524	3	7.3	N/A	\N	\N	\N	\N	\N
3909	1524	4	7.85	N/A	\N	\N	\N	\N	\N
3910	1524	5	7.32	N/A	\N	\N	\N	\N	\N
3911	1524	6	8.32	N/A	\N	\N	\N	\N	\N
4194	1567	5	7.55	N/A	\N	\N	\N	\N	\N
4195	1567	6	8.36	N/A	\N	\N	\N	\N	\N
4218	1529	1	6.82	N/A	\N	\N	\N	\N	\N
4219	1529	2	7.82	N/A	\N	\N	\N	\N	\N
4220	1529	3	7.22	N/A	\N	\N	\N	\N	\N
4221	1529	4	8.15	N/A	\N	\N	\N	\N	\N
4222	1529	5	7.14	N/A	\N	\N	\N	\N	\N
4223	1529	6	7.14	N/A	\N	\N	\N	\N	\N
4490	1577	1	5.83	N/A	\N	\N	\N	\N	\N
4491	1577	2	5.83	N/A	\N	\N	\N	\N	\N
5315	440	4	5.5	OE	\N	\N	\N	\N	\N
5332	347	1	8.59	N/A	\N	\N	\N	\N	\N
4492	1577	3	5.83	Applied Maths 3, Data Structures Lab, Digital Circuits and Fundamentals of Micro processor	\N	\N	\N	\N	\N
4493	1577	4	6.05	Discrete Maths	\N	\N	\N	\N	\N
4494	1577	5	6.59	N/A	\N	\N	\N	\N	\N
4495	1577	6	6.73	N/A	\N	\N	\N	\N	\N
5333	347	2	7.95	N/A	\N	\N	\N	\N	\N
5312	440	1	7	N/A	\N	\N	\N	\N	\N
5313	440	2	6.78	N/A	\N	\N	\N	\N	\N
5314	440	3	6.5	N/A	\N	\N	\N	\N	\N
4584	1519	1	8.86	N/A	\N	\N	\N	\N	\N
4585	1519	2	9.05	N/A	\N	\N	\N	\N	\N
4586	1519	3	7.65	N/A	\N	\N	\N	\N	\N
4587	1519	4	8.45	N/A	\N	\N	\N	\N	\N
4588	1519	5	8.45	N/A	\N	\N	\N	\N	\N
4589	1519	6	8.18	N/A	\N	\N	\N	\N	\N
4662	1433	1	8.59	N/A	\N	\N	\N	\N	\N
4663	1433	2	8.95	N/A	\N	\N	\N	\N	\N
4664	1433	3	7.09	N/A	\N	\N	\N	\N	\N
4665	1433	4	8.05	N/A	\N	\N	\N	\N	\N
4666	1433	5	8.36	N/A	\N	\N	\N	\N	\N
4667	1433	6	8.45	N/A	\N	\N	\N	\N	\N
5196	417	4	7.96	N/A	\N	\N	\N	\N	\N
5329	1319	2	10	N/A	\N	\N	\N	\N	\N
5330	1319	3	8.48	N/A	\N	\N	\N	\N	\N
5331	1319	4	7.96	N/A	\N	\N	\N	\N	\N
4994	403	1	9.09	N/A	\N	\N	\N	\N	\N
4995	403	2	9.36	N/A	\N	\N	\N	\N	\N
4996	403	3	8.62	N/A	\N	\N	\N	\N	\N
4997	403	4	8.39	N/A	\N	\N	\N	\N	\N
3544	1527	2	6.05	N/A	\N	\N	\N	\N	\N
3545	1527	3	6	N/A	\N	\N	\N	\N	\N
3546	1527	4	6.2	N/A	\N	\N	\N	\N	\N
3547	1527	5	6.78	N/A	\N	\N	\N	\N	\N
3548	1527	6	6.5	N/A	\N	\N	\N	\N	\N
4180	1572	5	6.95	N/A	\N	\N	\N	\N	\N
4181	1572	6	6.82	N/A	\N	\N	\N	\N	\N
3705	1563	4	6.65	N/A	\N	\N	\N	\N	\N
3706	1563	5	7.77	N/A	\N	\N	\N	\N	\N
3707	1563	6	7.86	N/A	\N	\N	\N	\N	\N
4340	1570	1	7.86	N/A	\N	\N	\N	\N	\N
4341	1570	2	8.82	N/A	\N	\N	\N	\N	\N
4342	1570	3	7.39	N/A	\N	\N	\N	\N	\N
4343	1570	4	7.6	N/A	\N	\N	\N	\N	\N
4344	1570	5	7.77	N/A	\N	\N	\N	\N	\N
4345	1570	6	8.41	N/A	\N	\N	\N	\N	\N
4251	1562	2	8.55	N/A	\N	\N	\N	\N	\N
4252	1562	3	7.35	N/A	\N	\N	\N	\N	\N
4253	1562	4	7	N/A	\N	\N	\N	\N	\N
4254	1562	5	7.32	N/A	\N	\N	\N	\N	\N
4255	1562	6	8.09	N/A	\N	\N	\N	\N	\N
4292	1543	1	8.27	N/A	\N	\N	\N	\N	\N
4293	1543	2	8.05	N/A	\N	\N	\N	\N	\N
4294	1543	3	6.74	N/A	\N	\N	\N	\N	\N
4295	1543	4	6.25	N/A	\N	\N	\N	\N	\N
4296	1543	5	7.18	N/A	\N	\N	\N	\N	\N
4297	1543	6	6.82	N/A	\N	\N	\N	\N	\N
5085	1340	1	8.5	N/A	\N	\N	\N	\N	\N
5086	1340	2	9.32	N/A	\N	\N	\N	\N	\N
5087	1340	3	8.24	N/A	\N	\N	\N	\N	\N
5088	1340	4	7.4	N/A	\N	\N	\N	\N	\N
5123	318	1	8.18	N/A	\N	\N	\N	\N	\N
5124	318	2	8.16	N/A	\N	\N	\N	\N	\N
5444	1557	1	7.09	N/A	\N	\N	\N	\N	\N
5177	382	1	8.8	N/A	\N	\N	\N	\N	\N
5178	382	2	8.5	N/A	\N	\N	\N	\N	\N
5179	382	3	7.8	N/A	\N	\N	\N	\N	\N
5180	382	4	7.9	N/A	\N	\N	\N	\N	\N
5185	444	1	5.8	N/A	\N	\N	\N	\N	\N
5186	444	2	5.7	N/A	\N	\N	\N	\N	\N
5187	444	3	6	OOPs	\N	\N	\N	\N	\N
5188	444	4	5.8	N/A	\N	\N	\N	\N	\N
5445	1557	2	7.86	N/A	\N	\N	\N	\N	\N
5446	1557	3	7.09	N/A	\N	\N	\N	\N	\N
5447	1557	4	6.65	N/A	\N	\N	\N	\N	\N
5448	1557	5	7.1	N/A	\N	\N	\N	\N	\N
5449	1557	6	7.14	N/A	\N	\N	\N	\N	\N
5201	983	1	5.81	N/A	\N	\N	\N	\N	\N
5202	983	2	6.77	N/A	\N	\N	\N	\N	\N
5203	983	3	6	N/A	\N	\N	\N	\N	\N
5204	983	4	6	( object oriented programming, database management system)	\N	\N	\N	\N	\N
5454	398	1	8.82	N/A	\N	\N	\N	\N	\N
5455	398	2	8.91	N/A	\N	\N	\N	\N	\N
5456	398	3	7.19	N/A	\N	\N	\N	\N	\N
5209	406	1	9.6	N/A	\N	\N	\N	\N	\N
5210	406	2	9.32	N/A	\N	\N	\N	\N	\N
5211	406	3	8.67	N/A	\N	\N	\N	\N	\N
5212	406	4	8.48	N/A	\N	\N	\N	\N	\N
5213	404	1	9.09	N/A	\N	\N	\N	\N	\N
5214	404	2	9.82	N/A	\N	\N	\N	\N	\N
5215	404	3	8.56	N/A	\N	\N	\N	\N	\N
5216	404	4	8.26	N/A	\N	\N	\N	\N	\N
5217	411	1	8.64	N/A	\N	\N	\N	\N	\N
5218	411	2	9.32	N/A	\N	\N	\N	\N	\N
5219	411	3	8.1	N/A	\N	\N	\N	\N	\N
5220	411	4	8.61	N/A	\N	\N	\N	\N	\N
5457	398	4	8.22	N/A	\N	\N	\N	\N	\N
5464	351	1	7.05	N/A	\N	\N	\N	\N	\N
5229	397	1	7.77	N/A	\N	\N	\N	\N	\N
5230	397	2	9.18	N/A	\N	\N	\N	\N	\N
5231	397	3	8.24	N/A	\N	\N	\N	\N	\N
5232	397	4	9.3	N/A	\N	\N	\N	\N	\N
5465	351	2	7.45	N/A	\N	\N	\N	\N	\N
5466	710	1	7.82	N/A	\N	\N	\N	\N	\N
5467	710	2	8.27	N/A	\N	\N	\N	\N	\N
5470	373	1	6.14	N/A	\N	\N	\N	\N	\N
5471	373	2	5.8	N/A	\N	\N	\N	\N	\N
5472	662	1	6.7	N/A	\N	\N	\N	\N	\N
5473	662	2	6.9	N/A	\N	\N	\N	\N	\N
5482	1369	1	8.01	N/A	\N	\N	\N	\N	\N
5483	1369	2	8.77	N/A	\N	\N	\N	\N	\N
5484	1369	3	7.95	N/A	\N	\N	\N	\N	\N
5485	1369	4	8.47	N/A	\N	\N	\N	\N	\N
5488	316	1	6.7	N/A	\N	\N	\N	\N	\N
5489	316	2	6.3	N/A	\N	\N	\N	\N	\N
5494	314	1	7.23	N/A	\N	\N	\N	\N	\N
5495	314	2	7.68	N/A	\N	\N	\N	\N	\N
5496	409	1	9.64	N/A	\N	\N	\N	\N	\N
5497	409	2	9.55	N/A	\N	\N	\N	\N	\N
5498	409	3	9.1	N/A	\N	\N	\N	\N	\N
5499	409	4	8.75	N/A	\N	\N	\N	\N	\N
5500	1367	1	7.82	N/A	\N	\N	\N	\N	\N
5501	1367	2	8.86	N/A	\N	\N	\N	\N	\N
5502	1367	3	6.52	N/A	\N	\N	\N	\N	\N
5503	1367	4	7.22	N/A	\N	\N	\N	\N	\N
5504	410	1	7.5	N/A	\N	\N	\N	\N	\N
5505	410	2	8.23	N/A	\N	\N	\N	\N	\N
5506	410	3	6.62	N/A	\N	\N	\N	\N	\N
5507	410	4	7.35	N/A	\N	\N	\N	\N	\N
5512	388	1	9.1	N/A	\N	\N	\N	\N	\N
5513	388	2	8.6	N/A	\N	\N	\N	\N	\N
5514	388	3	8.4	N/A	\N	\N	\N	\N	\N
5515	388	4	8.2	N/A	\N	\N	\N	\N	\N
5516	1583	1	7.5	N/A	\N	\N	\N	\N	\N
5517	1583	2	7.6	N/A	\N	\N	\N	\N	\N
5518	1583	3	6.8	N/A	\N	\N	\N	\N	\N
5519	1583	4	7.78	N/A	\N	\N	\N	\N	\N
5536	338	1	8.45	N/A	\N	\N	\N	\N	\N
5537	338	2	8.77	N/A	\N	\N	\N	\N	\N
5538	329	1	7.14	N/A	\N	\N	\N	\N	\N
5539	329	2	7.68	N/A	\N	\N	\N	\N	\N
5540	327	1	8.95	N/A	\N	\N	\N	\N	\N
5541	327	2	9.41	N/A	\N	\N	\N	\N	\N
5550	1383	1	8.25	N/A	\N	\N	\N	\N	\N
5551	1383	2	8.25	N/A	\N	\N	\N	\N	\N
5552	1383	3	8.05	N/A	\N	\N	\N	\N	\N
5553	1383	4	8.43	N/A	\N	\N	\N	\N	\N
5562	1370	1	9.77	N/A	\N	\N	\N	\N	\N
5563	1370	2	9.91	N/A	\N	\N	\N	\N	\N
5564	1370	3	9.38	N/A	\N	\N	\N	\N	\N
5565	1370	4	8.7	N/A	\N	\N	\N	\N	\N
5570	438	1	8.14	N/A	\N	\N	\N	\N	\N
5571	438	2	8.14	N/A	\N	\N	\N	\N	\N
5572	438	3	8.14	N/A	\N	\N	\N	\N	\N
5573	438	4	8.7	N/A	\N	\N	\N	\N	\N
5578	1330	1	9	N/A	\N	\N	\N	\N	\N
5579	1330	2	9.7	N/A	\N	\N	\N	\N	\N
5580	1330	3	7.9	N/A	\N	\N	\N	\N	\N
5581	1330	4	7.5	N/A	\N	\N	\N	\N	\N
5594	339	1	6.91	N/A	\N	\N	\N	\N	\N
5595	339	2	7.95	N/A	\N	\N	\N	\N	\N
5600	981	1	7	N/A	\N	\N	\N	\N	\N
5601	981	2	7	N/A	\N	\N	\N	\N	\N
5602	981	3	6	N/A	\N	\N	\N	\N	\N
5603	981	4	7	N/A	\N	\N	\N	\N	\N
5610	1358	1	8.02	N/A	\N	\N	\N	\N	\N
5611	1358	2	8.14	N/A	\N	\N	\N	\N	\N
5612	1358	3	7.9	N/A	\N	\N	\N	\N	\N
5613	1358	4	7.6	N/A	\N	\N	\N	\N	\N
5675	1343	1	9.34	N/A	\N	\N	\N	\N	\N
5676	1343	2	9.77	N/A	\N	\N	\N	\N	\N
5677	1343	3	8.65	N/A	\N	\N	\N	\N	\N
5678	1343	4	8.32	N/A	\N	\N	\N	\N	\N
5683	1685	1	9	N/A	\N	\N	\N	\N	\N
5684	1685	2	9	N/A	\N	\N	\N	\N	\N
5685	1685	3	9	N/A	\N	\N	\N	\N	\N
5686	1685	4	9	N/A	\N	\N	\N	\N	\N
5687	414	1	8.32	N/A	\N	\N	\N	\N	\N
5688	414	2	8.95	N/A	\N	\N	\N	\N	\N
5689	414	3	8.1	N/A	\N	\N	\N	\N	\N
5690	414	4	7.7	N/A	\N	\N	\N	\N	\N
5703	1052	1	6.95	N/A	\N	\N	\N	\N	\N
5704	1052	2	8.86	N/A	\N	\N	\N	\N	\N
5705	1052	3	7.48	N/A	\N	\N	\N	\N	\N
5706	1052	4	7.95	N/A	\N	\N	\N	\N	\N
5810	342	3	9.68	COA, DCFM \n[[KYS_META]]{"season":"Winter","year_of_passing":2025,"college_rank":"1","academic_awards":""}	\N	\N	\N	\N	\N
5809	342	2	9.36	STATISTICS, DT, EP\n[[KYS_META]]{"season":"Summer","year_of_passing":2025,"college_rank":"3","academic_awards":""}	\N	\N	\N	\N	\N
5808	342	1	9.27	ALGEBRA, IKS\n[[KYS_META]]{"season":"Winter","year_of_passing":2024,"college_rank":"2","academic_awards":"best performer"}	\N	\N	\N	\N	\N
5811	342	4	10	3\n[[KYS_META]]{"season":"Summer","year_of_passing":2026,"college_rank":"1","academic_awards":"departmental"}	\N	\N	\N	\N	\N
\.


--
-- Data for Name: project; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project (id, student_id, title, description, project_guide) FROM stdin;
594	1407	Intelligent Tsunami Prediction System	Developing a machine learning-based Tsunami Prediction System using Python to forecast risks from seismic data, applying algorithms like Logistic Regression, Random Forest, and SVM, with a planned real-time interface for disaster preparedness.	\N
60	372	College website	N/A	\N
595	1407	Amazon Stock market prediction	Built a stock market prediction model for Amazon using machine learning techniques to forecast future stock prices based on historical data, improving decision-making insights for investors.	\N
174	1318	Solar Panel Extraction from Satellite Imagery	Developed a YOLOv8 based model with Sayali Bambal to detect solar panels in satellite imagery. Trained on 1600 plus images for environmental applications. Plan to improve dataset and model. Code on GitHub.	\N
464	1390	Employee Salary prediction system using ML	Employee Salary Prediction using ML– Built a salary prediction model to estimate pay based on job title, experience, education, andlocation. Cleaned and prepared the data, explored trends, and engineered features for better insights.	\N
465	1390	•\tEcommerce Analyst Dashboard	Build the interactive dashboard which enable user to track the ecommerce item buying across the india, and this helps to improve business quality.., etc using different graph and charts like bar graph, density graph, pie chart, etc	\N
480	1363	YouTube clone	Website	\N
175	1318	FraudGuard	FraudGuard AI ML speaker identification system using CNN to prevent voice fraud. Achieved 76.8 percent accuracy with MFCCs. Selected for IIITH Internship. Dataset 8 speakers 1500 recordings. Code on GitHub.	\N
481	1363	DBMS mini Project	Restaurant table booking system	\N
972	417	Captha genration	N/A	\N
178	405	Innoconnect	A website for college students to get connected with each other	\N
179	405	Virtual shoe try on	To try shoes virtualy for best appearence	\N
602	1558	School Website	The Avadh School, Lucknow	\N
603	1558	Brain Tumor Detection	Detecting Brain Tumor Using Hybrid Technology	\N
606	1337	Hate speech detention website	N/A	\N
607	1337	Dbms project on hotel booking management system	N/A	\N
184	380	FraudGuard	FraudGuard AI ML speaker identification system using CNN to prevent voice fraud. Achieved 76.8 percent accuracy with MFCCs. Selected for IIITH Internship. Dataset 8 speakers 1500 recordings. Code on GitHub.	\N
79	436	Alumini connect	Alumni Connect Website	\N
80	436	Paper Bank	Previous Year Paper Sharing Platform – A web app for students to upload and download previous year question papers with organized storage	\N
185	380	Solar Panel Extraction from Satellite Imagery	Developed a YOLOv8 based model with Sayali Bambal to detect solar panels in satellite imagery. Trained on 1600 plus images for environmental applications. Plan to improve dataset and model. Code on GitHub.	\N
610	1381	healthcare chatbot	a predefined chatbot which guesses the disease based on symptoms	\N
83	381	Coffee Shop Sales Analytics	• Developed interactive dashboard analyzing 50K+ transactions across 10 locations • Created SQL queries to identify sales trends and customer behavior patterns • Reduced inventory waste by 15% through data-driven recommendations.	\N
84	381	Twitter Analytics Dashboard	• Built sentiment analysis tool processing 10K+ daily tweets • Automated reporting workflows, saving 60% manual effort • Visualized engagement metrics to optimize posting schedules.	\N
187	1394	Smartchain Solutions: Tackling Counterfeit Detection and Supply Chain Challenges using Blockchain	a blockchain-based approach to detect counterfeit products and improve supply chain tracking is presented.	\N
611	1381	ngo management system	N/A	\N
973	417	Retail ai	N/A	\N
89	698	-	N/A	\N
90	698	-	N/A	\N
191	1344	FitSphere – A Community-Driven Fitness and Wellness Platform	Developed a community-driven fitness and wellness website that helps users track activities, join challenges, and access curated health resources.	\N
193	332	College Website	I have developed a college website that provides information about courses, faculty, campus life, admissions, and news. It is designed to make navigation easy and help students, staff, and visitors access important details in one place.	\N
628	443	Driver drowsiness detection system	Driver drowsiness detection system is a iot based project	\N
706	1563	College Chatbot using LLM + RAG	Developed an AI-powered chatbot for the college website using LLM and Retrieval Augmented Generation (RAG) for answering FAQs related to  academics, hostel, library, and campus rules.	\N
707	1563	E-Commerce Web Store (Django + Bootstrap)	Built a complete online shopping platform with user authentication, product search & filters, cart management, and order history using Django  and Bootstrap.	\N
115	687	No	--	\N
116	687	No	--	\N
134	709	Website creation in DESCAM internship	Website created with mobile+ laptop responsive,	\N
135	709	Chatbot	Made a simple chatbot	\N
138	671	portfolio website	I created a personal portfolio website using HTML, CSS, and JavaScript to showcase my skills. It includes About, Projects, and Contact sections, with responsive design and small front-end projects like a to-do list and calculator.	\N
139	671	credit score prediction system	currently working	\N
142	1322	City bus tracker	Tracking the city buses for ease of student	\N
143	1322	Ruled based chatbot	Chatbot for students so they can acess webiste easily	\N
148	1325	Pharmacy website	Helps in online dilevery of medicines	\N
149	1325	Sign language interpreter	Real time system helps in converting sign language in text	\N
163	1372	Pharmacy website	N/A	\N
164	1372	Road lane detection project	N/A	\N
167	1332	Personal Chatbot	Helps to gain knowledge information	\N
169	336	STUDYSHPERE (Student related resource website)	A fully functional platform providing students access to notes, PYQs, video lectures, and timetables with a feedback section. Built with modern web tech and deployed on Netlify for smooth navigation.	\N
596	442	FarmCure	AI-powered farming assistant that detects crop diseases using Firebase ML Kit and provides treatment solutions via Gemini API to help farmers take timely action."	\N
597	442	EdTech	Developed an AI-powered EdTech app in Android (Java) with chat-based interface, Flask backend, and API integration for query resolution and teacher support	\N
448	1406	Twitter clone using solidity	Built smart contract enabling decentralized micro-posting on Ethereum	\N
449	1406	Voting system using solidity Blockchain	Developed secure voting dApp for tamper-proof elections on Ethereum	\N
295	416	Smart parking system	The Smart Parking System is an loT-based solution designed to optimize parking space usage by detecting available slots in real-time and guiding users to park efficiently.	\N
296	416	Home security surveillance system	The Home Security Surveillance System uses a PIR sensor to detect motion and instantly sends alerts to the user's mobile app for enhanced safety.	\N
614	1547	Weather App	I created a responsive Weather App using HTML, CSS, and JavaScript that fetches live weather data from the OpenWeatherMap API. The app lets users search any city to instantly view temperature, humidity, wind speed, and conditions, all displayed in a clean and user-friendly interface.	\N
615	1547	Chatting Application	I developed a simple real-time chatting application using socket programming to enable two-way communication between users over a network. The client-server architecture was implemented, where the server handled multiple client connections using threads. The application allows users to send and receive messages instantly in a command-line interface. This project helped me understand the fundamentals of network communication, multi-threading, and socket-based data transfer.	\N
330	1376	Password Manager App	N/A	\N
331	1376	Endless Runner Game	N/A	\N
341	1329	Inventory Management System	It is a software solution that helps track and manage stock, purchases, and sales. It maintains supplier and customer records, updates inventory in real-time, prevents overstocking, and generates reports.	\N
342	1329	Stock Price Prediction and visual Analysis	It is a data-driven system that uses historical stock market data and machine learning techniques to forecast future stock prices. It provides interactive visualizations such as trend graphs and comparison charts to help users analyze patterns	\N
468	418	Students Expenses Management System	A web based application for students to manage their expenses and savings it's also ment for students who study on student loan	\N
469	418	Women SOS safety alert system	In case of any emergency this SOS safety alert system will automatically generate a SOS notice to desired Close ones	\N
626	1427	Detection and Prevention of SQL Injection	N/A	\N
631	1578	Forest fire detection using Machine learning	"Our system uses machine learning with a camera-equipped hardware device to detect forest fires in real time. The camera continuously monitors the forest area, and the ML model processes the captured images to identify smoke or flames early, enabling faster alerts and prevention of large-scale damage.	\N
384	1373	Hackathon Project	Built a computer vision model using YOLO and OpenCV to detect solar panels from satellite imagery. Focused on improving detection accuracy .	\N
385	1373	IIT Bombay Project	Built and competed with a manually controlled gripper robot capable of pick and place operations. Focused on mechanical design, control integration, and optimizing performance for speed.	\N
649	1389	LandParser: Intelligent Land Boundary Detection and Encroachment Analysis Using Deep Learning with Satellite Imagery	LandParser is a geo-intelligent system designed to automate land management through satellite imagery and deep learning. The project focuses on accurately detecting land parcel boundaries, identifying encroachments, and integrating ownership and land value data into an interactive dashboard. By leveraging advanced image segmentation models and geospatial analytics, LandParser addresses key challenges such as delayed encroachment detection, fragmented land records, and inefficient manual monitoring. The outcome is a scalable solution that enhances transparency, supports policy decisions, and empowers stakeholders with real-time insights into land use and ownership patterns in Nagpur and beyond.	\N
494	420	Air Quality Monitoring system	Designed and built an IoT system to monitor real-time air quality (VOCs, CO2) and environmental data (temperature, humidity).	\N
418	1422	AI-driven proctoring system	"An AI-driven proctoring system that uses face recognition, eye tracking, and behavior analysis to prevent malpractice, ensure fairness, and provide secure online examinations in a scalable and cost-effective way."	\N
495	420	Face Mask Detection system	Implemented a machine learning-based model to detect whether a person is wearing a mask.	\N
505	1317	Password Manager app	N/A	\N
904	1577	AI Powered Gym Instructing Application	An application that guides the user to carry out exercises accurately	\N
905	1577	A 4WD ATV	A 4WD All Terrain Vehicle built for the competition BAJA SAE INDIA	\N
522	1421	Rag retrieval system	FastAPI, Gemini embeddings, Pinecone, and PDF processing	\N
523	1421	Zero Knowledge Proof circuits integrated with MLP models for healthcare	protostar and protogalaxy on federated leaqrning	\N
993	348	--	--	\N
994	348	--	--	\N
838	1573	Research Agent	AI-powered assistant built with Python, Flask, and Streamlit to fetch and display research papers via arXiv API  Features include NLP querying, CSV export, and interactive UI for students and researchers	\N
568	655	Blood donation management system	N/A	\N
839	1573	Village Connect	Python-based web application developed during internship at Code Core Global  Aimed to improve communication and access to resources for rural communities with a user-friendly interface and backend support	\N
590	1545	Design and Implementation of an LLM + RAG Chatbot for Institutional Knowledge Retrieval	Developed a chatbot integrating Large Language Models with Retrieval-Augmented Generation (RAG) for a college website, enabling accurate query responses by extracting information from unstructured institutional documents.	\N
591	1545	AI/ML-based Cloud Cluster Detection using INSAT Satellite Data	Developed a SegFormer-based deep learning model to detect, segment, and track tropical cloud clusters using half-hourly INSAT satellite data, improving accuracy in real-time monitoring and supporting atmospheric research.	\N
203	435	Convertio	Developed   a web-based application , designed to  simplify number system conversions. Users can input numbers in one system and receive conversions to other systems.	\N
204	435	Research Literature Portal	Built a web-based academic platform “RESEARCH LITERATURE PORTAL”, literature review platform that curates and presents structured literature reviews on the application of machine learning in the financial domain.	\N
599	1424	AI powered crop disease detection mobile app	AI powered crop disease detection mobile app s an useful application for farmers which help them monitor their crop disease. It take image of infected crop as an input and predict disease name as the output.	\N
1015	398	MENTAL HEALTH TRACKER	Built an NLP-powered sentiment analysis pipeline in Python using NLTK and VADER to classify user text  into emotional risk levels based on keywords and sentiment score.	\N
1016	398	VIRTUAL SHOE TRY-ON	Designed and developed a real-time virtual shoe try-on system using React, Three.js, TensorFlow, and  8th Wall, integrating 3D models with foot tracking for AR-based user interaction.	\N
1049	1370	Canteen food order App	The Canteen Food Order App is an Android application built using Kotlin that allows users to browse menu items in a home fragment and add them to a cart, which is displayed in a separate cart fragment for order review. The app uses a simple fragment-based navigation flow, mimicking a real canteen ordering process where users can select food items, manage their selections, and prepare for checkout. This project helped me learn about Android fragments, data passing between screens, and basic state management, serving as a foundation for building more advanced food-ordering or e-commerce style apps.	\N
456	1391	Ai based Image and Video Retreival System	It can Retrive Images and Videos from the Storage based on Query that we will give as Input	\N
457	1391	Expense Tracker	It will help to track the expense and It will provide all the insights of our spending through user friendly Interface	\N
326	1336	Expense calculator	N/A	\N
327	1336	Fitnesss	N/A	\N
332	360	Flutter basic	Made an app which has calculator, todo list Rock paper game	\N
333	360	Jounrnal writing app	Where you can write journal as a diary	\N
343	1346	Online quiz management system	N/A	\N
344	1346	Agricinnect website	N/A	\N
618	1549	Smart Speed Breaker-Based Energy Harvesting and Monitoring System	Developed an IoT-based system to harvest energy from vehicular pressure using piezoelectric discs, with power management via TP4056 and boost converters. Powered ESP32 for real-time monitoring with INA219 sensor and enabled wireless data visualization on a cloud dashboard.	\N
623	1440	Food delivery application	A food delivery application that allows users to explore restaurants, view menus, place orders, make secure payments, and track deliveries in real time, offering a fast, convenient, and reliable way to enjoy meals at their doorstep anytime.	\N
624	1440	Proctoring system	An online proctoring system that monitors exams using webcam, mic, and screen tracking, detects suspicious activities with AI, ensures exam integrity, and provides secure, fair, and reliable remote assessments for candidates.	\N
386	425	Scoliosis detection system	N/A	\N
387	425	Smart notice board	N/A	\N
740	1434	Land Parser: A GIS tool using Deep Learning and Satellite Imagery	Land boundary detection, encroachment analysis, and land price prediction using deep learning models likeCNN,SAM, and XGBoost	\N
741	1434	Genshin Impact Game Lore Fan Website	Lore-rich game website with responsive UI/UX.	\N
510	1380	Ngo management system	Built an NGO management software to handle donor/volunteer records, track funds, and generate reports, improving efficiency and transparency in NGO operations.	\N
511	1380	Healthcare chatbot	Created an AI-powered chatbot using Python and NLP that provides health tips, symptom-based suggestions, and first-aid guidance, enhancing quick access to healthcare information.	\N
632	1386	Image processing using Sar	N/A	\N
633	1386	LandParser: Intelligent Land Boundary Detection and Encroachment Analysis Using Deep Learning with Satellite Imagery	N/A	\N
791	691	real time sign language translator into audio and text	A real-time sign language translator that converts gestures into both text and audio, enabling seamless communication between hearing-impaired individuals and others. It bridges the gap by making conversations more inclusive and accessible.	\N
519	1432	Socially Application	Next.js, PostgreSQL, Prisma, Clerk, TypeScript, Tailwind CSS, Shadcn.	\N
520	1432	RealTime Chat Application	MERN, Socket.io, TailwindCSS, Daisy UI, Zustand	\N
527	1350	BMI Calculator	N/A	\N
840	1576	Frontend Devloper	Worked as an intern for 6 Months	\N
841	1576	Web Devloper	1 month summer intern	\N
537	1413	Zenith Website	website for zenith forum	\N
538	1413	Hod detection system	detects hod from face	\N
565	1368	Solar detection system	N/A	\N
566	1368	Ai avatar chat bot	N/A	\N
644	1561	Image Detection and recognition of missing person	Image detection and recognition of missing persons uses AI to analyze faces from photos or CCTV and match them with missing person databases, helping authorities quickly trace and identify individuals.	\N
578	1548	Multimodal Hands-Free Navigation App For Android	Built an Android app for hands-free navigation using eye tracking, head pose, and voice commands.	\N
579	1548	AI/ML driven automated feature detection and change analysis of glacial lakes from multi-source satellite imagery.	Built a hybrid GLNet + Attention U-Net model for automated glacial lake detection and change analysis. Worked with multi-source satellite data (LISS-III/IV, Landsat, Sentinel) for geospatial ML feature extraction.	\N
645	1561	Online Voting System	-Developed a secure online voting platform using  Python (Flask), SQL, HTML, CSS, with features like user authentication,  real-time vote counting, and data validation for election integrity.	\N
660	1535	Weather Application	Created a react based weather Application which give weather condition for particular region based on input.	\N
661	1535	Blood group detection using fingerprint	Here we aim to develop blood group detection using fingerprint using AI-ML.	\N
703	1579	fire forest detection	through this project we will be detecting fire earlier	\N
452	1444	2-Wheeler Garage Jobs System	Web app built with Spring & MySQL to manage customers, vehicles, service jobs, and history. Includes auto reminders every 3 months and an admin dashboard for streamlined garage operations.	\N
453	1444	Product Admin System  for Mobile Shop	Java Spring Boot with JPA , HTML, CSS, JavaScript, Bootstrap  MySQL	\N
885	1516	Time-series data analysis model	N/A	\N
886	1516	Weather prediction app	N/A	\N
472	1414	Journaling Application	Developed a personal project focusing on data management and user requirements Implemented CRUD operations with attention to data consistency and validation Tested and documented API endpoints, ensuring reliable data flow	\N
473	1414	ShareSplit	Built a full-stack application that manages shared expenses and calculates settlements	\N
476	1387	Blockchain-Based Counterfeit Product Detection System	Led the design and development of a blockchain-based supply chain solution  using Ethereum, DID, and smart contracts to prevent counterfeiting and enhance product traceability	\N
224	1429	Intelligent Tsunami Forecasting System	Tsunami forecasting using machine learning and Streamlit.	\N
477	1387	QR-Based Ownership Transfer Prototype	Developing a blockchain + QR-based solution for secure ownership transfer  in consumer electronics to enhance supply chain transparency, prevent counterfeiting, and enable a clean, hassle-free transfer  experience.	\N
226	387	Healthcare website	Built using  Node.js, Express, EJS, MySQL/MongoDB, Bootstrap, the project demonstrates end-to-end development including frontend, backend, and database integration.	\N
318	1378	card memory game	N/A	\N
319	1378	AI tools website	N/A	\N
231	407	EcoLoop AI	An AI-powered Circularity Intelligence Platform for Zero-Waste Retail Management – built for Walmart Sparkathon 2025.	\N
232	407	RetailRival AI	An AI-powered tool for competitive retail analytics, built for a hackathon.	\N
654	1560	Psybridge	Built a multilingual platform for MBTI profiling and mental health screening using NLP (SBERT, MiniLMv6), enabling accurate personality classification and psychological evaluations.	\N
655	1560	Personalized Recommendation System	Developed content-based and collaborative filtering recommendation models in Python, leveraging similarity metrics and user–item interactions to improve personalization and accuracy.	\N
662	1556	AI-Driven Real-Time Sign Language Recognition System	Developed a Python-based system to recognize Indian Sign Language (ISL). Integrated webcam input to detect and display real-time sign gestures with a GUI application. Built custom dataset support and implemented character accumulation to form words dynamically. Technologies used: Python, OpenCV.	\N
663	1399	Entity Targeting Module	Developed a custom module for Minecraft that filters and tracks in-game entities using name tags. Implemented lightweight reverse engineering techniques to interact with the game’s internal entity system, enabling efficient entity identification and pathing.	\N
664	1399	Automated Campaign Optimizer	Built a software solution leveraging the Amazon Ads API to automatically adjust ad campaigns and generate performance reports. Reduced manual overhead by automating campaign optimization and reporting workflows, improving both efficiency and decision-making for marketing strategies.	\N
355	1352	Stock Price Prediction and Visual Analysis Tool	Developed a web app to predict stock prices using ML models like Linear Regression, SVM, KNN, XGBoost, and CatBoost. Integrated real-time data with Yahoo Finance and Alpha Vantage.	\N
356	1352	Course Automation System	Created an automation tool to manage course tasks like attendance, assignments, and notifications. Used Python with database integration to reduce manual effort and boost productivity for students and faculty.	\N
363	400	Virtual library website	Search, download and read books.	\N
372	379	Online Voting System	The Online Voting System is a secure web-based platform designed to digitalize the election process. It allows registered voters to log in, view candidate details, and cast their votes online while ensuring one person can vote only once.	\N
373	379	Airbnb website	The Airbnb Frontend project is a React-based web application that replicates the core user interface of Airbnb.	\N
376	1366	Ecommerce website	Created frontend by using html,css,js	\N
377	1366	Chat bot	Created using npm,js	\N
256	428	Face mask detection system	The CNN based face mask recognition software that accurately identifies masked and unmasked faces, typically suitable for hospitals and public areas where wearing mask is compulsion.	\N
257	428	Cosmetics website	The e commerce cosmetic website that offers wide range of choices  for lipsticks and foundations as per users needs and customizable.	\N
530	383	AI-Based Scoliosis Detection System	Ml Based project	\N
531	383	Water level monitoring system in UBA	Implemented prototype to solve the real life problems of villagers	\N
399	421	Personal Expense Tracker	Developed a web-based expense tracker using HTML, CSS, and JavaScript to manage and visualize daily expenses efficiently.	\N
400	421	HTML To-Do List	Built a responsive to-do list web app using HTML, CSS, and JavaScript with task history and user-friendly design.	\N
532	399	Entry Ease	Automated Gatepass system	\N
535	1349	Book Summary Website	A web platform that provides concise and easy-to-read summaries of books, helping users quickly grasp key insights and ideas. The website is designed with a simple interface for browsing, searching, and reading summaries.	\N
536	1349	Smart Class Surveillance System	An AI-powered classroom monitoring system that detects inappropriate student activities such as mobile usage, sleeping, and unnecessary talking, and alerts faculty through notifications or a buzzer.	\N
575	333	Mindroid - Departmental Digital Magazine	Developed a Digital Magazine Website featuring carousel homepage, archives, events gallery, and flipbook magazines with quick navigation tabs aimed at creating an engaging, eco-friendly, and accessible platform for college publications.	\N
667	1540	Decentralised Voting System using Blockchain	A decentralized voting system uses blockchain to securely record and verify votes without relying on a single authority. Smart contracts handle voter authentication, vote casting and ensuring transparency, integrity, and tamper-proof outcomes.	\N
668	1540	Object Detection System	An object detection system spots and locates objects in images. Using YOLO for quick, accurate detection and OpenCV to draw bounding boxes and labels, it makes identifying objects fast and clear.	\N
1069	346	Healthease	Personal health care ai	\N
727	1564	Smart Traffic Management Alert System for Medical Emergencies Using IoT	This project presents an IoT-based Smart Traffic Management System specifically designed to assist ambulances   during medical emergencies. The goal is to minimize response times by dynamically controlling traffic signals  and providing a clear, uninterrupted route for emergency vehicles.The system integrates GPS-enabled   ambulances, microcontroller-controlled traffic signals, and cloud-based processing. When an ambulance   approaches an intersection, the system automatically turns the signal green.	\N
729	1565	Beast Sentinel – IoT-Based Animal Intrusion Collar	Designed a smart collar system using ESP32, GSM, and GPS modules to prevent wild animal intrusions in rural areas. Features real-time alerts via SMS/phone calls and location tracking to assist forest officers and safeguard villagers. Focuses on Nov 2022 – Present Nagpur, India June 2025 – Juy 2025 2025 Rajas Tarapure - Page 1 of 2 affordability, long-range communication, and scalability over traditional electric fencing or camera traps. Tools Used: Arduino, Flutte	\N
1070	346	College & student tasks manager website	Website for students	\N
879	1515	Weather Forcasting	N/A	\N
734	1541	Indian Meteorological society - Nagpur Chapter official website	I developed the official website for the Indian Meteorological Society – Nagpur Chapter, aimed at serving as a dynamic platform for information sharing, member engagement, and public outreach. The website was built with a modern tech stack (HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB) and features modules such as dynamic event management, committee member profiles, publications, gallery, membership forms, and educational resources. It ensures responsiveness, user-friendliness, and secure admin access for content management, enabling real-time updates of events, announcements, and resources. This project not only strengthened the digital presence of the IMS Nagpur Chapter but also improved accessibility to meteorological knowledge, fostering collaboration among professionals, researchers, and students.	\N
735	1541	Crowdsourced disaster relief platform	The Crowdsourced Disaster Relief Platform is a web and mobile application designed to connect affected individuals, volunteers, NGOs, and authorities during natural disasters and emergencies. It enables people to submit real-time help requests (food, shelter, medical aid, rescue), which are then categorized, geo-tagged, and displayed on an interactive map for quick response. The platform includes features like user authentication, request filtering, admin dashboards for verifying and managing reports, and integration with external data sources for situational awareness. Built with a modern full-stack architecture, it emphasizes scalability, security, and ease of use, ensuring timely coordination of relief efforts and fostering community-driven disaster management.	\N
742	1393	NADI PARIKSHA: Bridging Ancient Ayurveda with Modern Sensor Technology	Collected real-time pulse data for Vata, Pitta, and Kapha; performed feature extraction, Built a stacking ensemble ML model achieving 94.74% dosha classification accuracy, Deployed on Raspberry Pi for edge data acquisition and cloud integration for remote diagnosis.	\N
743	1393	FACE DETECTION & RECOGNITION SYSTEM	Developed real-time face detection (Haar Cascade) and recognition (LBPH) with dynamic user enrollment, achieving 100 ms/frame and robust performance across lighting/orientations.	\N
792	691	real time weather forecast and healt issues with it project	A real-time weather forecasting system that provides current weather updates and predicts possible health risks such as heatstroke, allergies, or respiratory issues. It helps users stay safe by combining accurate weather data with health awareness.	\N
880	1515	Chat Application	N/A	\N
806	1409	Netflix recommendations project	typically a data science or machine learning project aimed at building a system similar to Netflix's recommendation engine to suggest movies and TV shows to users based on their preferences and viewing history	\N
807	1409	Forest Fire Detection	It involve an Internet of Things (IoT) based system with physical sensors (like temperature, humidity, or gas sensors) and a microcontroller to transmit alerts, or a computer vision-based deep learning approach using convolutional neural networks (CNNs) to detect fires and smoke from images or aerial footage.	\N
821	1567	Smart IOT based wildlife tracking and intrusion alert system	Designed a smart collar system using ESP32, GSM, and GPS modules to prevent wild animal intrusions in rural areas, features real-time alerts via SMS/phone calls, and location tracking to assist forest officers and safeguard villagers Focus on affordability, long-range communication, and scalability over traditional electric fencing or camera traps.	\N
830	1529	Movie Recommendation System	Built a content-based movie recommendation platform with Streamlit for user-friendly interaction.Used cosine similarity and metadata (genre, cast, release year, rating) to generate personalized suggestions.Integrated The Movie Database (TMDb) API to fetch real-time posters and metadata.	\N
831	1529	AI Driven Helmet and Seatbelt Detection System	Created a safety compliance system to detect helmet and seatbelt violations from video using YOLOv8 and OpenCV. Focused on road safety and intelligent transportation with real-time alerting. Utilized deep learning and computer vision for image/video processing.	\N
889	1533	Multimodal AI-Based Hands-Free Android Navigation Using Eye, Head, and Voice  Control	Developed an AI-powered Android system for hands-free smartphone navigation to improve accessibility.-Implemented real-time head pose classification using MobileNetV2 and custom datasets. Used MediaPipe for landmark detection and  OpenCV for preprocessing.-Integrated TensorFlow model to classify 5 head directions.. Built Android app in Android Studio (Kotlin/Java) for real-time control.	\N
890	1533	Stock Market Price Prediction Using LSTM	Developed a time series forecasting model to predict future stock prices.-Trained on historical stock data, achieving over 92% short-term prediction accuracy.-Implemented feature engineering, normalization, and data visualization.	\N
892	1514	AI based gym management system	The project uses a camera to see a person doing an exercise and it provides real time feedback to correct the posture if incorrect.	\N
669	1527	College Website Chatbot (Navi) using LLM+RAG	Built an AI-powered chatbot called "Navi" that: 1) Answers real questions about our college 2) Fetches data from real documents (like PDFs, Word files, HTML pages) 3) Is deployed on the main page of the college website	\N
670	1527	n/a	N/A	\N
744	1568	Modelmate	AI- powered UML diagram generator	\N
745	1568	Flower Detection CNN	Tensorflow-based image classification model	\N
749	1536	AI Driven Helmet and Seatbelt detection System	This project is a hierarchical helmet and seatbelt detection system designed to enhance road safety by automatically monitoring whether vehicle occupants are wearing helmets and seatbelts using computer vision and deep learning models.	\N
1012	1557	Brain Tumor Detection Using Hybrid Approach	Brain Tumor Detection and Classification Model using Hybrid Approach. Scans MRI images of patient’s brains and provides Heat-Map which highlights the tumor region and provides a conclusive report stating its presence, classification, danger and dimensions. Currently fine-tuned InceptionV3, ResNet 50 and VGG 16 model.	\N
687	1555	Library Management System	Developed a Java-based Library Management System integrated with MySQL database to manage books, users, and transactions. Implemented core features such as user registration/login, book issue/return tracking, search functionality, and database CRUD operations, ensuring efficient library operations and data consistency.	\N
688	1555	LLM+RAG Chatbot for College Website	-\tDeveloped a chatbot using Mistral 7B and FAISS vector retrieval for college-related Q&A.      -\tEmbedded questions using all-MiniLM-L6-v2 and implemented semantic search.      -\tDesigned prompt formatting, retrieval pipeline, and CLI interface.  - Demonstrated LLM, RAG, vector DB, and NLP deployment skills.	\N
693	1542	Smart Traffic Management  System for Medical Emergencies Using IoT	This project presents an IoT-based Smart Traffic Management System specifically designed to assist ambulances  during medical emergencies. The goal is to minimize response times by dynamically controlling traffic signals and providing a clear, uninterrupted route for emergency vehicles.The system integrates GPS-enabled  ambulances, microcontroller-controlled traffic signals, and cloud-based processing. When an ambulance  approaches an intersection, the system automatically turns the signal green.	\N
694	1417	Nadi Pariksha	Developed an AI-sensor based system that integrates Ayurvedic pulse diagnosis with modern analytics. Used ensemble learning models to detect Tridoshic imbalances and predict potential health disorders.	\N
695	1417	Object Detection Using Python	Implemented object detection using YOLOv4 and OpenCV to accurately identify, classify, and localize objects in images and videos.	\N
760	1559	Brain Tumor Detection using Hybrid Approach	Developed a hybrid deep learning model for brain tumor detection that integrates CNN and Vision Transformer (ViT) architectures to achieve higher accuracy. The system not only detects and classifies tumors but also generates heatmaps highlighting affected regions and provides a detailed diagnostic report for medical use	\N
761	1559	Web Vulnerability Scanner	Detects common web vulnerabilities like SQL Injection, XSS - Scans URLs and input fields for malicious payloads, generates detailed reports of vulnerable endpoints, uses multi-threading for fast concurrent scanning	\N
780	1538	Laboratory Management System	MedLab Pro is a comprehensive Laboratory Management System designed to streamline laboratory operations, patient management, and test result tracking. Built with modern web technologies, it provides an intuitive interface for healthcare professionals to manage patient data, conduct tests, and generate reports efficiently.	\N
781	1538	AI Powered Stress and Confidence Analyzer	This project is an intelligent tool designed to analyze and provide real-time feedback on a user's stress and confidence levels. By leveraging machine learning, the system processes vocal biomarkers (such as pitch, tone, and speaking pace) and facial expressions from a user's camera feed	\N
784	1534	Stress and Confidence Analyzer	The Stress and Confidence Analyzer is a real-time, dual-modal system engineered to assess confidence and emotions by analyzing both vocal pitch and facial expressions. Developed using Python, OpenCV, and deep learning, the project processes visual and audio data streams simultaneously. The system implements sophisticated deep learning models to classify facial expressions for accurate emotion recognition, while its audio processing module analyzes vocal pitch as a primary indicator of confidence levels.	\N
802	1408	Safe Pick - AI powered Allergen Detection System	Developed a full-stack web app with React.js and Spring Boot that uses LLaMA Vision and Together AI to detect allergens from food labels in real time and deployed on Render. Created JWT-secured authentication, personalized allergy profiles, and real-time color-coded alerts for safe food choices	\N
803	1408	Smart Assistance Model for visually impaired people	Our project is designed to enhance mobility and independence for individuals with vision impairment. The system integrates a Raspberry Pi–based wearable client equipped with a camera and ultrasonic sensors for real-time obstacle detection. Data is processed using lightweight AI models locally, while more complex tasks are offloaded to an edge device (e.g., laptop or server) for high-accuracy YOLO-based object detection, sensor fusion, and scene understanding. Users receive multimodal feedback through audio and haptic alerts, ensuring timely and reliable navigation support. This approach balances portability, low latency, and accuracy while addressing practical challenges such as power efficiency, environmental variability, and user adaptation.	\N
812	1532	AI Based Stress & Confidence Analyser	Implemented deep learning models using Convolutional Neural Networks (CNNs) for facial emotion recognition and audio processing pipelines to detect stress patterns from voice signals.	\N
813	1532	Refrigerator Door Detection & Verification	Developed a image detection and verification tool to identify and match refrigerator door images from input data. Retrained a Detectron2-based object detection model on a custom COCO-style dataset to accurately detect refrigerator doors.Integrated Convolutional Neural Networks (CNNs) for image feature extraction and used Siamese Networks to compare and verify the similarity between detected doors and reference images.	\N
843	1562	IoT enabled Smart traffic management and alert system with green corridor for emergency vehicles	This project included IOT device along with location tracking in emergency vehicles to provide green corridor/ avoid traffic congestion to reduce time to reach hospital with patients	\N
850	1543	Real time fall detection using Ai	implementing an AI-based model to detect falls in real-time using wearable sensor data. designing and developing a user-friendly mobile UI for alert and data visualization with integrated wearable device and an SOS alert system that triggers notifications upon fall detection	\N
673	1439	Blood Cancer Detection Using Machine Learning	Blood cancer (like leukemia, lymphoma, and myeloma) affects the production and function of blood cells, often making early detection difficult. Traditional diagnostic methods can be time-consuming, expensive, and dependent on expert pathologists.  Machine Learning (ML) offers a promising solution by analyzing blood test results, microscopic images of blood smears, or genetic/molecular data to detect cancerous patterns. ML models can learn from large datasets of patient samples and accurately classify whether blood cells are normal or malignant.	\N
674	1439	Solar powered battery charger	The Solar Powered Battery Charger project focuses on harnessing renewable solar energy to charge rechargeable batteries in an efficient and eco-friendly way. Instead of relying on electricity from the grid, this system uses solar panels to convert sunlight into electrical energy, which is then regulated and stored in batteries for later use.	\N
861	1580	REAL TIME SIGN LANGUAGE CONVERSION TO TEXT	A real-time sign language to text conversion system captures hand gestures using a camera, uses computer vision and machine learning (like CNNs or RNNs) to extract features and map them to text, displays the resulting text on a screen, and aims to improve communication for the deaf and hard-of-hearing community. The project leverages tools like the MediaPipe library, OpenCV, and machine learning frameworks such as TensorFlow to process video streams and translate gestures into understandable language.	\N
1135	342	solar system	kavita ma'am	\N
1136	342	disco system	kavita ma'am	\N
1137	342	moonlight	abc	\N
862	1580	CARvADL: Smart Deep Learning Based Cardiovascular Disease Detection System	CARvADL is an AI-powered system designed for early and accurate detection of cardiovascular diseases using deep learning techniques. It processes data from sources like ECGs, medical images, or patient records to automatically identify conditions such as heart failure, arrhythmias, and coronary artery disease. With real-time monitoring, smart diagnostics, and explainable AI, CARvADL assists healthcare professionals in making faster, more reliable decisions. Its user-friendly interface and integration capabilities make it ideal for clinical use, remote monitoring, and preventive care.	\N
754	1431	LandParser: Intelligent Land Boundary Detection and Encroachment Analysis Using Deep Learning with Satellite Imagery	Built a GIS-based app for land boundary detection, encroachment analysis, and land price prediction using deep learning & satellite imagery, improving efficiency by 35%.	\N
700	1410	Nadi Pariksha - Bridging Ancient Ayurveda with Modern Sensor Technology	N/A	\N
701	1410	Exploration and Analysis of Smart Contract Vulnerabilities and Intermediate Representations using LLVM and SLIM	N/A	\N
755	1431	GIST : Gesture Interpretation & Speech Translator Project	A real-time system that converts Indian Sign Language hand gestures into text and speech using Python, media pipeline ,OpenCV, and Tkinter, helping deaf and mute individuals communicate easily.	\N
778	1518	Block chain based decentralised voting system	This system leverages blockchain technology to create a secure, transparent, and tamper-proof digital voting platform. It eliminates the need for centralized authorities by using smart contracts and distributed ledger technology to ensure vote integrity, anonymity, and verifiability.	\N
779	1518	Object detection system	This system uses computer vision and deep learning algorithms to automatically detect and identify objects within images or video streams. It processes visual data in real-time, drawing bounding boxes around detected objects and classifying them into predefined categories (e.g., people, vehicles, animals).	\N
786	1553	Blood group detection using fingerprint	This project focuses on predicting blood groups using fingerprint patterns. It analyzes ridge flow and pattern types to find correlations with the ABO and Rh systems. Image processing techniques are applied for feature extraction and classification.	\N
875	1581	Real estate price prediction using machine learning	We predicted real estate price in future using machine learning and past dataset	\N
876	1581	Cardiovascular disease detection using deep learning	We trained deep learning model to detect cardiovascular disease on ECG dataset	\N
906	1551	Online Blood Bank Management System	Developed a web-based application to streamline blood donation and transfusion processes by connecting donors, recipients, and blood banks on a unified platform. The system allows real-time tracking of blood availability, donor registration, and request management.	\N
911	1517	Waste Classification	Created an image classifier using EfficientNet to sort waste into categories	\N
912	1517	Spam-Ham classifier	Build a simple web app using streamlit to detect spam emails	\N
921	1402	Smart allergy app	N/A	\N
923	1552	Smart IoT-Based Wildlife Tracking & Intrusion Alert System	This project aims to design and implement an IoT-based system to detect wildlife movement near human settlements and provide real-time intrusion alerts. The system integrates GPS modules, motion sensors, and GSM communication to monitor animal movement patterns. Once detected, alerts are sent to both villagers and forest officials to prevent human-wildlife conflicts.	\N
925	1433	Skin disease classification system	Developed a deep learning model to classify skin lesions as malignant or benign by sourcing, integrating, and preprocessing a large-scale dataset using NumPy and Pandas, Matplotlib, Seaborn. Designed and trained a Convolutional Neural Network (CNN) model, achieving a classification accuracy of 90% on the prepared training and validation data.	\N
939	1544	Ai driven real time sign language detection system	Project aim to solve problems face by dead and dumb people .  Model uses mediapipe and random forest.	\N
942	408	Farmazon - Marketplace for Famers	Farmazon is an online marketplace designed to empower farmers by allowing them to sell their crops directly to buyers without the interference of middlemen. The platform ensures fair pricing, greater transparency, and improved income for farmers, while also providing consumers easy access to fresh, locally grown produce. By connecting farmers and buyers on a single digital platform, Farmazon promotes trust, reduces exploitation, and strengthens the agricultural supply chain.	\N
951	1404	Student result management system	Built a desktop-based academic record management system to store, update, and display student results. Enabled admin and faculty operations through a secure login system and an intuitive GUI built with Java	\N
974	411	IIT Bombay Techfest	Designed and built a bot to perform specified tasks in the CozmoClench robotics challenge. Gained hands-on experience in bot design, mechanical assembly, electronics integration, and problem-solving under time constraints.	\N
710	1412	Blood Cancer Detection using Machine Learning	Implemented a Machine Learning model for Blood Cancer Detection using data preprocessing, feature selection, and classification algorithms to support early diagnosis.	\N
711	1412	YouTube sumarisation Tool	Developed a YouTube Summarization Tool focused on the educational domain using NLP techniques to extract key insights and improve content accessibility.	\N
712	1436	Blood Cancer Detection Using Machine Learning	Blood cancer (like leukemia, lymphoma, and myeloma) affects the production and function of blood cells, often making early detection difficult. Traditional diagnostic methods can be time-consuming, expensive, and dependent on expert pathologists.  Machine Learning (ML) offers a promising solution by analyzing blood test results, microscopic images of blood smears, or genetic/molecular data to detect cancerous patterns. ML models can learn from large datasets of patient samples and accurately classify whether blood cells are normal or malignant.	\N
713	1436	Solar powered battrey charger	The Solar Powered Battery Charger project focuses on harnessing renewable solar energy to charge rechargeable batteries in an efficient and eco-friendly way. Instead of relying on electricity from the grid, this system uses solar panels to convert sunlight into electrical energy, which is then regulated and stored in batteries for later use.	\N
747	1423	AI-based Image and Video Retrieval System	ChatGPT You said: Give me my project description  ChatGPT said: Got it 👍 Could you remind me which project you’d like the description for?  From what I recall, you mentioned "AI-based Image Retrieval System" earlier, and also worked on "Image Search using CLIP and FAISS". Do you want me to write the project description for that one (suitable for your resume/academic use), or for a different project?  You said: Ai based image and video retrieval system  ChatGPT said: Here’s a crisp project description you can use for your resume, report, or presentation 👇  AI-based Image and Video Retrieval System  This project focuses on developing an intelligent retrieval system capable of searching and retrieving relevant images and videos from a large dataset using artificial intelligence and deep learning techniques. The system leverages feature extraction models (e.g., CLIP, CNNs) to generate semantic embeddings of visual data and applies vector similarity search (FAISS/ANN algorithms) to perform efficient retrieval. Unlike traditional keyword-based search, the system supports content-based queries, including text-to-image, image-to-image, and video-to-text retrieval.	\N
752	1526	Multimodal AI-Based Hands-Free Navigation System using Head, Eye, and Voice Control	Developing a hands-free mobile navigation system that allows users to control Android devices using head pose, eye tracking, and voice commands. Built a head-pose classifier via transfer learning and integrated Mediapipe for real-time control. The project focuses on improving human-computer interaction and accessibility for people with disabilities. (Ongoing project)	\N
753	1526	Laboratory Management System	Developed a full-stack admin portal to manage patients, record test results, and generate PDF reports. Implemented JWT-based authentication, QR-encoded digital reports, Flask REST APIs, and a responsive React dashboard.	\N
764	1520	TRACE & RESCUE - FIGHTING HUMAN TRAFFICKING & DISAPPEARANCES	The Trace and Rescue system is an AI-powered solution designed to help law enforcement locate missing persons through the analysis of CCTV footage. By uploading multiple images of a missing individual, the system uses advanced facial recognition to compare these images with faces detected in recorded video feeds from public spaces. The system efficiently scans large volumes of video, extracts key metadata (timestamp, camera ID, and location), and alerts authorities when a match is found. This system integrates seamlessly with existing public surveillance infrastructure, enabling faster response times and reducing the manual effort required in traditional methods.	\N
765	1520	Phishing Website Detection using Machine Learning	This project implements a phishing website detection system using machine learning techniques. It extracts key features such as URL structure, domain information, SSL certificate validity, and website behavior. Classification algorithms like Decision Trees, Random Forest, and Logistic Regression are applied to predict whether a website is legitimate or phishing. The system aims to enhance online security by reducing risks of identity theft and fraud.	\N
1017	710	Live Sign language translator	With the help of camera or webcam, our program can translate the hand signs directly to words and sound.	\N
1018	710	Form builder, (Google forms)	Similar to Google forms, but has number of templates	\N
776	1521	Student Record Management System (C++)	Built a menu-driven console application using object-oriented programming concepts in C++ to manage student records. Enabled add, display, search, modify, and delete operations using array-based in-memory data storage. Designed modular, user-friendly code structure to simulate basic database functionality in an offline environment.	\N
777	1521	Blood Group Detection using Fingerprint	Developing a biometric-based system to predict a person’s blood group using fingerprint patterns. Utilizing image processing techniques to extract unique fingerprint features. Designing a user-friendly interface for non-invasive and quick identification. Aiming to provide a cost-effective, efficient, and portable alternative to traditional blood testing methods.	\N
797	1523	Real time Weather Prediction App	Weather Prediction using HTML,CSS , JavaScript.	\N
798	1523	Online Quiz  App	Quiz App using HTML,CSS , JavaScript.	\N
799	1550	Decentralised voting system using Blockchain	N/A	\N
816	1572	Psy Bridge	PsyBridge is a proposed AI-supported mental health framework that aims to combine personality profiling with established clinical screening tools in a multilingual and privacy-focused platform. By utilizing natural language processing and machine learning, the system seeks to overcome the shortcomings of current tools, offering a cohesive and intelligent mental health assessment process.	\N
913	427	ExamPrep Website	In our project we uploaded downloadable files of past year question papers so that students can use it foe their evaluation and testing before exams.	\N
914	427	HealthPal Website	In this website users can log data like their daily water intake, workout activities and other details so that they can keep track of their fitness and health.	\N
950	1404	Sentiment Analysis Web App	Developed a real-time sentiment analysis web application that classifies user input as positive, negative, or neutral using the TextBlob NLP library. Enabled instant feedback through an interactive and user-friendly interface.	\N
933	403	VILLAGE E-GOVERNANCE PORTAL	The Village E-Governance Portal is a web-based platform designed to strengthen rural  governance by enhancing transparency, citizen participation, and access to public services.  Developed using the MERN stack (MongoDB, Express.js, React.js with Vite, Node.js), the  system serves as a bridge between villagers and local administration. It provides two role-based  interfaces: one for villagers and one for village leaders (admins). Key features include a  Complaint Management System, Government Scheme Display, and a Public Announcement  Section (currently under development). Villagers can submit complaints, view the status of  existing grievances, and access information on government schemes. Admins can update  complaint statuses, manage other admins, and (once fully implemented) post public  announcements. The platform uses JWT-based authentication to ensure secure access and data  protection.	\N
934	403	Smart Contact Manager	This is a learning Project, the main Objective of this project to create an application which stores contacts in very efficient way and provides a smarter way of handling contacts with fully Authentication and Authorization. I created this project using Spring Boot Thymeleaf with MVC Architecture and for Authentication and Authorization I used Spring Security.  Spring Boot is used to develop back-end and Spring Data JPA is used for performing Database CRUD operations. HTML5, CSS3, Bootstrap and Thymeleaf as template Engine is used to develop the front end. MYSQL for Database.	\N
946	1537	Iot based speed breakers for energy harvesting and monitoring	The concept of harvesting energy from vehicular movement over speed breakers has been explored in several studies, often by leveraging the piezoelectric effect, mechanical systems, or hybrid approaches. With rapid urbanization and increasing traffic volumes, researchers have sought to transform wasted kinetic energy into usable electrical power, particularly for local infrastructure such as streetlights, sensors, and traffic signals.	\N
947	1537	Image captioning and segmentation	N/A	\N
1050	1370	Food Wastage Management Website	The Food Wastage Management Website is a web-based platform designed to reduce food waste by connecting donors with receivers. On the home page, users can view available leftover food listed by donors, while registered donors can post details of excess food they wish to share. Interested receivers can book the food, after which both donor and receiver exchange contact details to complete the transaction. The system maintains a history of donations and receipts for accountability and tracking. Built with MySQL as the backend database, the project focuses on providing a seamless and responsible way to manage surplus food while promoting social good, and it was designed with a royal look and professional theme to make the experience engaging and user-friendly.	\N
1055	1330	Road lane detection	This project focuses on building a computer vision system that can detect and highlight road lanes in real time using Python and the OpenCV library. The system processes video frames from a dashcam or a simulated driving environment to identify lane markings on the road. The implementation involves converting frames to grayscale, applying Gaussian blur to reduce noise, and using the Canny edge detection algorithm to extract edges. A region of interest (ROI) mask is then applied to focus only on the road area. Finally, the Hough Line Transform is used to detect straight lane lines, which are drawn back onto the original frame for visualization.  This project demonstrates how image processing techniques can be applied to autonomous driving and driver assistance systems, where lane detection is a crucial component. It provides hands-on experience with computer vision concepts such as edge detection, region masking, and line detection. The project can be extended by integrating polynomial curve fitting, handling curved roads, and incorporating real-time feedback for lane departure warnings.  Technologies Used: Python, OpenCV, NumPy	\N
1059	981	E-commerce website online book store	This project is an E-commerce Online Book Store that enables users to browse, search, and purchase books online. It provides a user-friendly interface with secure payment, shopping cart, and order management features, making book shopping easy and accessible.	\N
1060	981	Law and management system	The Law and Management System is designed to digitize and streamline legal case management. It helps lawyers, clients, and administrators manage case details, documents, schedules, and client information in a secure and organized way. The system improves efficiency, reduces paperwork, and ensures quick access to legal records.	\N
943	408	IoT based Smart Street Light System	The IoT-based Smart Street Light System project is designed to create an energy-efficient, automated street lighting network. In this project, LED streetlights are equipped with sensors such as PIR motion sensors to detect movement and LDR sensors to measure ambient light levels. These sensors communicate with a microcontroller, which processes the data to control the lighting intensity—switching lights on or increasing brightness when motion is detected in darkness and dimming or switching off lights in the absence of movement or during daylight.  The system also integrates IoT communication modules, enabling remote monitoring and management via a cloud platform. This setup not only reduces energy consumption and operational costs but also improves safety for pedestrians and vehicles. The project demonstrates the practical application of IoT technology to modernize urban infrastructure while promoting sustainability and smart city goals.	\N
953	1530	ModelMate - Your ultimate Software Development companion	ModelMate is an intelligent software engineering assistant designed to streamline the Software Development Life Cycle (SDLC) through AI-driven insights and real-time collaboration. It provides a web-based dashboard where users can upload project data, run automated analyses, and receive actionable recommendations at every stage of development.	\N
1056	1330	Offline Choir App for Chapel	This project is a mobile application developed to support chapel choir activities by storing and managing songs in offline mode. The app provides an easy-to-use interface where choir members can access hymn lyrics and other musical pieces without relying on the internet. Songs are categorized and stored locally within the app, ensuring quick access during practice sessions and chapel services. The app also allows users to search and browse songs efficiently, making it a convenient digital alternative to traditional songbooks.  By digitizing and organizing choir resources, the app enhances accessibility, reduces dependency on physical copies, and ensures seamless use even in places with poor or no internet connectivity. This project highlights the practical use of mobile application development in community and faith-based settings, offering both reliability and user-friendliness.  Technologies : flutter , Android Studio, SQLite (for offline storage)	\N
961	376	Security Cam- Face detection and recognition	A security camera with face detection and recognition uses Python and OpenCV to enhance surveillance systems. The camera captures live video feed, where OpenCV’s Haar cascades  faces in real-time. Once a face is detected, face recognition algorithm compare it with stored face data to identify or verify the person. This technology can be applied in security monitoring, offering automated, efficient, and intelligent surveillance.	\N
962	412	Canteen management system	The Canteen Pre-order System is a digital solution aimed at transforming the traditional and often inefficient process of ordering food in college canteen.	\N
963	412	Car game	The proposed system is a web-based car-driving game implemented using HTML, CSS, and  JavaScript.	\N
966	426	Web based online quiz application	N/A	\N
967	426	Home security surveillance system	N/A	\N
968	382	Online ticket booking website	N/A	\N
969	382	Face Mask detection	N/A	\N
975	411	RightTurn Consultancy – WordPress Website	Developed and deployed a professional WordPress website for RightTurn Consultancy Services, focused on providing career guidance and counseling solutions. Designed a user-friendly interface with responsive layouts, integrated contact forms, service pages, and blog features to enhance accessibility and engagement. Customized themes and plugins to meet specific client needs while ensuring SEO optimization and smooth performance	\N
1023	1369	Task Manager Android App	A flutter based Android app to manage daily tasks, built to get familiar with android development environment and getting to know flutter framework along with dart programming language.	\N
1024	1369	Password Management system	Flutter based password management system which is backed by Firebase working in backend for database, authentication and user login.	\N
1027	410	Mini game website : - SL games	Game website where it consists of multiple players and multiple game	\N
1028	410	Literature review hub Ml in finance	N/A	\N
1029	1583	Car game	Made a car game using HTML,css and js	\N
1030	1583	Online quiz website	Made a online quiz website which can take quiz and give result instantly	\N
1052	438	POT-SOL	PotSol is a web-based platform designed for citizens to easily report potholes in their locality.	\N
980	397	Smart Farming Estimate website	A digital platform that helps farmers and agri-businesses generate accurate cost, yield, and resource estimates using smart farming tools, data analytics, and AI-driven insights.	\N
981	397	Health fitness Tracker	A smart platform to monitor your daily workouts, nutrition, sleep, and overall wellness—helping you stay motivated and achieve your health goals.	\N
982	1522	Fall detection System	A fall detection system is a safety technology designed to automatically identify when a person has fallen and, if necessary, trigger an alert to caregivers, family members, or emergency services. It typically uses sensors such as accelerometers, gyroscopes, or cameras to monitor body movement and posture. These systems are especially useful for elderly individuals, patients with medical conditions, or people in high-risk environments, helping to provide timely assistance and reduce the risk of serious injury.	\N
987	1342	Prompt Spark Engine	prompt evaluation, customization and comparision simulation build on React + Python + Ollama Mistral LLM	\N
988	1342	Gate pass System	Gate Pass System for secure entry/exit management build using React and Python.	\N
989	440	UBA Website	The UBA (Unnat Bharat Abhiyan) Website is a responsive and dynamic web platform developed for the Computer Science Department. It is built with HTML, CSS, and JavaScript on the frontend and powered by Node.js on the backend. The site showcases departmental initiatives, projects, and activities, while providing smooth navigation and mobile-friendly accessibility. Its dynamic structure ensures that content can be updated easily to serve students, faculty, and community stakeholders.	\N
990	440	ACM Website	A responsive and dynamic departmental website built with Node.js, HTML, CSS, and JavaScript to serve the needs of the Computer Science Department.	\N
1025	409	Know Your Student	A comprehensive site for managing student details	\N
1026	409	Gaming Website	A mini game website with games like sudoku, tic tac toe, simon game	\N
1043	1383	Online tiffin booking service app	An online tiffin booking service app is a digital platform that allows users to order home-style meals conveniently from their smartphones. Customers can browse daily or weekly menus, choose vegetarian or non-vegetarian options, customize meal plans, and schedule delivery times. The app connects local tiffin providers with customers, ensuring timely delivery, online payment, subscription options, and real-time order tracking. It aims to provide healthy, affordable, and hassle-free meals, especially for students, working professionals, and people living away from home.	\N
1044	1383	Lawyer management system	The Lawyer Management System is a software application designed to help law firms and individual lawyers manage their daily operations more efficiently. It allows storing and tracking client details, case records, hearing dates, and legal documents in a structured way. The system also provides features like scheduling appointments, sending reminders, and generating reports. By digitizing case management, the system reduces paperwork, saves time, and ensures better communication between lawyers and clients.	\N
1061	1358	house price prediction	Supervised Learning	\N
1062	1358	game development	Angry bird game/ endless runner 3d / space shooting game 2d and 3d	\N
1082	1343	Vehicle no. Plate recognition	Extracts data with cv and types the name of vehicle cite	\N
1083	1343	Face recognition	Recognizes face	\N
1084	414	Online Quiz website	It is a site designed to be used by student and faculty where a faculty can create a quiz and a student can take it and can be judged based on the results.	\N
1091	1052	Hostel Payment System	I have developed a payment gateway for hostel management in order to collect the money from individual student and analysis. It don't require any commission like razorpay	\N
1092	1052	Know Your Student System	This current system we are using is developed by us.	\N
\.


--
-- Data for Name: skill_program; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.skill_program (id, student_id, course_title, platform, duration_hours, date_from, date_to) FROM stdin;
\.


--
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.skills (id, student_id, programming_languages, technologies_frameworks, domains_of_interest, familiar_tools_platforms, technical_soft_skills_overall, additional_technical_skills, additional_soft_skills) FROM stdin;
1	409	C++, C, Javascript, Python	Figma, React, Next JS	Web Development, Data Science, Other	VS code, Github	\N	\N	\N
3	1052	JavaScript CPP C	HTML, CSS, REACTJS, Git, Firebase	Web Development	Postman, Git	\N	\N	\N
5	659	N/A	N/A	Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
6	366	Html, CSS, PYTHON, C	N/A	Web Development	N/A	\N	\N	\N
7	688	Java, C, Python, Html, css, javascript(basic)	Currently none, but android studio	Other	Android studio, git/GitHub, Excel, Vs code, Firebase, canva.	\N	\N	\N
8	704	N/A	N/A	Web Development, Machine Learning, Artificial Intelligence, Other	N/A	\N	\N	\N
9	660	C\nPython\nJavaScript	C, Python, JavaScript, Html, Css	Web Development, Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
10	647	N/A	N/A	Web Development, Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
11	364	C , python	N/A	Artificial Intelligence, Other	N/A	\N	\N	\N
12	667	N/A	N/A	Machine Learning, Data Science, Other	N/A	\N	\N	\N
13	343	C, Python.	N/A	Data Science, Other	N/A	\N	\N	\N
15	653	Python, C.	N/A	Machine Learning, Other	N/A	\N	\N	\N
17	361	C, python, html , java	N/A	Web Development, Artificial Intelligence, Data Science, Cyber Security	N/A	\N	\N	\N
18	327	C, python	Learning backend framework	Web Development, Machine Learning, Artificial Intelligence	Vs code , GitHub , maximum AI tools , etc .	\N	\N	\N
19	347	C,JAVA,Python,HTML,CSS	Tensorflow , Pytorch , Sckit-Learn , Matplotlib , NumPy , Pandas	Web Development, Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
20	334	HTML/CSS , C++, C , Python	Mongo DB, React , Express.js , Node.js	Web Development, Artificial Intelligence, Data Science	Codechef, Project Euler , hackerrank , Leetcode	\N	\N	\N
21	358	C, c++ , html,css, python	N/A	Machine Learning, Artificial Intelligence, Other	N/A	\N	\N	\N
23	330	C, Python	N/A	Web Development, Artificial Intelligence, Data Science	CodeChef	\N	\N	\N
24	357	java, python , c	.	Machine Learning, Data Science	.	\N	\N	\N
25	338	C,C++, PYTHON	.	Web Development, Machine Learning, Artificial Intelligence	Codechef,Hacker rank, Project Euler.	\N	\N	\N
26	367	c language, python , c++	N/A	Machine Learning, Artificial Intelligence, Data Science	vscode , github	\N	\N	\N
27	328	C\nC++\nPython \nHTML	N/A	Web Development, Machine Learning, Artificial Intelligence	N/A	\N	\N	\N
28	352	Python\nc\nhtml\ncss\nJavascript	N/A	Web Development, Machine Learning, Artificial Intelligence, Data Science, Cyber Security	N/A	\N	\N	\N
29	315	C,Python	N/A	Web Development, Artificial Intelligence, Data Science, Cyber Security	N/A	\N	\N	\N
30	314	C, python, htlm, css , javascript	N/A	Web Development, Machine Learning, Artificial Intelligence, Other	ChatGPT , perplexity ,Google Gimini	\N	\N	\N
31	372	C , Python , HTML,  CSS	N/A	Web Development, Artificial Intelligence, Data Science, Other	N/A	\N	\N	\N
33	360	C , java , python, dart	N/A	Machine Learning, Artificial Intelligence, Data Science, Other	N/A	\N	\N	\N
34	326	c language\npython	N/A	Web Development, Artificial Intelligence, Cyber Security	CHAT GPT  \nPERPLEXITY PRO\n\nCODE CHIEF\nEULER PROJECT	\N	\N	\N
37	353	N/A	N/A	Other	N/A	\N	\N	\N
38	436	Java, C++, C, JavaScript, HTML, CSS, React, Node.js, SQL, MongoDB	React, Node.js, Express.js, SQL, MongoDB, HTML, CSS, JavaScript	Web Development, Artificial Intelligence	N/A	\N	\N	\N
40	439	N/A	N/A	Web Development, Other	N/A	\N	\N	\N
41	401	N/A	N/A	Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
42	319	C\nJavaScript \nCSS\nHTML\nPYTHON	N/A	Web Development, Artificial Intelligence	N/A	\N	\N	\N
43	702	C, Python, HTML, CSS, Data structures	N/A	Web Development, Data Science, Other	N/A	\N	\N	\N
44	381	C++	power bi, matplotlib, excel and tablue ,sql	Data Science	power bi, matplotlib, excel and tablue ,sql	\N	\N	\N
46	669	N/A	N/A	Web Development, Machine Learning, Artificial Intelligence, Data Science, Cyber Security	N/A	\N	\N	\N
47	675	N/A	N/A	Artificial Intelligence	N/A	\N	\N	\N
48	698	c,python,html,css	N/A	Web Development, Artificial Intelligence, Data Science	N/A	\N	\N	\N
49	442	Python, Java, C, C++,SQL,html ,css	Django, REST API Development, Android Studio, Firebase, HTML, CSS, Git/GitHub, Machine Learning (TensorFlow/Scikit-learn), Data Analysis (Pandas, NumPy)	Web Development, Machine Learning, Artificial Intelligence, Data Science, Other	Android Studio, Firebase, Git/GitHub, VS Code, Jupyter Notebook, MySQL, Google Cloud Platform, MS Office	\N	\N	\N
50	672	N/A	N/A	Other	N/A	\N	\N	\N
51	325	C, Cpp, python, html, css, javascript	N/A	Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
52	707	N/A	N/A	Machine Learning, Artificial Intelligence, Other	N/A	\N	\N	\N
53	369	C, Html and python	None	Web Development, Cyber Security	None	\N	\N	\N
54	705	C programming, Python	Web development frameworks	Machine Learning, Artificial Intelligence, Data Science	Online coding platforms (codeChef)	\N	\N	\N
55	356	N/A	N/A	Web Development, Data Science	N/A	\N	\N	\N
45	386	Python, html , c++	Jupyter Notebook	Artificial Intelligence	N/A	\N	\N	\N
57	712	Python,C,HTML,CSS	Frontend	Web Development, Artificial Intelligence, Data Science, Cyber Security	non	\N	\N	\N
58	683	N/A	N/A	Web Development	N/A	\N	\N	\N
59	668	N/A	N/A	Web Development, Artificial Intelligence, Data Science	N/A	\N	\N	\N
60	324	N/A	N/A	Web Development, Machine Learning, Other	N/A	\N	\N	\N
61	382	N/A	N/A	Other	N/A	\N	\N	\N
62	664	Python,c	N/A	Web Development, Artificial Intelligence, Other	N/A	\N	\N	\N
63	344	C, Python, HTML, CSS	N/A	Web Development, Artificial Intelligence	N/A	\N	\N	\N
2	414	Python, Rust, Zig, Lua, C, C++, Java	SQL, Flask, FastAPI, Polars(alternative to Pandas), git	Cyber Security, Other	VS Code, Neovim, Docker, NixOS, Linux	\N	\N	\N
14	311	C , Python , HTML , CSS	N/A	Web Development, Machine Learning, Artificial Intelligence, Other	CodeChef	\N	\N	\N
16	350	C language\nPython	Open AI	Web Development, Machine Learning	Matlab\nLeet code \nCodechef	\N	\N	\N
39	404	C,c++	.	Web Development	Vs code se Krna	\N	\N	\N
4	662	Python , c , html	N/A	Web Development	N/A	\N	\N	\N
35	351	Python, C	N/A	Web Development, Artificial Intelligence, Cyber Security	Chatgpt, perplexity pro , codechef, Euler project	\N	\N	\N
36	339	C\nC++\nPython\nFull Stack Development	N/A	Web Development, Other	N/A	\N	\N	\N
64	399	C, C++, C#	N/A	Artificial Intelligence, Other	Unity Game engine	\N	\N	\N
77	665	c,c++,PYTHON	CHATGPT	Other	CHATGPT	\N	\N	\N
65	687	Python, C, Html, CSS	Fronten, Excel, DSA	Machine Learning, Artificial Intelligence, Data Science	GitHub, LinkedIn, figma, Canva, Chatgpt	\N	\N	\N
66	692	C, python	N/A	Artificial Intelligence	N/A	\N	\N	\N
67	322	c, cpp, python, html, css	Web development	Web Development, Machine Learning, Other	Leetcode, vs code, project eular, GitHub, Greek for greeks	\N	\N	\N
68	654	python ,html,c	N/A	Web Development, Artificial Intelligence	N/A	\N	\N	\N
69	421	C , C++ , HTML , CSS ,  JAVASCRIPT.	BOOTSTRAP	Web Development	VS CODE ,  GITHUB , LINKEDIN	\N	\N	\N
72	679	Python , HTML , C	..	Web Development	WordPress	\N	\N	\N
76	694	C language, Python,HTML	N/A	Web Development, Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
80	709	C, C++, python	Web development	Machine Learning, Artificial Intelligence, Data Science	Figma	\N	\N	\N
70	693	HTML, basic python	N/A	Web Development, Artificial Intelligence, Data Science	N/A	\N	\N	\N
73	680	html,css,c,python	N/A	Web Development, Artificial Intelligence, Cyber Security	generative AIs	\N	\N	\N
71	695	python and its libraries	css ,html	Web Development, Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
74	384	N/A	N/A	Machine Learning, Artificial Intelligence	N/A	\N	\N	\N
75	686	N/A	N/A	Web Development, Artificial Intelligence, Other	N/A	\N	\N	\N
78	706	C , C++, python	N/A	Web Development, Machine Learning, Artificial Intelligence, Data Science, Cyber Security, Other	Geek for geek , codehelp, W3school,	\N	\N	\N
82	415	N/A	N/A	Web Development, Other	N/A	\N	\N	\N
83	329	N/A	N/A	Artificial Intelligence	N/A	\N	\N	\N
79	677	N/A	N/A	Web Development, Artificial Intelligence, Data Science	N/A	\N	\N	\N
81	671	C , C++ , python	C, C++, Java, Python, HTML, CSS, JavaScript ,Git, Git Hub, MS Office (Word, PowerPoint, Excel),Google Workspace (Docs, Slides, Drive)	Machine Learning, Artificial Intelligence, Data Science	C, C++, Java, Python,\nHTML, CSS, JavaScript,\nGit, GitHub,\nProductivity & Collaboration,\nMS Office (Word, PowerPoint, Excel),\nGoogle Workspace (Docs, Slides, Drive),\nCanva	\N	\N	\N
84	650	C/C++/Python	N/A	Machine Learning, Artificial Intelligence	N/A	\N	\N	\N
85	689	N/A	N/A	Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
86	648	C\nJava\nPython \nHtml \nCss\n#java	N/A	Web Development, Machine Learning, Artificial Intelligence, Data Science, Cyber Security	N/A	\N	\N	\N
87	1362	N/A	N/A	Data Science	N/A	\N	\N	\N
88	1364	N/A	N/A	Machine Learning, Artificial Intelligence, Data Science, Cyber Security, Other	N/A	\N	\N	\N
89	1322	Java,c++,c,python	N/A	Other	N/A	\N	\N	\N
90	1325	C, cpp, python	Html, css, basics of Java script , sql	Data Science, Other	N/A	\N	\N	\N
92	1354	N/A	N/A	Data Science	N/A	\N	\N	\N
93	1321	N/A	N/A	Data Science, Other	N/A	\N	\N	\N
94	1372	N/A	N/A	Other	N/A	\N	\N	\N
95	370	Python, C language, C++	Pandas, Numpy, Matplotlib, Seaborn, Flask	Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
96	690	N/A	N/A	Web Development, Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
97	1332	Python , c , r	Tensor flow and Flask	Cyber Security, Other	Vs code	\N	\N	\N
98	313	N/A	N/A	Web Development, Other	N/A	\N	\N	\N
99	697	N/A	N/A	Other	N/A	\N	\N	\N
100	336	C, C++, Python, HTML, CSS, JavaScript	React.js, Tailwind CSS, Netlify, GitHub, Vercel, PowerBI	Machine Learning, Data Science, Cyber Security	GitHub, Netlify, Visual Studio Code, Google Colab, Microsoft Office Suite (Word, PowerPoint, Excel), PowerBI	\N	\N	\N
101	1360	C, C++,Python	N/A	Machine Learning, Data Science	N/A	\N	\N	\N
102	422	C,C++,Python	Basics of DBMS,Machine Learning and Intermediate AI	Artificial Intelligence, Data Science	Leetcode,Postgre Sql,Vs code	\N	\N	\N
103	684	C, HTML,CSS,JAVASCRIPT,PYTHON (Basics)	N/A	Web Development, Machine Learning, Artificial Intelligence	N/A	\N	\N	\N
104	378	C,C++,Python	Basic of SQL and Machine Learning	Machine Learning, Artificial Intelligence, Data Science	VS Code,Leetcode,Jupyter Noteebook	\N	\N	\N
105	1318	Python, C++, C, Java, SQL,R	TensorFlow, PyTorch, Keras, scikit-learn, OpenCV, YOLO, Hugging Face Transformers, NLTK, SpaCy, Flask, Django, FastAPI, Streamlit, NumPy, Pandas, Matplotlib, Seaborn, Jupyter Notebook, Git, GitHub, Docker, Google Colab, VS Code, Anaconda	Machine Learning, Artificial Intelligence, Data Science	Google Colab, Jupyter Notebook, Anaconda, Git, GitHub, Docker, Kaggle, VS Code, PyCharm, Linux, Windows, Canva, MS Office ,Word, Excel, PowerPoint	\N	\N	\N
106	405	Python , R , C, C++ , Html , Css, js	N/A	Web Development, Artificial Intelligence, Data Science	N/A	\N	\N	\N
107	380	Python, C++, C, Java, SQL, R language	TensorFlow, PyTorch, Keras, scikit-learn, OpenCV, YOLO, Hugging Face Transformers, NLTK, SpaCy, Flask, Django, FastAPI, Streamlit, NumPy, Pandas, Matplotlib, Seaborn, Jupyter Notebook, Git, GitHub, Docker, Google Colab, VS Code, Anaconda	Machine Learning, Artificial Intelligence, Data Science	Google Colab, Jupyter Notebook, Anaconda, Git, GitHub, Docker, Kaggle, VS Code, PyCharm, Linux, Windows, Canva, MS Office ,Word, Excel, PowerPoint.	\N	\N	\N
108	700	C,C++,JS, HTML, CSS	N/A	Artificial Intelligence, Data Science, Other	N/A	\N	\N	\N
109	1394	python , C++ , PostgreSQL	Unreal Engine 5 , pygame , TensorFlow & PyTorch , OpenCV	Web Development, Machine Learning, Artificial Intelligence, Other	Unreal Engine 5 , pygame	\N	\N	\N
110	1422	C, python, html	Gen AI, Microsoft 365 copilot, Exel, Sql.	Artificial Intelligence, Data Science	Programming & Development: Python, C, python\nData & Analytics: Excel, SQL, Google Sheets,\nAI/ML & Visualization: Google Collab, \nDigital Marketing: Google Analytics, Canva, Social Media Marketing Tools.	\N	\N	\N
111	1344	html,css ,sql	N/A	Data Science	N/A	\N	\N	\N
22	355	C\nPython	.	Web Development, Artificial Intelligence, Data Science	Canva, vscode, LeetCode, Codechef , GitHub, Google Colab , Microsoft Power BI Service	\N	\N	\N
112	331	C,html	N/A	Artificial Intelligence, Data Science, Cyber Security	N/A	\N	\N	\N
113	1438	N/A	N/A	Other	N/A	\N	\N	\N
114	332	C,C++, Python, HTML,CSS	Technologies:\nC\nC++\nPython\nHTML\nCSS\n\nFrameworks:\nReact.js\nNode.js\n(Aiming to start this frameworks soon)	Web Development, Machine Learning, Artificial Intelligence	Familiar Tools:\nGit & GitHub\nVS Code\n\nPlatforms:\nOnline coding platforms (HackerRank, LeetCode, Codechef, etc.)\nGitHub (for projects)	\N	\N	\N
115	673	N/A	N/A	Machine Learning, Artificial Intelligence, Data Science, Cyber Security, Other	N/A	\N	\N	\N
116	359	C, C++, Python, HTML, CSS, C#	Pandas, FastAPI, Numpy, Matplotlib, APIs, Deployment, streamlit	Machine Learning, Artificial Intelligence, Other	Vercel, Render, VS Code, Visual Studio, Godot, Kaggle, Google Colab, Postman, Power BI, ngrok	\N	\N	\N
117	368	C\nPython\nHTML\nCSS	N/A	Web Development, Data Science, Cyber Security	N/A	\N	\N	\N
118	365	C, PYTHON, DATA STRUCTURE, COMPETITIVE PROGRAMMING	N/A	Web Development, Artificial Intelligence	N/A	\N	\N	\N
119	1407	C, C++, Python, HTML, CSS	Pandas, NumPy, Scikit-learn, Matplotlib, Seaborn	Machine Learning, Artificial Intelligence, Data Science	Excel, Google Sheets, Power BI, MySQL, Jupyter Notebook, Neo4j, Latex	\N	\N	\N
120	656	Basics in c , python	N/A	Web Development, Artificial Intelligence, Data Science	N/A	\N	\N	\N
121	651	C, Python	N/A	Web Development, Machine Learning, Artificial Intelligence	N/A	\N	\N	\N
122	435	N/A	N/A	Web Development, Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
123	346	Html css and javascript, c, c++, python, firebase	Little bit node and react js	Web Development, Machine Learning, Artificial Intelligence	Vs code, cursor ai, chatgpt, gemini, grok, copilot, git, GitHub, hackerrank, leet code, codechafe, colab	\N	\N	\N
124	703	pyhton	N/A	Data Science, Other	N/A	\N	\N	\N
125	320	C programming, basic Python.	Figma, WordPress, Canva,	Web Development, Artificial Intelligence	N/A	\N	\N	\N
126	708	N/A	N/A	Web Development, Machine Learning, Artificial Intelligence, Data Science, Cyber Security	N/A	\N	\N	\N
127	1429	C, C++, Python	NumPy, Pandas, OpenCV, Scikit-learn, Streamlit	Web Development, Machine Learning, Artificial Intelligence, Data Science	PyCharm, VS Code, Git, Jupyter Notebook	\N	\N	\N
128	387	C,C++, javascript	Backend: Node.js, Express.js\nFrontend: HTML, CSS, Bootstrap, EJS (Embedded JavaScript)\nDatabases: MySQL, MongoDB	Web Development	N/A	\N	\N	\N
130	649	N/A	N/A	Web Development, Machine Learning, Artificial Intelligence	N/A	\N	\N	\N
91	1323	N/A	N/A	Web Development, Machine Learning, Artificial Intelligence	N/A	\N	\N	\N
129	407	C, C++, Python	HTML, CSS, JavaScript, React, Tailwind CSS, Nodejs, Express, PostgreSQL, MongoDB.	Web Development, Machine Learning, Artificial Intelligence	Git & GitHub, VS Code, Vercel, Render	\N	\N	\N
137	340	Python , C , javascript , MongoDB and sql .	Javascript , React.js , Tailwind CSS , Node.js and MongoDB .	Web Development, Other	VS Code , Git , Github and npm	\N	\N	\N
138	1382	N/A	N/A	Other	N/A	\N	\N	\N
141	1343	N/A	N/A	Web Development, Machine Learning, Data Science	N/A	\N	\N	\N
143	699	C,basic of c++and python, html,css	N/A	Web Development, Other	N/A	\N	\N	\N
149	1371	C, python, C++	N/A	Machine Learning, Artificial Intelligence, Data Science, Other	N/A	\N	\N	\N
153	1336	N/A	N/A	Other	N/A	\N	\N	\N
155	1363	N/A	N/A	Web Development, Cyber Security	N/A	\N	\N	\N
154	1370	C – for problem-solving and logic building.\n\nPython – projects like UNO card game logic, scripting, and problem-solving.\n\nJava – core programming and OOP concepts.\n\nJavaScript – web development (Node.js projects, frontend basics).\n\nSQL – database management with PostgreSQL and MySQL.	Spring Boot, HTML, CSS, JavaScript, Android ( XML), PostgreSQL, MySQL, SQL, REST APIs, Git, GitHub	Web Development, Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
131	428	C, C++	Vs code, replit, node js, html, css, javascript	Web Development, Machine Learning, Artificial Intelligence	Replit, vs code	\N	\N	\N
132	406	N/A	N/A	Web Development, Artificial Intelligence	N/A	\N	\N	\N
134	1386	Python, C, C++,, HTML, Java	Streamlit, TensorFlow, OpenCV,YOLO, Power BI, Tableau, Excel, SQL, GitHub,Pandas, NumPy, Scikit-learn, Matplotlib	Machine Learning, Artificial Intelligence, Data Science	power BI, Tableau, Excel, SQL, GitHub, vs code, codechef.	\N	\N	\N
145	363	Python, Javascript, C, C++, PHP, SQL	React for frontend, express for backend, MongoDB for database, Pandas for data preprocessing, cleaning, Scikit-learn for machine learning, Matplotlib for graph plotting.	Web Development, Machine Learning, Artificial Intelligence, Data Science	PowerBI, Kaggle for datasets, GitHub to maintain project, Vercel for deployment, Postman for backend http requests.	\N	\N	\N
146	1381	c,c++,java \nbackend - sql , mongodb	N/A	Data Science, Other	power bi , tabelau	\N	\N	\N
148	1365	N/A	N/A	Web Development, Artificial Intelligence	N/A	\N	\N	\N
133	1383	C , C++ , java , python , sql , oop	N/A	Other	Visual studio code , android studio	\N	\N	\N
158	433	Python	N/A	Cyber Security	N/A	\N	\N	\N
144	438	C++ . Java	N/A	Web Development, Artificial Intelligence, Other	N/A	\N	\N	\N
135	1417	C++, Python ,C ,HTML ,CSS	SQL, Web Technologies, Basics of DSA, Pandas, Numpy, Matplotlib, Git/ Github, MongoDB.	Web Development, Machine Learning, Artificial Intelligence	Postgress SQL, Power Bi, Tableau, Vs code, Codechef, Github	\N	\N	\N
136	1561	C,C++, Python	Figma , Keycloak	Web Development, Data Science, Cyber Security	VS Code , Git Hub	\N	\N	\N
147	312	N/A	N/A	Web Development, Artificial Intelligence, Data Science	N/A	\N	\N	\N
162	1357	C, C++, Python	Ai agent, editing	Web Development, Artificial Intelligence, Cyber Security	N/A	\N	\N	\N
139	1334	C language, C++ language, python	N/A	Data Science, Other	Power BI, Wireshark, Oracle	\N	\N	\N
151	681	C, python, html	Working on embedded c and iiot	Machine Learning, Artificial Intelligence, Other	N/A	\N	\N	\N
152	1378	N/A	N/A	Web Development	N/A	\N	\N	\N
157	1353	Python \nC	N/A	Data Science	Data Science Tools:\n1.Python libraries:NumPy, pandas, TensorFlow\n2.Data visualization:Matplotlib, Seaborn\n3.Machine learning:scikit-learn, TensorFlow, PyTorch\n4.Data manipulation:pandas, NumPy, SQL\n5.Big data:Apache Hadoop, Apache Spark	\N	\N	\N
140	1535	C,C++, Python	Python, C, C++\nPandas, NumPy, Matplotlib\nTesseract OCR, PyMuPDF, OpenCV\nGit/GitHub, VS Code	Web Development, Machine Learning, Artificial Intelligence	VS Code\nGit & GitHub\nGoogle Colab\nMS Office (Word, Excel, PowerPoint)	\N	\N	\N
142	416	C , C++, python \nWeb technologies: html,css\nDatabase query language:Sql	N/A	Web Development, Cyber Security	N/A	\N	\N	\N
150	432	Html,css, javascript and python	N/A	Web Development, Artificial Intelligence	N/A	\N	\N	\N
156	1347	C,C++	N/A	Web Development	N/A	\N	\N	\N
159	434	C, C++, python, HTML CSS, javascript	N/A	Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
160	1384	C, python	Video editing and photoshop	Web Development, Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
161	1345	C, c++, python	N/A	Data Science	N/A	\N	\N	\N
163	1445	Java	N/A	Data Science, Cyber Security, Other	N/A	\N	\N	\N
164	1376	N/A	N/A	Other	Unity 3D, VS Code, Flutter, Android Studio	\N	\N	\N
165	349	C, Python	VS code	Artificial Intelligence	VS code	\N	\N	\N
166	1339	C++,java , python	Web development	Web Development, Data Science	N/A	\N	\N	\N
167	337	N/A	N/A	Machine Learning, Artificial Intelligence	N/A	\N	\N	\N
168	321	C\nC++\nPython	N/A	Machine Learning, Artificial Intelligence	N/A	\N	\N	\N
169	1359	C, Cpp, HTML, CSS, JavaScript and learning Java	N/A	Web Development, Data Science	N/A	\N	\N	\N
170	652	C, Python, Java	N/A	Machine Learning, Data Science, Cyber Security	N/A	\N	\N	\N
171	335	N/A	N/A	Web Development, Machine Learning, Artificial Intelligence, Data Science, Cyber Security	N/A	\N	\N	\N
172	1346	Java,python,c++	Html,css,js,mysql	Web Development, Machine Learning, Artificial Intelligence, Cyber Security	Vs code,intellija,GitHub,leetcode,codechef	\N	\N	\N
173	1329	C, C++, Python, Java, SQL	HTML, CSS, Git, MySQL, PostgreSQL, Pandas, NumPy, Matplotlib	Web Development, Machine Learning, Data Science	HTML, CSS, Git, MySQL, PostgreSQL, Pandas, NumPy, Matplotlib	\N	\N	\N
174	663	Java, python, css, js, c	N/A	Web Development, Machine Learning, Artificial Intelligence, Data Science, Other	N/A	\N	\N	\N
175	1352	Python, C, C++, SQL	TensorFlow, PyTorch, Scikit-learn, Pandas, NumPy, Streamlit, Flask	Machine Learning, Artificial Intelligence, Data Science, Other	Jupyter Notebook, Google Colab, Git, GitHub, VS Code, Kaggle, Google Cloud Platform (GCP)	\N	\N	\N
176	441	N/A	N/A	Web Development, Machine Learning, Artificial Intelligence, Data Science, Cyber Security, Other	N/A	\N	\N	\N
177	427	C, C++, Python, R	N/A	Web Development, Artificial Intelligence, Data Science	N/A	\N	\N	\N
178	413	Java,C,C++,kotlin	Html,css, Spring boot, Spring, MySQL, Hibernate	Web Development, Artificial Intelligence, Other	N/A	\N	\N	\N
179	1341	C, C++, Python	N/A	Machine Learning, Data Science	Power BI, R language	\N	\N	\N
180	391	N/A	N/A	Web Development, Artificial Intelligence	N/A	\N	\N	\N
181	1426	Python,  C, C++	HTML, CSS, Tailwind CSS, Simple CSS	Web Development	GitHub, VS Code, Jupyter Notebook, Google Colab, MySQL, SQLite, Vite, Postman, Excel, Google Workspace	\N	\N	\N
182	400	N/A	N/A	Web Development, Artificial Intelligence	N/A	\N	\N	\N
183	385	C,C++,python,html,css,js,java(basic)	N/A	Web Development, Cyber Security	N/A	\N	\N	\N
184	379	Java, C++,C	N/A	Web Development	N/A	\N	\N	\N
185	377	C, Cpp , Python , Java , HTML	N/A	Other	N/A	\N	\N	\N
186	1366	Java,c,cpp, javascript	MERN, basic of cloud computing	Web Development	N/A	\N	\N	\N
187	388	N/A	N/A	Web Development, Other	N/A	\N	\N	\N
188	419	C,C++,Python,Javascript,SQL	Node.js,React.js, Flutter,SQL,Flask,Jupyter Notebook,Scikit-learn,Arduino	Machine Learning, Artificial Intelligence, Data Science, Cyber Security	N/A	\N	\N	\N
189	1373	c, c++, python, java	N/A	Web Development, Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
190	425	N/A	N/A	Web Development, Machine Learning, Other	N/A	\N	\N	\N
191	410	Java , cpp	N/A	Web Development, Data Science	N/A	\N	\N	\N
192	1437	N/A	N/A	Web Development, Machine Learning, Data Science, Other	N/A	\N	\N	\N
193	1395	N/A	N/A	Web Development, Artificial Intelligence, Data Science, Other	N/A	\N	\N	\N
194	1355	python  , c , c++	excel  , web - development	Web Development, Data Science	N/A	\N	\N	\N
195	323	N/A	N/A	Artificial Intelligence, Data Science, Other	N/A	\N	\N	\N
196	375	C,C++,Python, SQL,R	N/A	Web Development, Data Science, Other	N/A	\N	\N	\N
197	1351	N/A	N/A	Machine Learning, Artificial Intelligence, Data Science, Cyber Security, Other	N/A	\N	\N	\N
199	389	C, C++, Python, Java	pygame, n8n, API integration	Machine Learning, Artificial Intelligence, Data Science, Other	VSCODE, PyCharm, Leetcode	\N	\N	\N
200	392	C, C++, Python	Nil	Cyber Security	Wireshark, Metasploit	\N	\N	\N
201	345	c python html css	N/A	Web Development, Artificial Intelligence	N/A	\N	\N	\N
202	1416	C, C++, Java(core, advance), Python	GitHub, Core Java, Advanced Java (Servlets, JSP, JDBC, Maven), MVC Architecture, MySQL, HTML, CSS, JavaScript, Python, Machine Learning (matplotlib, pandas, NumPy), Apache Tomcat.	Web Development, Machine Learning, Artificial Intelligence	GitHub, Maven, Apache Tomcat, MySQL Workbench, Google Colab, Jupyter Notebook, VS Code, Eclipse IDE, IntelliJ IDEA.	\N	\N	\N
203	1583	C,C++	.	Web Development, Machine Learning, Data Science	.	\N	\N	\N
204	395	C,c++	Ai	Web Development	GitHub	\N	\N	\N
205	1444	Java, C, C++, Python, HTML, \nXML, MySQL, MongoDB.	Spring Boot, JDBC, Hibernate, \nSpring Data JPA, RestAPI.	Web Development, Other	Android Studio, Eclipse, Visual Studio Code, GitHub	\N	\N	\N
206	1406	Java, solidity	Blockchain technology	Web Development, Other	Remix ide, hardhat, metamask	\N	\N	\N
207	1411	N/A	N/A	Web Development, Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
208	423	C, C++, Python	N/A	Other	N/A	\N	\N	\N
209	1403	N/A	N/A	Web Development	N/A	\N	\N	\N
210	396	N/A	N/A	Artificial Intelligence, Cyber Security, Other	N/A	\N	\N	\N
211	1391	C, Cpp, Python, JavaScript	NodeJs , ExpressJs, ReactJs, NextJs	Web Development, Machine Learning	Vs code	\N	\N	\N
212	1361	C,C++,Python,Javascript	N/A	Machine Learning, Artificial Intelligence, Data Science, Cyber Security	PowerBI,Tableau,Photoshop,GIMP	\N	\N	\N
213	393	N/A	N/A	Web Development, Machine Learning, Data Science	N/A	\N	\N	\N
214	1390	Java , python , c,etc	React.js, HTML, MySql, CSS, Javascript ,etc \nPowerBI, seaborn , matplotlib , scilit learn , tablaeu, etc	Web Development, Machine Learning, Data Science	N/A	\N	\N	\N
215	1435	C++, python	N/A	Web Development	N/A	\N	\N	\N
225	430	C, python, c++	N/A	Machine Learning, Artificial Intelligence	N/A	\N	\N	\N
216	418	C, C++, Python, Java,Kotlin	DSA, OOPS, DBMS, Webdev, AppDev, Ai Automation	Web Development, Artificial Intelligence, Cyber Security	VS Code, Android Studio , Notepad C++	\N	\N	\N
220	1442	N/A	N/A	Web Development, Other	VScode	\N	\N	\N
223	1443	N/A	N/A	Machine Learning, Artificial Intelligence, Other	N/A	\N	\N	\N
217	1414	Java , C , C++ , Python	Java, Spring Boot, MongoDB ,SQL, Git/GitHub	Web Development, Machine Learning, Artificial Intelligence, Other	Git , GitHub , VS Code, IntelliJ IDEA ,pyCharm	\N	\N	\N
219	1387	Python – Data science, machine learning, deep learning, computer vision, automation\n\nC / C++ – System programming, robotics, performance-critical applications\n\nR – Data mining, statistical analysis, data visualization\n\nSolidity – Smart contract development on Ethereum, DApps, Web3 integration	Blockchain Development → Ethereum, Smart Contracts, DApps, Token Standards (ERC20/ERC721), Web3 Integration\n\nFrameworks → HardHat, Truffle\n\nMachine Learning / Deep Learning → TensorFlow, Keras, PyTorch, Scikit-learn\n\nComputer Vision & Data Science Tools → OpenCV, Pandas, NumPy, Matplotlib, Seaborn, Plotly\n\nDatabases & Backend → SQL, PostgreSQL, NoSQL\n\nSystem Design → High-Level Design (Load Balancing, Caching, API Gateway, Messaging Queues, Database Sharding, Scalability Patterns)	Machine Learning, Artificial Intelligence, Data Science, Cyber Security	Version Control & Collaboration → Git, GitHub\n\nDevelopment & IDEs → Visual Studio Code, Jupyter Notebook, Google Colab, Anaconda\n\nBlockchain Platforms → Ethereum, MetaMask, Web3.js, Remix IDE\n\nCloud & Deployment → (if applicable) AWS basics / Google Cloud (you can add if you’ve used them in projects)\n\nIoT Platforms → Arduino, Raspberry Pi (from your IoT & robotics work)\n\nData & Analytics Tools → Excel, Tableau (if you’ve used them; otherwise can stick to Python stack)	\N	\N	\N
221	1581	Python	Tensor flow, Google Collaboratary,ML	Machine Learning, Artificial Intelligence	Google Collaboratary, tensor flow, streamline,pandas,mathplotlib,	\N	\N	\N
218	445	C, C++, python, Java, R, HTML, css, php, mongodb.	PowerBI, excel, powerpoint, lovable etc..	Web Development, Machine Learning, Artificial Intelligence, Data Science, Other	Wix, figma etc..	\N	\N	\N
222	420	C (basic)\n\nC++ (basic)\n\nHTML, CSS (web frontend basics)\n\nPython (used in AI/ML projects like Face Mask Detection)	PostgreSQL (database management)\n\nIoT (sensor-based systems, microcontroller programming)\n\nAI/ML (OpenCV, dataset training for computer vision)	Data Science, Other	N/A	\N	\N	\N
228	1425	N/A	N/A	Web Development, Artificial Intelligence	N/A	\N	\N	\N
224	1330	c , c++ , python, kotlin , java	flutter,android studio , kotlin , react , node js , premier pro	Web Development, Machine Learning, Artificial Intelligence, Other	N/A	\N	\N	\N
226	394	N/A	N/A	Web Development, Other	N/A	\N	\N	\N
227	390	N/A	N/A	Web Development	N/A	\N	\N	\N
229	362	N/A	N/A	Web Development, Artificial Intelligence, Cyber Security	N/A	\N	\N	\N
230	1584	N/A	N/A	Web Development, Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
231	1317	C++ Java HTML	N/A	Web Development	N/A	\N	\N	\N
232	1388	N/A	N/A	Web Development, Artificial Intelligence, Other	N/A	\N	\N	\N
233	696	N/A	N/A	Machine Learning, Other	N/A	\N	\N	\N
234	1380	C,cpp ,python	Machin learning, Django ,ui/ux ,digital marketing, graphic design	Web Development, Machine Learning, Data Science, Other	Vs code , pycharm , figma , Canva , other digital marketing releted tools	\N	\N	\N
235	1396	N/A	N/A	Other	N/A	\N	\N	\N
236	1328	C, c++, java, python, html, css, js	N/A	Web Development, Data Science, Other	N/A	\N	\N	\N
237	1385	c, c++, c#, python, Java, JavaScript, TypeScript	React, NextJs, FastAPI, Django, hardhat	Web Development, Machine Learning, Artificial Intelligence, Data Science, Cyber Security, Other	JIRA, Github, Gemini, Projecteuler	\N	\N	\N
238	402	C,Java, Javascript	React JS, IoT	Web Development, Artificial Intelligence, Other	N/A	\N	\N	\N
239	354	Python \nC	N/A	Machine Learning, Artificial Intelligence, Cyber Security	N/A	\N	\N	\N
240	1392	N/A	N/A	Web Development	N/A	\N	\N	\N
241	1432	Java , C++, Angular , JavaScript , TypeScript	Git, GitHub, Postman, Visual Studio Code, Tailwind, Bootstrap, React.js	Web Development	N/A	\N	\N	\N
242	1421	Programming Languages\n\nPython (Primary for AI/ML)\n\nC/C++\n\nJava\n\nSQL	TensorFlow, PyTorch, scikit-learn (ML/DL)\n\nFastAPI (back-end deployments)\n\nFlask\n\nGit, Docker\n\nPinecone (vector DB)\n\nGoogle Cloud Platform, AWS\n\nPandas, NumPy, Matplotlib	Machine Learning, Artificial Intelligence, Data Science	Kaggle\n\nHugging Face\n\nGitHub\n\nGoogle Colab\n\nJupyter Notebook\n\nVercel, DigitalOcean (deployments)\n\nSwayam, NPTEL (learning platforms)\n\nLinkedIn (professional networking)	\N	\N	\N
243	1350	C,c++	N/A	Artificial Intelligence, Data Science	N/A	\N	\N	\N
244	383	Python (libraries)	Tensor flow, streamlit, pycharm	Machine Learning	Google Collab,pycharm, streamlit Arduino uno	\N	\N	\N
245	1377	N/A	N/A	Other	N/A	\N	\N	\N
246	1420	C,Cpp,Python,Java,HTML,CSS,Javascript	nextjs,reactjs	Web Development, Machine Learning, Other	PowerBI,nextjs,reactjs	\N	\N	\N
247	1327	N/A	N/A	Web Development	N/A	\N	\N	\N
248	1349	Basic Python, Java, C, SQL	PostgreSQL	Web Development, Artificial Intelligence	Google Colab, VS Code, GitHub, PostgreSQL, Canva	\N	\N	\N
249	437	C,C++,Java,Python,PHP	Java, SQL, MySQL, Python, Flask framework, Firebase, Render, Arduino, Eclipse, Arduino IDE, Git	Web Development, Artificial Intelligence, Other	Eclipse, Arduino IDE, Render, Git, GitHub, Firebase, MySQL, Spring Framework, Microser	\N	\N	\N
250	1358	C, C++, C#, Python	Machine learning, AI, data science, deep learning	Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
252	1413	C, C++, Python, Java	NextJS, Flask	Web Development, Machine Learning, Artificial Intelligence, Data Science	Git, VScode	\N	\N	\N
251	1524	N/A	N/A	Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
253	1554	C, C++, Python	N/A	Machine Learning, Data Science	N/A	\N	\N	\N
255	1441	N/A	N/A	Web Development	N/A	\N	\N	\N
256	1560	C++, Java, Python(For Data Analysis), SQL	Data Cleaning And Visualisation, NLP, Database Querying, Pandas, Numpy, OpenCV, NLTK, AI/ML	Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
257	1348	C, C++, Python and SQL	N/A	Machine Learning	VS code, Arduino UNO	\N	\N	\N
258	1410	Python,C,C++,solidity	Programming Languages: C, C++, Python, Solidity \nDatabases: MySQL, PostgreSQL \nWeb Technologies: HTML, CSS \nAI/ML & Data Science: scikit-learn, XGBoost, Random Forest, SVC, YOLOv8, OpenCV Blockchain & Smart Contracts: Solidity, Slither (for audits)	Web Development, Machine Learning, Artificial Intelligence, Data Science	Programming & Development: Jupyter, Google Colab, VS Code, Remix IDE \nWeb & Design: WordPress, HTML, CSS, Photoshop \nDatabases: MySQL, PostgreSQL \nOffice & Productivity: MS Office (Word, Excel, PowerPoint)	\N	\N	\N
259	1424	C,C++,python,Dart	Flutter, firebase, PowerBi, Django, Postgre SQL, AWS	Machine Learning, Artificial Intelligence, Data Science	VS code, Android Studio, google Colab, Jupyter notebook	\N	\N	\N
260	1333	Css,html, javascript,sql, bootstrap	N/A	Web Development	N/A	\N	\N	\N
261	1368	N/A	N/A	Machine Learning, Artificial Intelligence	N/A	\N	\N	\N
262	655	N/A	N/A	Web Development	N/A	\N	\N	\N
263	682	c, python	N/A	Cyber Security	N/A	\N	\N	\N
264	657	N/A	N/A	Artificial Intelligence	N/A	\N	\N	\N
265	341	C ,python	N/A	Artificial Intelligence, Data Science	N/A	\N	\N	\N
266	333	C,C++,Python,JavaScript,Html,Css,etc	React js,Django,Bootstrap,flutter,etc	Web Development, Machine Learning, Artificial Intelligence, Data Science, Other	Power Director,Figma,Canva,VS Code,Github,Github Copilot,Veo,Leonardo,Snap Seed,Chat GPT,Gemini,Deepseek,Grammarly,etc	\N	\N	\N
267	1548	C, C++, Python, Java, JavaScript, TypeScript, Kotlin, Dart.	N/A	Machine Learning, Artificial Intelligence, Other	N/A	\N	\N	\N
268	1574	N/A	N/A	Web Development, Data Science, Other	N/A	\N	\N	\N
270	1545	Python – Strong (AI/ML, data analytics, automation, GUI projects, deep learning)\nC – Core programming, problem solving, system-level logic\nSQL – Database management, queries, optimization\nR – Data mining, statistical analysis, visualization	Machine Learning / AI: TensorFlow, PyTorch, Scikit-learn, NLTK, OpenCV\nData & Visualization: Power BI, Pandas, Matplotlib, Seaborn\nDatabases: MySQL, SQLite\nWeb Development: HTML, CSS, JavaScript\nTools & Platforms: MATLAB, Git/GitHub, Cisco IoT, Google Colab, Jupyter Notebook	Web Development, Machine Learning, Artificial Intelligence, Data Science	Programming Languages: Python, C, SQL, R, HTML, CSS, JavaScript\nFrameworks & Technologies: TensorFlow, PyTorch, Scikit-learn, OpenCV, NLTK, Pandas, Matplotlib, Seaborn, Power BI, MySQL, SQLite\nFamiliar Tools: Jupyter Notebook, Google Colab, MATLAB, Git/GitHub, Cisco Packet Tracer, Arduino IDE, LaTeX, MS Office Suite\nPlatforms: Windows, Linux, Google Cloud, AWS (basic), GitHub, VS Code	\N	\N	\N
271	1379	C, C++, Python (basic academic knowledge)	MS Office Suite, MySQL Database, Oracle (basic), Cloud Platforms (AWS, Google Cloud, Google Workspace, Microsoft Teams,  Excel (advanced functions), Power BI (basic), Tableau (introductory), HTML/CSS (basic), Cisco Packet Tracer (basic), Wireshark (introductory), Canva,	Web Development, Artificial Intelligence, Data Science, Other	MS Excel, MS PowerPoint, MS Word, Google Workspace (Docs, Sheets, Slides), MySQL Workbench, Canva, Power BI, Tableau, Microsoft Teams.	\N	\N	\N
277	676	N/A	N/A	Web Development	N/A	\N	\N	\N
269	317	C,c++,python,php,html,css,JavaScript,java,rush,sql	N/A	Web Development, Machine Learning, Data Science, Cyber Security, Other	N/A	\N	\N	\N
272	1405	Java	N/A	Web Development, Machine Learning, Artificial Intelligence, Data Science, Cyber Security, Other	N/A	\N	\N	\N
274	1398	c++,python,c,solidity,javascript.	blockchain,ml;	Web Development, Machine Learning, Cyber Security	N/A	\N	\N	\N
275	1337	Python, c, c++ web development	N/A	Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
273	1558	Python, Java, C++, C,  Dart, JavaScript, HTML, CSS	Git, Agile-Scrum, Numpy, Pandas, Sci-kit Learn, Seaborn, Tensorflow, XGBoost, VGG, INCEPTIONv3, ResNet50, openCV	Web Development, Machine Learning, Artificial Intelligence, Other	Git, Lovable, WordPress,	\N	\N	\N
276	1547	Java,C	N/A	Web Development, Machine Learning, Artificial Intelligence, Cyber Security	N/A	\N	\N	\N
278	1401	N/A	N/A	Cyber Security	N/A	\N	\N	\N
279	1549	C,C++,HTML,CSS,SQL	N/A	Artificial Intelligence, Other	VScode,Leetcode,Codechef,HackerRank,MSoffice	\N	\N	\N
280	1419	N/A	N/A	Web Development, Other	N/A	\N	\N	\N
281	1440	Python, C, C++	N/A	Web Development, Machine Learning, Artificial Intelligence	N/A	\N	\N	\N
283	1582	C, C++, Python	N/A	Artificial Intelligence, Other	N/A	\N	\N	\N
284	1427	N/A	N/A	Cyber Security	N/A	\N	\N	\N
285	670	N/A	N/A	Web Development, Data Science	N/A	\N	\N	\N
286	1397	N/A	N/A	Machine Learning	N/A	\N	\N	\N
287	443	C,c++,java ,python ,DBMS,	..	Machine Learning, Other	Father (farmer), brother (software engineer),mothar(housewife)	\N	\N	\N
288	1578	C,C++ and Phyton	Panda's and tensor flow	Artificial Intelligence	Goggle colab and MySQL	\N	\N	\N
289	1389	C and C++ have strengthened my foundation in problem-solving, data structures, and algorithms.\n\nJava has given me exposure to object-oriented programming concepts and database-driven projects.\n\nCurrently exploring Python.\n\nHTML and CSS were applied while developing responsive websites, giving me practical web development experience.	With OpenCV and Rasterio, I handled image preprocessing and satellite data for my LandParser research project.\n\nNumPy and Matplotlib were used extensively for data analysis, model evaluation, and visualization.\n\nIn SQL/DBMS, I designed database-driven applications such as a Task Management System.\n\nGit helped me manage code versions and collaborate in team projects effectively.	Web Development	N/A	\N	\N	\N
290	1556	c, c++, c#, python	Git, Linux,	Web Development, Cyber Security, Other	Linux,	\N	\N	\N
291	1566	N/A	N/A	Web Development, Machine Learning	N/A	\N	\N	\N
292	1399	C , cpp , python , java , asm , lua	Ghidra , aws , clip , faiss	Other	N/A	\N	\N	\N
293	1540	Python, C, C++, JavaScript	HTML, CSS, Bootstrap, SQL, Node.js, Express	Web Development, Machine Learning, Artificial Intelligence	Object-Oriented Programming (OOP), Basic Data Structures & Algorithms (DSA)	\N	\N	\N
294	1527	C, C++, Java, Python, SQL, HTML, CSS, JavaScript	Power BI, Tableau, Figma, Adobe Photoshop, MySQL, FAISS, Hugging Face, Bootstrap, React (basic), Git/GitHub	Data Science, Other	MS Excel, MS PowerPoint, Power BI, Figma, Adobe Photoshop, GitHub, Jupyter Notebook, Visual Studio Code, MySQL Workbench, Google Colab, Canva, MS Teams	\N	\N	\N
295	1439	C and python	N/A	Web Development, Other	N/A	\N	\N	\N
296	1393	C, C++,Python, Html, CSS	Scikit-learn ,React.js, HTML, CSS,	Web Development, Machine Learning, Artificial Intelligence	Git, GitHub, Pandas, NumPy, Matplotlib	\N	\N	\N
282	1555	c,c++,pythpn	Python, C, C++, Django, MySQL, Git/GitHub	Web Development, Data Science	Visual Studio Code, MySQL Workbench, Git/GitHub	\N	\N	\N
297	1542	C++,C,SQL	MySQL \nGit\nGitHub	Web Development, Artificial Intelligence, Cyber Security	Power Bi	\N	\N	\N
298	1579	c++,python	Languages: JavaScript, TypeScript, Python, SQL\n\nFrontend: React.js, HTML5, CSS3, Tailwind CSS, Bootstrap\n\nBackend: Node.js, Express.js, Django, Flask\n\nDatabases: PostgreSQL, MongoDB\n\nDevOps / Tools: Git, Docker, AWS (EC2, S3), GitHub Actions, Jenkins\n\nOthers: RESTful APIs, CI/CD, Agile methodologies	Web Development, Artificial Intelligence	React.js, Node.js, Express.js	\N	\N	\N
299	1428	N/A	N/A	Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
300	1563	C, C++, Python	N/A	Web Development, Artificial Intelligence, Other	N/A	\N	\N	\N
301	1430	N/A	N/A	Web Development, Machine Learning, Artificial Intelligence	N/A	\N	\N	\N
302	1412	C,C++, Python,Html and CSS, Java	N/A	Web Development, Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
303	1436	C and python	N/A	Web Development, Other	N/A	\N	\N	\N
304	1568	C, C++ , Java , Python	React.js, Flask, FastAPI, HTML, CSS, Bootstrap, TensorFlow, PyTorch	Web Development, Machine Learning, Artificial Intelligence	Google Colab, Jupyter Notebook, VS Code, GitHub, MySQL, PostgreSQL, MongoDB	\N	\N	\N
305	1434	C, C++, Python, Flutter, MySQL, PostgreSQL, HTML, CSS, JavaScript, Renpy(GameDev)	Flutter, React, Java (Android Development), HTML5, CSS3, Bootstrap, AWS, Figma, Agile and Scrum Methodologies	Web Development, Machine Learning, Artificial Intelligence, Other	GitHub, VS Code, Figma, MySQL, PostgreSQL, AWS (basic), Agile & Scrum	\N	\N	\N
306	1564	N/A	N/A	Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
307	1565	C, C++, Python and Java	Web technologies: HTML and CSS,  Data Structure and Algorithm, Database management: SQL and PostgreSQL, Mobile and web UI/UX design, Flutter application development, Arduino hardware programming, Figma design tools	Web Development, Machine Learning, Artificial Intelligence, Data Science, Cyber Security	Mobile and web UI/UX design, Flutter application development, Arduino hardware programming, Figma design tools	\N	\N	\N
308	1541	C, C++, Python	Frontend: HTML5, CSS3, JavaScript (ES6+), Bootstrap, EJS, React, Backend: Node.js, Express.js, Database: MongoDB, MySQL , Mongoose ORM, Version Control & Deployment: Git, GitHub, Git Bash, npm, Vercel/Netlify/Heroku (deployment platforms), Others: RESTful APIs, AJAX, JSON, Postman (API testing), Multer (file uploads), JWT (authentication), \nFrontend Frameworks/Libraries: Bootstrap, React.js , Backend Frameworks: Express.js (Node.js framework), UI Components & Charts (recent projects): Recharts, Tailwind CSS (if you plan to move beyond Bootstrap), ShadCN UI (for React)	Web Development, Machine Learning, Artificial Intelligence, Data Science, Other	Version Control & Collaboration: Git, GitHub, Development & Debugging: VS Code, Postman, npm, Node Package Manager, Database Management: MongoDB Atlas, MongoDB Compass, MySQL Workbench, Deployment Platforms: Vercel, Netlify, Heroku, Project Management & Communication: Trello, Slack, Microsoft Teams , Cloud & Hosting (basic exposure): AWS (EC2/S3 basics), cPanel hosting	\N	\N	\N
309	1423	C,C++, python	N/A	Cyber Security	Cybersecurity tools like nmap, burpsuite etc.	\N	\N	\N
310	1536	C , C++ , Java , Python , Javascript	N/A	Web Development, Machine Learning	N/A	\N	\N	\N
311	371	C, Python, html, css	N/A	Web Development, Artificial Intelligence	Figma	\N	\N	\N
312	1338	C, C++ , Python and basic JAVA	Data analysis in python, Fundamentals of AI, Datacentric and Explainable AI knowledge.	Machine Learning, Artificial Intelligence, Data Science	NumPy, Canva, PowerBI, Tableau.	\N	\N	\N
313	1526	C, C++, Python, Java, JavaScript, HTML, CSS, SQL	React.js, Node.js, Express.js, Redux, Django, Flask, Mongoose	Web Development	Git, GitHub, Postman, Figma, Google Colab, Supabase, Netlify, Vercel	\N	\N	\N
314	1431	C, C++, Python, Basics of Java	Streamlit, TensorFlow, OpenCV, YOLO, Power BI, Excel, SQL, GitHub,Pandas, NumPy, Scikit-learn, Matplotlib	Machine Learning, Artificial Intelligence	Power BI, Excel, SQL, GitHub, Vs code, Codechef, Leetcode	\N	\N	\N
315	1559	C, C++, Python, Dart, HTML	TensorFlow, Scikit-learn, XGBoost, Matplotlib, BeautifulSoup, ThreadPoolExecutor, Folium	Web Development, Machine Learning, Artificial Intelligence, Cyber Security	Google Colab, VS Code, Microsoft Office, GitHub, TensorFlow, PyTorch, Scikit-learn	\N	\N	\N
319	1539	N/A	N/A	Web Development, Machine Learning, Artificial Intelligence, Data Science, Cyber Security, Other	N/A	\N	\N	\N
320	1521	C Programming\nC++ Programming\nPython\nHTML\nCSS\nData structure	N/A	Web Development, Machine Learning, Artificial Intelligence	VsCode,github	\N	\N	\N
323	1534	python, c++, java	Git , GitHub, VS Code, Deep Learning, OpenCV, NumPy, Pandas, Matplotlib, Firebase,	Web Development, Machine Learning, Artificial Intelligence	jupiter, vs code, github, turbo c,	\N	\N	\N
325	691	c , python , html , css , javascript(ongoing).	N/A	Machine Learning, Artificial Intelligence, Data Science, Cyber Security, Other	N/A	\N	\N	\N
334	1529	C++ and Python	kaggle , AWS, Google Colab	Web Development, Artificial Intelligence	VS Code	\N	\N	\N
335	1576	Java, Adv java, basic python	React, js, css, html,node js	Web Development, Cyber Security	N/A	\N	\N	\N
341	1515	JAVA,C++	SpringBoot,Maven and Some other	Other	N/A	\N	\N	\N
346	1577	Python, C++	N/A	Machine Learning, Artificial Intelligence	N/A	\N	\N	\N
358	1544	C,C++, python	N/A	Web Development, Artificial Intelligence, Data Science	N/A	\N	\N	\N
359	431	N/A	N/A	Machine Learning, Artificial Intelligence, Data Science, Cyber Security	N/A	\N	\N	\N
362	1356	N/A	N/A	Other	N/A	\N	\N	\N
368	1530	N/A	N/A	Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
316	1520	Java, C, C++, JavaScript, SQL,Dot Net,Html,CSS	SpringBoot, TensorFlow, Keras, Scikit-learn, Flask, OpenCV, Pandas, NumPy, Matplotlib, HTML, CSS, React, Node.js, IoT platforms	Web Development, Machine Learning, Artificial Intelligence	Jupyter Notebook, Google Colab, Git/GitHub, VS Code, PyCharm, MATLAB, Arduino, Raspberry Pi, MySQL, Power BI	\N	\N	\N
317	1415	N/A	N/A	Web Development, Machine Learning	N/A	\N	\N	\N
321	1538	C,C++,Python,Javascript	Reactjs, Nodejs, Mongoose, Angular, Git, Github	Web Development	Reactbits, Bootstrap, Udemy, Leetcode, Hackerrank	\N	\N	\N
324	1553	Python	N/A	Data Science	N/A	\N	\N	\N
329	1409	Python, c ,cpp , javascript	N/A	Web Development, Data Science	Programming Languages: Python, R, SQL\n\nData Visualization Tools: Tableau, Power BI, Matplotlib, \n\nData Handling & Storage: MySQL, PostgreSQL\n\nData Cleaning/Analysis: Excel, Jupyter Notebook, Google Colab\n\nCloud Platforms: AWS , Google Cloud ,Microsoft Azure\n\nCollaboration & Version Control: Git, GitHub, GitLab	\N	\N	\N
331	1572	html,css,java	N/A	Web Development	N/A	\N	\N	\N
338	1580	Python and java , C#	N/A	Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
340	1525	C++ \nPython	N/A	Web Development, Data Science, Cyber Security, Other	N/A	\N	\N	\N
345	1551	C,C++, Python,SQL, JavaScript	HTML, CSS, Bootstrap, MySQL, Node.js, React (basic), Machine Learning (Python libraries: Pandas, NumPy, Scikit-learn, Matplotlib)	Web Development, Machine Learning, Artificial Intelligence, Data Science	Git & GitHub, Visual Studio Code, Jupyter Notebook, MySQL Workbench, Google Colab, MS Excel, Coursera, NPTEL	\N	\N	\N
349	1522	Python, Java, C, C++	HTML, CSS, JavaScript, React, Node.js, MySQL, TensorFlow	Web Development, Machine Learning, Artificial Intelligence, Data Science, Cyber Security	N/A	\N	\N	\N
353	1433	C, CPP, Python, JavaScript	N/A	Web Development, Machine Learning, Data Science	N/A	\N	\N	\N
357	403	Java , Javascript , C , C++ , Python	HTML5, CSS3, JavaScript (ES6+), Reactjs, Spring Boot, Spring MVC, Hibernate, JPA, Spring Security, MySQL, PostgreSQL, RESTful APIs	Web Development, Machine Learning, Artificial Intelligence	Git, GitHub, Maven, IntelliJ IDEA , Eclipse, Postman	\N	\N	\N
366	1404	C, C++, Python, Java, Javascript, HTML	Flask, Tableau, Pandas, NumPy, Matplotlib, AWS	Web Development, Machine Learning, Artificial Intelligence, Data Science	Tableau, Flask, Pandas, NumPy, Matplotlib, AWS, MySQL, Excel	\N	\N	\N
369	666	N/A	N/A	Other	N/A	\N	\N	\N
318	1518	c, c++, python.	Data mining.	Web Development, Artificial Intelligence	vs code, Microsoft word, Microsoft excel, Microsoft powerpoint.	\N	\N	\N
322	1528	C++,Python	N/A	Web Development, Artificial Intelligence, Data Science	N/A	\N	\N	\N
326	1550	N/A	N/A	Web Development	N/A	\N	\N	\N
328	1575	C, C++, Python	Data analyst	Data Science, Other	Powerbi, Tableau, Excel	\N	\N	\N
333	1567	C, C++	N/A	Web Development, Data Science	N/A	\N	\N	\N
336	1562	Python \nC\nC++	Flask\nSQL	Data Science	Power BI	\N	\N	\N
344	1514	C, C++, Python, HTML, CSS, Javascript, SQL	react.js, node.js (basics)	Web Development, Artificial Intelligence, Cyber Security	VS Code, GitHub, SQL, AWS, Wireshark	\N	\N	\N
348	1519	N/A	N/A	Web Development, Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
350	1400	N/A	N/A	Artificial Intelligence, Data Science	N/A	\N	\N	\N
351	1402	Pyhton	N/A	Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
367	1340	C, C++, Python	Django, Flask	Machine Learning, Artificial Intelligence, Data Science	VS code, Git, GitHub, Google Colab, Jupyter Notebook, Unity,	\N	\N	\N
327	1523	Java , C++ , Python , C .	HTML , CSS , JavaScript,NodeJS, ReactJS.	Web Development	VS Code .	\N	\N	\N
254	1408	JAVA, Python, C, SQL, HTML, CSS, JS	Spring, Flask, OpenCV, Tensorflow	Web Development, Machine Learning, Artificial Intelligence	SQL Workbench, Github, Power BI, WordPress	\N	\N	\N
330	1532	C, C++, Python	Machine Learning & AI: CNNs, Siamese Networks, YOLOv5, Detectron2, OpenCV\nWeb Development: HTML, CSS,FastAPI\nDatabases: PostgreSQL\nOther Tools & Libraries: Git, LeetCode (problem solving), Chatbot Integration	Machine Learning, Artificial Intelligence	N/A	\N	\N	\N
332	1573	Python, Flask, C,C++,SQL	Flask \nStreamlit \nspaCy \nTogether.ai API	Web Development, Machine Learning, Artificial Intelligence	N/A	\N	\N	\N
337	1543	Python,java	N/A	Web Development, Machine Learning, Data Science	N/A	\N	\N	\N
339	1570	N/A	N/A	Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
342	1516	Python, Java , C,C++	N/A	Web Development, Machine Learning, Artificial Intelligence, Data Science	N/A	\N	\N	\N
343	1533	Python, C, C++	Python, NumPy, Pandas, Matplotlib, TensorFlow, Ursina Engine	Web Development, Other	N/A	\N	\N	\N
347	1517	C, Python , Java  , C++	scikit-learn,TensorFlow, Keras (introductory level)	Machine Learning, Artificial Intelligence, Data Science	Colab Notebook , Github	\N	\N	\N
352	1552	C, Python,Java	Numpy,Pandas,Matplotlib	Web Development, Machine Learning, Data Science	N/A	\N	\N	\N
354	982	C, C++, Python, Javascript	Nodejs, express js, React	Web Development	N/A	\N	\N	\N
355	1546	python, c, c++, java, c#, javascript,	react js, express js, django, flask, react native	Web Development, Machine Learning, Artificial Intelligence, Data Science, Cyber Security, Other	N/A	\N	\N	\N
360	701	c,c++,python	N/A	Artificial Intelligence	N/A	\N	\N	\N
361	1320	C, C++, Python	N/A	Web Development, Artificial Intelligence, Data Science	N/A	\N	\N	\N
363	424	C,C++, python, javascript	Mern stack, data analytics, BCI	Web Development, Artificial Intelligence, Data Science, Other	Vs code, git and GitHub, vertex ai workbench	\N	\N	\N
364	408	C, C++, Java, Python, etc.	N/A	Artificial Intelligence, Data Science, Other	N/A	\N	\N	\N
365	1537	Python, c and c++	N/A	Machine Learning, Artificial Intelligence, Data Science, Cyber Security, Other	Tableau, power bi, python, tensorflow,	\N	\N	\N
32	318	c language , python,html,css.	N/A	Web Development, Machine Learning, Artificial Intelligence	N/A	\N	\N	\N
370	376	N/A	N/A	Web Development, Artificial Intelligence, Data Science	N/A	\N	\N	\N
198	412	C,C++	Html,Css,Javascript,SQL	Web Development, Machine Learning, Artificial Intelligence	Vscode,TurboC,MySQL	\N	\N	\N
371	316	C , Python , c++,html	N/A	Web Development, Cyber Security, Other	N/A	\N	\N	\N
372	426	N/A	N/A	Artificial Intelligence, Data Science	N/A	\N	\N	\N
373	685	N/A	N/A	Web Development, Artificial Intelligence, Cyber Security	N/A	\N	\N	\N
374	1531	N/A	N/A	Web Development, Machine Learning, Artificial Intelligence, Data Science, Cyber Security, Other	N/A	\N	\N	\N
375	444	Python, Java, C, C++	HTML, CSS, JavaScript, React, Node.js, Express.js, MongoDB, Flutter, Git/GitHub, MySQL	Web Development, Machine Learning, Artificial Intelligence, Data Science	VS Code, Git, GitHub, Postman, Jupyter Notebook, Google Colab, MySQL Workbench, MongoDB Compass, Node Package Manager (NPM), Anaconda, Firebase, Docker (basic), Linux/Ubuntu	\N	\N	\N
376	417	N/A	N/A	Web Development, Machine Learning, Artificial Intelligence	N/A	\N	\N	\N
377	983	N/A	N/A	Artificial Intelligence, Other	N/A	\N	\N	\N
378	411	C , C++ , Java	Git	Machine Learning, Artificial Intelligence, Data Science	Visual studio code	\N	\N	\N
379	397	C, python, C++ , oops	N/A	Machine Learning, Artificial Intelligence, Cyber Security	N/A	\N	\N	\N
381	1331	N/A	N/A	Artificial Intelligence, Other	N/A	\N	\N	\N
382	1324	C,C++,Python	MATLAB,Fusion 360,Figma,	Web Development, Machine Learning, Artificial Intelligence, Data Science	Git/Github,Anaconda,Pycharm	\N	\N	\N
383	1342	C, C++, Python, Typescript, Javascript, SQL, NoSQL	HTML5, CSS3, Remix.js, React.js, node.js, Express.js, SQL, MongoDB, Three.js, GSAP, Firebase, Excel, Bootstrap, React native , Git, Github, Github Actions, Arduino, PowerBI, Vercel, prompt Engineering, Figma.	Web Development, Data Science, Other	Leetcode, Hackerrank, Codechef, N8N, Github Spark	\N	\N	\N
384	1374	HTML, C, C++, Python	Numpy, Pandas, Matplotlib, Scikit-learn, Tensorflow, Pytorch, Keras, Catboost, Speech recognition, ASR model	Machine Learning, Data Science	Python, Jupyter notebook, Google Colab, Github, VS Code, Pandas, Numpy, Matplotlib, Tensorflow	\N	\N	\N
385	1326	i want to learn Python and explore the field of Artificial Intelligence	NA	Machine Learning, Artificial Intelligence	NA	\N	\N	\N
386	1335	Python(basics)	_	Web Development, Machine Learning, Artificial Intelligence, Cyber Security	_	\N	\N	\N
387	440	C, C++, Java, Python	HTML, CSS, Javascript,Bootstrap, Tailwind,React	Web Development, Machine Learning, Artificial Intelligence, Data Science, Cyber Security	N/A	\N	\N	\N
388	658	N/A	N/A	Machine Learning, Artificial Intelligence, Other	N/A	\N	\N	\N
389	1319	C,C++,html,css,js	N/A	Web Development	N/A	\N	\N	\N
390	348	C,Python,HTMl,CSS	Data Structure and Algorithm	Artificial Intelligence, Data Science	Github,VS code,CHATGPT	\N	\N	\N
391	1557	C , C++, Python.	Machine Learning, OpenCV.	Web Development, Machine Learning, Artificial Intelligence	N/A	\N	\N	\N
392	398	N/A	N/A	Artificial Intelligence, Cyber Security	N/A	\N	\N	\N
393	674	N/A	N/A	Web Development	N/A	\N	\N	\N
394	710	C, Python, Java, HTML, CSS	N/A	Machine Learning, Artificial Intelligence, Other	N/A	\N	\N	\N
395	373	c language , python, html.	N/A	Web Development	N/A	\N	\N	\N
396	1375	N/A	N/A	Cyber Security	N/A	\N	\N	\N
397	1369	C, C++, Java, JavaScript, Python.	Java Technologies.	Web Development, Machine Learning, Artificial Intelligence	Udemy, Internet.	\N	\N	\N
380	1367	N/A	N/A	Artificial Intelligence, Data Science	N/A	\N	\N	\N
356	981	Oops	N/A	Web Development	Vs code, sublime text	\N	\N	\N
407	1685	aerc	wer	Web Development	fvd	\N	\N	\N
56	342	2g22g2	g2g2g2	Web Development, Machine Learning, Data Science	2g2g2\n[[KYS_META]]{"technical_soft_skills_overall":"web dev","additional_technical_skills":"gf2g2","additional_soft_skills":"g22g","skill_programs":[{"course_title":"intro to probability and statistis","platform":"NPTEL","duration_hours":200,"date_from":"2026-02-12","date_to":"2026-06-20"},{},{}]}	\N	\N	\N
\.


--
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student (id, uid, first_name, middle_name, last_name, semester, section, current_year, year_of_admission, user_id, mentor_id, admission_type, passout_year) FROM stdin;
376	23001003	NIMISHA	SURESH	NAIR	5	B	3	2023	379	5	\N	\N
373	23001135	Sanand	Santosh	Sabne	3	A	2	2023	376	20	\N	\N
372	24003122	SHIVNAYAN	ASHOK	THAKARE	3	A	2	2024	375	16	\N	\N
371	24003117	TANUSHREE	SHRIRAM	DESHPANDE	3	A	2	2024	374	12	\N	\N
378	23001006	SHREESH	SANTOSH	PAWAR	5	B	3	2023	381	17	\N	\N
676	24003141	ENOSH	SHAMUEL	RAMTEKE	3	B	2	2024	682	22	\N	\N
379	23001008	JENIKA	KISHOR	BARAI	5	B	3	2023	382	16	\N	\N
383	23001018	DEVANSHU	SANJAY	EKHAR	5	B	3	2023	386	5	\N	\N
369	24003114	SAVIO	\N	CHERIAN	3	A	2	2024	372	7	\N	\N
335	24003047	SHUBHAM	SHRIRAMJI	DONGARE	3	A	2	2024	338	14	\N	\N
395	23001046	SEBASTIAN	ANTHONY	GUNTUR	5	B	3	2023	398	14	\N	\N
355	24003085	DHANASHREE	RAVINDRA	DAHAKE	3	A	2	2024	358	18	\N	\N
1355	23001085	VANSH	GANESH	BARDE	5	A	3	2023	1370	18	\N	\N
385	23001021	SANKET	MURLIDHAR	KADHAO	5	B	3	2023	388	9	\N	\N
391	23001035	TEENAL	BIJU	JOSEPH	5	B	3	2023	394	9	\N	\N
399	23001054	SHREYASH	VILAS	TAWADE	5	B	3	2023	402	9	\N	\N
351	24003080	SAMIKSHA	VIMESHWAR	THAWAKAR	3	A	2	2024	354	6	\N	\N
393	23001040	SHAWN	STANLEY	GREGORY	5	B	3	2023	396	11	\N	\N
388	23001031	ANNLIN	ANNA	MATHEW	5	B	3	2023	391	12	\N	\N
706	24003171	VEDANT	HEMRAJ	KHETRE	3	B	2	2024	712	12	\N	\N
322	24003022	GAURAV	DEEPAK	TRIBHUWAN	3	A	2	2024	325	15	\N	\N
386	23001024	BHAIRAVI	RAMKRUSHNA	SAWALE	5	B	3	2023	389	15	\N	\N
387	23001027	NUPUR	JITENDRA	THAKKAR	5	B	3	2023	390	15	\N	\N
651	24003110	HIYAILEN	DINAMANI OINAM	KHUMAN	3	B	2	2024	657	15	\N	\N
398	23001051	GREGORY	SAJU	THOMAS	5	B	3	2023	401	7	\N	\N
686	24003151	NACHIKET	AJAY	PARKHI	3	B	2	2024	692	7	\N	\N
336	24003050	NIKITA	SANJAY	BHUSHANWAR	3	A	2	2024	339	8	\N	\N
344	24003068	SAHIL	SURAJ	GIRME	3	A	2	2024	347	8	\N	\N
1378	23001140	MANCHIT	\N	CHOUDHARY	5	A	3	2023	1393	8	\N	\N
361	24003095	SHRUSHTI	RAGHUVIR	VAIDYA	3	A	2	2024	364	10	\N	\N
381	23001014	SEJAL	RAVINDRA	BHUPAL	5	B	3	2023	384	10	\N	\N
326	24003030	PIYUSH	SUNIL	DESHMUKH	3	A	2	2024	329	21	\N	\N
382	23001015	VEDANT	SANTOSH	LADE	5	B	3	2023	385	21	\N	\N
332	24003039	LOKESH	MANOJ	BARVE	3	A	2	2024	335	19	\N	\N
397	23001049	PETER	ROSHAN	SALVE	5	B	3	2023	400	13	\N	\N
350	24003079	PRANAV	SUBHASH	KHAWASHI	3	A	2	2024	353	17	\N	\N
330	24003036	VEDANTI	JITENDRAPURI	GOSAI	3	A	2	2024	333	22	\N	\N
1365	23001107	MOHIT	MUKESH	TELANG	5	A	3	2023	1380	22	\N	\N
353	24003082	JOSHUA	BINOJ	ABRAHAM	3	A	2	2024	356	23	\N	\N
352	24003081	TRISHA	RAJU	JUNGHARE	3	A	2	2024	355	20	\N	\N
396	23001047	ANOSH	SATISH	SUKHADEVE	5	B	3	2023	399	20	\N	\N
394	23001045	DEVESH	LEKHRAM	BANOTE	5	B	3	2023	397	24	\N	\N
325	24003028	AARON	CLIVE	GARVIN	3	A	2	2024	328	3	\N	\N
343	24003066	NEELAM	PRAVEEN	LASHKARE	3	A	2	2024	346	3	\N	\N
354	24003083	STANZIN	-	CHOSRAB	3	A	2	2024	357	3	\N	\N
390	23001033	ROSHNI	BHIMRAO	KHEDKAR	5	B	3	2023	393	3	\N	\N
313	24003003	OM	\N	NAGPURE	3	A	2	2024	316	5	\N	\N
318	24003013	KADAMBARI	MANISH	UKINKAR	3	A	2	2024	321	5	\N	\N
316	24003008	ISHU	RAJ	EKKA	3	A	2	2024	319	20	\N	\N
364	24003099	HIMANSHU	KAMLAKAR	KEDAR	3	A	2	2024	367	18	\N	\N
389	23001032	ADOLPH	NICHOLAS	PETER	5	B	3	2023	392	18	\N	\N
314	24003005	ANISH	KISHOR	BEZALWAR	3	A	2	2024	317	9	\N	\N
392	23001036	KEN	CHERIAN	MATHAI	5	B	3	2023	395	9	\N	\N
375	23001002	INDRAYANI	PRASHANT	MUDE	5	B	3	2023	378	6	\N	\N
312	24003002	MAYURESH	NIRANJAN	MANGRULKAR	3	A	2	2024	315	7	\N	\N
315	24003007	ESHA	BHALCHANDRA	RODE	3	A	2	2024	318	10	\N	\N
357	24003088	PARIKA	RAVINDRA	PANDHARKAR	3	A	2	2024	360	10	\N	\N
981	24103006	KASHISH	ROBERT	JOSEPH	5	A	3	2024	991	10	\N	\N
319	24003017	ROSHAN	NARAYAN	BHENDE	3	A	2	2024	322	19	\N	\N
311	24003001	AMAN	\N	MARTIN	3	A	2	2024	314	17	\N	\N
1372	23001121	SHEETAL	\N	DEVI	5	A	3	2023	1387	17	\N	\N
317	24003011	BHAVESH	ARUN	GHUBDE	3	A	2	2024	320	23	\N	\N
329	24003034	ADITYA	PRASHANT	YENDE	3	A	2	2024	332	5	\N	\N
708	24003173	ROHINI	PRAKASH	SHENDE	3	B	2	2024	714	5	\N	\N
327	24003031	HARSH	SANJEEV	GUPTA	3	A	2	2024	330	24	\N	\N
328	24003032	JENNIFER	PHILIPS	JOSEPH	3	A	2	2024	331	24	\N	\N
321	24003020	AYUSH	SACHIN	AHALE	3	A	2	2024	324	16	\N	\N
339	24003053	KANCHAN	NITIN	GHODE	3	A	2	2024	342	16	\N	\N
1364	23001106	ADITYA	MAHESH	NAGPURKAR	5	A	3	2023	1379	16	\N	\N
340	24003059	SOHAM	VIJAY	KALE	3	A	2	2024	343	14	\N	\N
341	24003063	JAISON	BABYCHAN	CHANDI	3	A	2	2024	344	14	\N	\N
333	24003043	SWADHIN	VISHWANATH	UPADHYAY	3	A	2	2024	336	9	\N	\N
331	24003037	NOEL	RAJESH	ALGAR	3	A	2	2024	334	11	\N	\N
338	24003052	GAURI	SURENDRA	GOTMARE	3	A	2	2024	341	15	\N	\N
323	24003025	VIDHIKA	SACHIN	THAKRE	3	A	2	2024	326	8	\N	\N
320	24003019	ROZANNE	AKASH	PAUL	3	A	2	2024	323	21	\N	\N
346	24003071	VEDANT	RAMU	GHATOLE	3	A	2	2024	349	21	\N	\N
324	24003027	BHAGYASHRI	BABANRAO	RAHANGDALE	3	A	2	2024	327	13	\N	\N
337	24003051	ANSHUL	RAVINDRA	THAKRE	3	A	2	2024	340	13	\N	\N
345	24003070	ALISHA	ANTHONY	LOUIS	3	A	2	2024	348	17	\N	\N
334	24003045	DRISHTI	HEMANT	BAWANKAR	3	A	2	2024	337	22	\N	\N
347	24003072	ATHARVA	GAJANAN	JOSHI	3	A	2	2024	350	24	\N	\N
349	24003078	DRAVISH	GANESH	PARDHI	3	A	2	2024	352	9	\N	\N
348	24003074	PARTH	SUJIT	KHANDAR	3	A	2	2024	351	6	\N	\N
1384	24003012	SHRAVANI BOBDE			3	A	2	2024	1400	12	\N	\N
425	23001119	JEENA	P V	JOSEPH	5	B	3	2023	428	23	\N	\N
401	23001059	MANSI	BHALCHANDRA	RAHANGDALE	5	B	3	2023	404	16	\N	\N
405	23001065	ANCHAL	SHAILESH	GUPTA	5	B	3	2023	408	21	\N	\N
412	23001089	KSHITIJ	KALPESH	DESHMUKH	5	B	3	2023	415	16	\N	\N
407	23001069	PRAFUL	PYARELAL	KHARPURIYE	5	B	3	2023	410	14	\N	\N
362	24003096	RUCHIKA	PANKAJ	THOSAR	3	A	2	2024	365	19	\N	\N
400	23001055	TANVI	RITESH	KSHIRSAGAR	5	B	3	2023	403	19	\N	\N
367	24003111	RISHITA	SHIVADAS	POKHARE	3	A	2	2024	370	13	\N	\N
414	23001095	KAUSHIK	CHANDRASHEKHAR	SHAHU	5	B	3	2023	417	14	\N	\N
404	23001064	VANSH	PRAMOD	MAHESHGAWLI	5	B	3	2023	407	13	\N	\N
356	24003086	VALENCIO	ROBIN	WILLIAM	3	A	2	2024	359	17	\N	\N
438	24103103	VEDANT	\N	VAIRALE	5	B	3	2024	441	14	\N	\N
368	24003112	REVANT	SANTOSH	BAJPAI	3	A	2	2024	371	18	\N	\N
439	24103104	SURAJ	\N	MUDE	5	B	3	2024	442	18	\N	\N
408	23001070	KRISH	PRAKASH	GOKHALE	5	B	3	2023	411	17	\N	\N
1383	24103005	ARYA SHRIKRISHNA WAGHMARE			5	A	3	2024	1398	9	\N	\N
370	24003116	ABHINAV	VINAYKUMAR	SINGH	3	A	2	2024	373	6	\N	\N
422	23001112	SIDDHANT	SHRIKANT	SHINDEY	5	B	3	2023	425	6	\N	\N
363	24003097	ETHAN	IVAN	ANTHONY	3	A	2	2024	366	11	\N	\N
366	24003107	MAYANK	SANJAY	SAHA	3	A	2	2024	369	11	\N	\N
434	23001139	ROHAN	\N	SINGH	5	B	3	2023	437	11	\N	\N
443	24103108	WARAD	\N	KALYANKAR	5	B	3	2024	446	11	\N	\N
437	24103102	RUSHIKESH	\N	BHANDEKAR	5	B	3	2024	440	12	\N	\N
365	24003103	RACHANA	HARISH	REWATKAR	3	A	2	2024	368	15	\N	\N
435	23001141	RASHI	RAJU	BONGIRWAR	5	B	3	2023	438	15	\N	\N
359	24003090	DEVASHISH	DEWANAND	KAMBLE	3	A	2	2024	362	7	\N	\N
426	23001120	PALAK	LALIT	DUGAD	5	B	3	2023	429	7	\N	\N
423	23001113	JONATHAN	EMMANUEL	SHIJU	5	B	3	2023	426	20	\N	\N
427	23001125	VAIBHAVI	CHANDRASHEKHAR	NAVGHARE	5	B	3	2023	430	20	\N	\N
1409	22001060	Pranav	Dilip	Hatwar	7	B	4	2022	1425	\N	\N	\N
1410	22001062	SANVED	SHARAD	KABADE	7	B	4	2022	1426	\N	\N	\N
441	24103106	ROYAL	\N	HADKE	5	B	3	2024	444	17	\N	\N
431	23001132	SANYUJA	RAJESH	SONKUWAR	5	B	3	2023	434	20	\N	\N
402	23001061	MITALI	VINOD	CHATAP	5	B	3	2023	405	24	\N	\N
436	24103101	SHIVAM	\N	KURHADKAR	5	B	3	2024	439	24	\N	\N
403	23001062	NISHIKANT	NAMDEO	DALAL	5	B	3	2023	406	3	\N	\N
433	23001138	JUNAID	\N	HAMEED	5	B	3	2023	436	3	\N	\N
444	22001046	ANUGRAHA	\N	KASBE	5	B	3	2022	447	3	\N	\N
1052	23001066	HIMANSHU	VIJAY	MIRE	5	A	3	2023	1063	3	\N	\N
413	23001090	ANVESH	NITIN	MULKALWAR	5	B	3	2023	416	8	\N	\N
420	23001105	HANNAH	ELSA	ABRAHAM	5	B	3	2023	423	8	\N	\N
417	23001101	PARTH	MUKUL	LONKAR	5	B	3	2023	420	10	\N	\N
432	23001137	NALAKSH	\N	RANDHAWA	5	B	3	2023	435	10	\N	\N
358	24003089	KHUSHI	PRAKASH	PATANKAR	3	A	2	2024	361	22	\N	\N
411	23001088	DARSHAN	HARIDAS	GADEKAR	5	B	3	2023	414	22	\N	\N
415	23001097	SAKSHI	SHIVLAL	BONDRE	5	B	3	2023	418	22	\N	\N
418	23001103	SHIVJEET	PREMSINGH	PATEL	5	B	3	2023	421	22	\N	\N
440	24103105	ABISHAI	\N	AMAIR	5	B	3	2024	443	22	\N	\N
360	24003092	KRISH	NARESH	LANJEWAR	3	A	2	2024	363	23	\N	\N
421	23001109	KRUSHNA	SUNIL	TAIWADE	5	B	3	2023	424	23	\N	\N
1412	22001066	Tanushree	\N	Joshi	7	B	4	2022	1428	\N	\N	\N
1413	22001070	Ayush	\N	Kshirsagar	7	B	4	2022	1429	\N	\N	\N
1416	22001077	Sayali	Sanjay	Bamanpalliwar	7	B	4	2022	1432	\N	\N	\N
649	24003108	NAVAJOT	YANKESH	MISHRA	3	B	2	2024	655	17	\N	\N
380	23001012	SAYALI	SANDIP	BAMBAL	5	B	3	2023	383	13	\N	\N
653	24003115	SAVIO	\N	SANTHOSH	3	B	2	2024	659	11	\N	\N
688	24003153	YUGAL	RAVINDRA	KALASKAR	3	B	2	2024	694	3	\N	\N
1445	23101012	Palash	Wasudeo	Bhong	7	B	4	2023	1461	\N	\N	\N
1444	23101010	Shreyash	Ramratan	Wadibhasme	7	B	4	2023	1460	\N	\N	\N
664	24003129	JOEL	KADAMTHOTTU	BIJU	3	B	2	2024	670	17	\N	\N
406	23001067	SANKET	BHARAT	NAGAPURE	5	B	3	2023	409	18	\N	\N
445	22001107	SAM	CHACKO	RUBY	5	B	3	2022	448	16	\N	\N
654	24003118	RUTUJA	DIWAKAR	WAGHE	3	B	2	2024	660	13	\N	\N
419	23001104	VEDIKA	ANAND	MALHOTRA	5	B	3	2023	422	19	\N	\N
442	24103107	SHRAVAN	\N	WARGANTIWAR	5	B	3	2024	445	19	\N	\N
689	24003154	ADITYA	SHATRUGHNA	CHAFALE	3	B	2	2024	695	3	\N	\N
416	23001098	VIDHI	PRAVIN	MENGHARE	5	B	3	2023	419	8	\N	\N
410	23001077	ATHARVA	RAVINDRA	KAMDE	5	B	3	2023	413	18	\N	\N
677	24003142	SHERWIN	SHERIDAN	DIAS	3	B	2	2024	683	22	\N	\N
657	24003121	ATHARVA	RAJESH	SONONE	3	B	2	2024	663	13	\N	\N
673	24003138	JOYSEE	RAJU	KANNURI	3	B	2	2024	679	11	\N	\N
685	24003150	VEDANSHU	PRASHANT	MUNGAL	3	B	2	2024	691	20	\N	\N
430	23001131	SAVERI	GAUTAM	DONGRE	5	B	3	2023	433	7	\N	\N
662	24003127	HARSH	CHANDRA	THAKRE	3	B	2	2024	668	12	\N	\N
648	24003010	TEJAS	VILAS	ADHAL	3	B	2	2024	654	15	\N	\N
650	24003109	SWARA	SANDEEP	NISAL	3	B	2	2024	656	9	\N	\N
667	24003132	DEVENDRA	PANCHAM	RAHATE	3	B	2	2024	673	8	\N	\N
665	24003130	SANKALP	SANJAY	JADHAO	3	B	2	2024	671	7	\N	\N
658	24003123	AKSHAT	BALKRISHNA	JAIWAR	3	B	2	2024	664	19	\N	\N
647	24003004	MAYURESH	\N	ITANKAR	3	B	2	2024	653	10	\N	\N
428	23001126	ANUSHREE	DHARMENDRA	KHADGI	5	B	3	2023	431	6	\N	\N
424	23001118	AYUSH	PANKAJKUMAR	JAISWAL	5	B	3	2023	427	21	\N	\N
670	24003135	KEVIN	MERWYN	FERNANDES	3	B	2	2024	676	8	\N	\N
678	24003143	ELVINA	ALFRED	LOVETT	3	B	2	2024	684	22	\N	\N
680	24003145	TUSHAR	SATISH	TIPLE	3	B	2	2024	686	10	\N	\N
700	24003165	GAURAV	DNYANESHWAR	GULHANE	3	B	2	2024	706	15	\N	\N
409	23001074	SIDDHANT	TULSHIDAS	LOHAKAR	5	B	3	2023	412	5	\N	\N
661	24003126	SWAROOP	ASHOK	GABHANE	3	B	2	2024	667	9	\N	\N
671	24003136	PRAYUKTA	MOHAN	MADNIWALE	3	B	2	2024	677	9	\N	\N
674	24003139	MARIO	MARTIN	AGADE	3	B	2	2024	680	5	\N	\N
694	24003159	BHAVISHKA	ANAND	PAUNIKAR	3	B	2	2024	700	17	\N	\N
652	24003113	SAHASTRANSHU	RAJESHKUMAR	SHANDILYA	3	B	2	2024	658	16	\N	\N
701	24003166	CHETAN	VASANT	GAIKWAD	3	B	2	2024	707	17	\N	\N
710	24003176	SHLOK	MANGESH	HOTEY	3	B	2	2024	716	5	\N	\N
384	23001019	VANSHIKA	SUNIL	KHEDKAR	5	B	3	2023	387	23	\N	\N
663	24003128	ISHAN	INDERJEET	BASSIN	3	B	2	2024	669	23	\N	\N
666	24003131	PRATHAM	PRASHANT	TIWARI	3	B	2	2024	672	14	\N	\N
377	23001004	SIDDHESH	GANESH	BHIWAPURKAR	5	B	3	2023	380	24	\N	\N
668	24003133	KAJOL	PURUSHOTTAM	WANODE	3	B	2	2024	674	23	\N	\N
675	24003140	FIONA	TERRENCE	SAMUEL	3	B	2	2024	681	19	\N	\N
702	24003167	ARATI	RAMBHAU	SHENDE	3	B	2	2024	708	11	\N	\N
684	24003149	VEDANTIKA	ANIL	BHOYAR	3	B	2	2024	690	14	\N	\N
660	24003125	GUNWANT	GOPAL	BAWANKAR	3	B	2	2024	666	13	\N	\N
692	24003157	PRAJWAL	VINOD	MARTIWAR	3	B	2	2024	698	10	\N	\N
669	24003134	RESA	ISANUR	BENJAMIN	3	B	2	2024	675	21	\N	\N
697	24003162	ARYAN	SURESH	NAKADE	3	B	2	2024	703	12	\N	\N
691	24003156	RISHI	MAHENDRA	WALOKAR	3	B	2	2024	697	14	\N	\N
709	24003174	NEHA	RAJU	PATIL	3	B	2	2024	715	3	\N	\N
656	24003120	KUNAL	VINOD	SAHU	3	B	2	2024	662	6	\N	\N
655	24003119	PAVAN	NAMDEV	RATHOD	3	B	2	2024	661	18	\N	\N
687	24003152	DHANSHREE	HEMANT	HANDE	3	B	2	2024	693	23	\N	\N
693	24003158	VIRAJ	MANOJ	MOHADIKAR	3	B	2	2024	699	21	\N	\N
695	24003160	SANIYA	VIKAS	SHENDE	3	B	2	2024	701	24	\N	\N
679	24003144	ABEL	P	BOVAS	3	B	2	2024	685	13	\N	\N
712	23001013	ATHARVA	SUBHASH	TRINAGARIWAR	3	B	2	2023	718	21	\N	\N
696	24003161	KAVYA	GUNVANT	MUDE	3	B	2	2024	702	24	\N	\N
681	24003146	ISHIKA	SANJAY	BURDE	3	B	2	2024	687	16	\N	\N
659	24003124	AMITANSH	ARVIND	PARDHI	3	B	2	2024	665	6	\N	\N
690	24003155	AYUSH	AVINASH	INGOLE	3	B	2	2024	696	20	\N	\N
707	24003172	ZUBIYA	KHUHSGIL SHAKEEL AHMAD	KHAN	3	B	2	2024	713	20	\N	\N
699	24003164	VAISHNAVI	GUNWANTA	SATONE	3	B	2	2024	705	24	\N	\N
703	24003168	JANHAVI	PRADIP	JOSHI	3	B	2	2024	709	16	\N	\N
682	24003147	SUJAL	SHANTARAM	GAIKWAD	3	B	2	2024	688	6	\N	\N
698	24003163	OJASMITA	ASHOK	KUMBHARE	3	B	2	2024	704	18	\N	\N
711	22001127	PARTHO	JAYANT	BANERJEE	3	B	2	2022	717	18	\N	\N
683	24003148	SPARSH	RAVIKUMAR	CHALOTRA	3	B	2	2024	689	7	\N	\N
672	24003137	ANISH	BARNABAS	KINDO	3	B	2	2024	678	8	\N	\N
704	24003169	SMIT	ANIRUDDHA	PATIL	3	B	2	2024	710	19	\N	\N
705	24003170	RUCHI	RAMESH	AMBATKAR	3	B	2	2024	711	19	\N	\N
1324	23001020	MANTHAN	NAGOBA	DHAWAS	5	A	3	2023	1339	13	\N	\N
1319	23001005	SHREYA	ABHIJIT	ROY	5	A	3	2023	1334	10	\N	\N
1385	22001001	Atharva	Anant	Naitam	7	B	4	2022	1401	\N	\N	\N
1321	23001011	SHARVARI	SHYAM	GHOTEKAR	5	A	3	2023	1336	12	\N	\N
1386	22001003	Manasvi	Mohan	Giradkar	7	B	4	2022	1402	\N	\N	\N
1387	22001006	PARTH	NAGORAO	DANGE	7	B	4	2022	1403	\N	\N	\N
1389	22001010	GARGI	PRABODH	UDAPURE	7	B	4	2022	1405	\N	\N	\N
1391	22001016	Himanshu	Vilas	Hiwanj	7	B	4	2022	1407	\N	\N	\N
982	22001005	RIMANSHU	\N	SONULE	5	A	3	2022	992	9	\N	\N
1338	23001053	AMOD	SACHIN	PATHAK	5	A	3	2023	1353	15	\N	\N
1515	22001002	Nainesh	Vishnu	Zod	7	A	4	2022	1532	\N	\N	\N
1516	22001004	Pratiksha	\N	Parate	7	A	4	2022	1533	\N	\N	\N
1522	22001019	Diya	Anil	Chilmulwar	7	A	4	2022	1539	\N	\N	\N
1523	22001020	Aditya	\N	Raj	7	A	4	2022	1540	\N	\N	\N
1525	22001029	Prayusha	\N	Dhengre	7	A	4	2022	1542	\N	\N	\N
1526	22001030	Harsh	\N	Wanjari	7	A	4	2022	1543	\N	\N	\N
1528	22001037	Timothi	pranil	shandy	7	A	4	2022	1545	\N	\N	\N
1530	22001042	Yogeshvar	Ramdas	Chaudhari	7	A	4	2022	1547	\N	\N	\N
1533	22001052	Danish	Ayub	Gaus	7	A	4	2022	1550	\N	\N	\N
1534	22001055	Harsh	\N	Umredkar	7	A	4	2022	1551	\N	\N	\N
1535	22001058	Pratiksha	Raju	Ghate	7	A	4	2022	1552	\N	\N	\N
1538	22001063	Aditya	Ramkrushna	Bhujade	7	A	4	2022	1555	\N	\N	\N
1540	22001067	Renushree	Pravin	Wadhi	7	A	4	2022	1557	\N	\N	\N
1317	22004037	YASH	\N	MULANKAR	5	A	3	2022	1332	8	\N	\N
1328	23001026	BHUMIKA	JAGANNATH	BOKDE	5	A	3	2023	1343	16	\N	\N
1340	23001058	SURAJ	SHYAM	DHERE	5	A	3	2023	1355	14	\N	\N
1359	23001092	YUGA	NILARAM	KALE	5	A	3	2023	1374	15	\N	\N
1329	23001030	KRUTIKA	RAJENDRA	THAKUR	5	A	3	2023	1344	7	\N	\N
1348	23001078	PARUL	PRAKASH	GAURKAR	5	A	3	2023	1363	22	\N	\N
1349	23001079	MANTHAN	PRASHANT	SHIRKE	5	A	3	2023	1364	13	\N	\N
1327	23001025	MD.	\N	SHAHANWAZ	5	A	3	2023	1342	3	\N	\N
1326	23001023	SOHAM	GIRISH	AKRE	5	A	3	2023	1341	5	\N	\N
983	22001032	NAVIN	\N	CHOLANGI	5	A	3	2022	993	19	\N	\N
1323	23001017	PAYAL	SANJAY	MOHANAPURE	5	A	3	2023	1338	18	\N	\N
1339	23001057	AMRUTA	RAVINDRA	KHARWADE	5	A	3	2023	1354	24	\N	\N
1331	23001037	ELIZABETH	STEPHEN	CHOURI	5	A	3	2023	1346	10	\N	\N
1318	23001001	ROCHAN	SHRISH	AWASTHI	5	A	3	2023	1333	9	\N	\N
1334	23001041	AARUSHI	VINIT	GHADGE	5	A	3	2023	1349	21	\N	\N
1343	23001068	SAHIL	SANJEEV	SHRIVASTAVA	5	A	3	2023	1358	19	\N	\N
1342	23001063	HARSHAD	VIJAY	SELOKAR	5	A	3	2023	1357	5	\N	\N
1350	23001080	GUNJAN	VILAS	KADU	5	A	3	2023	1365	5	\N	\N
1352	23001082	RITIK	MUNESHKUMAR	PANDEY	5	A	3	2023	1367	22	\N	\N
1325	23001022	TANU	RAKESH	SINHA	5	A	3	2023	1340	12	\N	\N
1345	23001073	ANIKET	KAILAS	SINGANJUDE	5	A	3	2023	1360	24	\N	\N
1335	23001044	PRASHANSA	PRABHUDAS	WANKHEDE	5	A	3	2023	1350	20	\N	\N
1330	23001034	MELRICK	REGIE	PAUL	5	A	3	2023	1345	3	\N	\N
1351	23001081	MAYANK	PRASHANT	BALPANDE	5	A	3	2023	1366	20	\N	\N
1332	23001038	JOEL	JACOB	VARGHESE	5	A	3	2023	1347	7	\N	\N
1366	23001108	PREYASH	PREMRAJ	CHANDURKAR	5	A	3	2023	1381	21	\N	\N
1336	23001050	ROMA	AMOL	DIVE	5	A	3	2023	1351	17	\N	\N
1346	23001075	SUMEDH	SHAMRAO	MESHRAM	5	A	3	2023	1361	16	\N	\N
1374	23001123	ANANYA	NIRAJ	RAJURKAR	5	A	3	2023	1389	8	\N	\N
1344	23001072	PRACHI	SANAT	MISHRA	5	A	3	2023	1359	14	\N	\N
1322	23001016	JUELI	PRAKASH	CHINTAWAR	5	A	3	2023	1337	11	\N	\N
1371	23001117	MANNA	SARA	BILU	5	A	3	2023	1386	9	\N	\N
1353	23001083	PRATIK	SANJAY	BHOYAR	5	A	3	2023	1368	20	\N	\N
1360	23001093	KETKI	NARENDRA	THAKRE	5	A	3	2023	1375	15	\N	\N
1381	24103003	PRIYA	VINOD	PACHGADE	5	A	3	2024	1396	20	\N	\N
1382	24103004	SHRIDDHI	UMESH	BHONGADE	5	A	3	2024	1397	7	\N	\N
1376	23001129	JACOB	P	MATHEW	5	A	3	2023	1391	17	\N	\N
1358	23001091	SAHIL	SAJID	SHEIKH	5	A	3	2023	1373	24	\N	\N
1357	23001087	VANSH	KAMALSHEEL	BANSOD	5	A	3	2023	1372	6	\N	\N
1362	23001099	ADITYA	RAJESH	ZADE	5	A	3	2023	1377	24	\N	\N
1370	23001116	GURADESH	\N	DHILLON	5	A	3	2023	1385	3	\N	\N
1356	23001086	AKSHIT	PRASHANT	KAMBLE	5	A	3	2023	1371	22	\N	\N
1320	23001009	BHUMI	KISHOR	MAKDE	5	A	3	2023	1335	23	\N	\N
1354	23001084	KALYANI	PRAVIN	JIOTODE	5	A	3	2023	1369	16	\N	\N
1373	23001122	SHARWARI	SUDHIR	WADALKAR	5	A	3	2023	1388	11	\N	\N
1337	23001052	UTKARSH	MAHESH	KUCHANKAR	5	A	3	2023	1352	12	\N	\N
1347	23001076	TANISHA	RAMESH	SHINGNE	5	A	3	2023	1362	19	\N	\N
1368	23001114	VISHWESH	SUHAS	PATIL	5	A	3	2023	1383	13	\N	\N
1361	23001094	ABHYUDAYA	HEMANT	AWARE	5	A	3	2023	1376	14	\N	\N
1369	23001115	ADITYA	KIRAN	YELNE	5	A	3	2023	1384	14	\N	\N
1367	23001111	BISMEET	KAUR	KUKREJA	5	A	3	2023	1382	18	\N	\N
1380	24103002	SHREYA	SACHIN	DOYE	5	A	3	2024	1395	18	\N	\N
1375	23001128	SRUJAN	BHUSHAN	ZANJAL	5	A	3	2023	1390	6	\N	\N
1341	23001060	RADHA	ASHISH	TADAS	5	A	3	2023	1356	23	\N	\N
1377	23001133	TANMAY	NARENDRA	MESHRAM	5	A	3	2023	1392	6	\N	\N
1583	23001124	ARYAN RAJENDRA KALE			5	B	3	2023	1616	12	\N	\N
1363	23001100	UTKARSH	DHARMENDRA	RAUT	5	A	3	2023	1378	23	\N	\N
1541	22001068	Isha	\N	Barapatre	7	A	4	2022	1558	\N	\N	\N
1542	22001069	Prathmesh	Vishnu	Nishane	7	A	4	2022	1559	\N	\N	\N
1543	22001071	Aastha	Vednath	Choudhari	7	A	4	2022	1560	\N	\N	\N
1544	22001074	Pranjal	Sanjay	Kothekar	7	A	4	2022	1561	\N	\N	\N
1545	22001076	Shreya	Ravindra	Borde	7	A	4	2022	1562	\N	\N	\N
1546	22001078	Sumit	Ramashankar	Prasad	7	A	4	2022	1563	\N	\N	\N
1547	22001079	Samiksha	\N	Dhawas	7	A	4	2022	1564	\N	\N	\N
1548	22001082	Uday	Suraj	Bhoyar	7	A	4	2022	1565	\N	\N	\N
1549	22001084	Aditya	Vilas	Ganvir	7	A	4	2022	1566	\N	\N	\N
1551	22001086	Sujal	Anant	Dange	7	A	4	2022	1568	\N	\N	\N
1552	22001087	Aayush	Nitin	Jibhkate	7	A	4	2022	1569	\N	\N	\N
1553	22001090	Vaishali	harishankar	magarde	7	A	4	2022	1570	\N	\N	\N
1554	22001096	Mrudul	\N	Dehankar	7	A	4	2022	1571	\N	\N	\N
1556	22001103	Roshan	Dinesh	Tigga	7	A	4	2022	1573	\N	\N	\N
1557	22001104	Alvis	Joseph	Varghese	7	A	4	2022	1574	\N	\N	\N
1558	22001105	Alwyn	\N	Paul	7	A	4	2022	1575	\N	\N	\N
1559	22001106	Edwin	T	Joseph	7	A	4	2022	1576	\N	\N	\N
1562	22001115	Meet	\N	shivhare	7	A	4	2022	1579	\N	\N	\N
1564	22001121	Ishika	\N	Bhalla	7	A	4	2022	1581	\N	\N	\N
1565	22001122	Rajas	\N	Tarapure	7	A	4	2022	1582	\N	\N	\N
1566	22001123	Soham	\N	Rothe	7	A	4	2022	1583	\N	\N	\N
1569	22001129	Tanvi	kishor	Junghare	7	A	4	2022	1586	\N	\N	\N
1570	22001132	Shubham	Mohan	Dhabu	7	A	4	2022	1587	\N	\N	\N
1571	22001137	Jatin	\N	Meenia	7	A	4	2022	1588	\N	\N	\N
1572	22017013	Sharwari	\N	Raut	7	A	4	2022	1589	\N	\N	\N
1575	23101005	Nishant	\N	Wankhede	7	A	4	2023	1592	\N	\N	\N
1576	23101007	Chinmayee	\N	Chandurwar	7	A	4	2023	1593	\N	\N	\N
1577	23101009	Piyush	\N	Khati	7	A	4	2023	1594	\N	\N	\N
1578	22101005	MAITREY.	S.	DALAL	7	A	4	2022	1595	\N	\N	\N
1581	21001042	SAIDEN	\N	SEQUEIRA	7	A	4	2021	1598	\N	\N	\N
1582	21001117	ARYAN	\N	HUMNE	7	A	4	2021	1599	\N	\N	\N
1438	22001136	Sahil	\N	kumar	7	B	4	2022	1454	\N	\N	\N
1520	22001014	Piyush	Shridhar	Butle	7	A	4	2022	1537	\N	\N	\N
1574	23101003	Vaibhav	Balkrushna	Vaidya	7	A	4	2023	1591	\N	\N	\N
1537	22001061	Darshan	Shankar	Jadhav	7	A	4	2022	1554	\N	\N	\N
1555	22001099	Mersa	\N	joy	7	A	4	2022	1572	\N	\N	\N
1539	22001065	Laksh	vinay	ikhar	7	A	4	2022	1556	\N	\N	\N
1379	24103001	TANUSHREE	RAJU	WANJARI	5	A	3	2024	1394	21	\N	\N
1514	21001116	Arya	Uttam	Wankhede	7	A	4	2021	1531	\N	\N	\N
1536	22001059	Gaurav	\N	Ingle	7	A	4	2022	1553	\N	\N	\N
1579	21001126	SAHIL.	M.	BANTE	7	A	4	2021	1596	\N	\N	\N
1560	22001110	Aayushi	Jayant	Asole	7	A	4	2022	1577	\N	\N	\N
1524	22001027	Vaibhavi	\N	Balbudhe	7	A	4	2022	1541	\N	\N	\N
1527	22001036	Amiya	P	Bovas	7	A	4	2022	1544	\N	\N	\N
1518	22001008	Megha	Harichandra	shahare	7	A	4	2022	1535	\N	\N	\N
1532	22001047	Vaibhav	\N	Thakare	7	A	4	2022	1549	\N	\N	\N
1568	22001125	Sanika	\N	Patil	7	A	4	2022	1585	\N	\N	\N
1561	22001113	Tejasi	\N	Rinait	7	A	4	2022	1578	\N	\N	\N
1521	22001017	Vedanti	Dipak	Wandhare	7	A	4	2022	1538	\N	\N	\N
1567	22001124	Sarthak	Govind	Thote	7	A	4	2022	1584	\N	\N	\N
1550	22001085	Sima	Pandurang	Bhongade	7	A	4	2022	1567	\N	\N	\N
1517	22001007	Dishant	Damodhar	Kewat	7	A	4	2022	1534	\N	\N	\N
1531	22001043	Saurabh	\N	wankhede	7	A	4	2022	1548	\N	\N	\N
1580	21001023	SALONI	\N	SABLE	7	A	4	2021	1597	\N	\N	\N
1519	22001011	Prince	Kumar	Singh	7	A	4	2022	1536	\N	\N	\N
1529	22001041	Himanshu	\N	Shahare	7	A	4	2022	1546	\N	\N	\N
1573	23101002	Uttara	Nitin	Balpande	7	A	4	2023	1590	\N	\N	\N
1584	22001072	Anuja Bele			7	B	4	2022	1622	\N	\N	\N
1563	22001119	Nikhitha	Catharin	Santo	7	A	4	2022	1580	\N	\N	\N
1417	22001080	Chaitanya	Vijay	Kolate	7	B	4	2022	1433	\N	\N	\N
1419	22001089	Latik	\N	Mohariya	7	B	4	2022	1435	\N	\N	\N
1420	22001092	Sanket	\N	Thakre	7	B	4	2022	1436	\N	\N	\N
1421	22001093	Nevin	Sunil	Oommen	7	B	4	2022	1437	\N	\N	\N
1424	22001102	Rudraksha	\N	Asati	7	B	4	2022	1440	\N	\N	\N
1425	22001108	Ankita	\N	Aitwar	7	B	4	2022	1441	\N	\N	\N
1426	22001109	Ayushi	\N	Hatwar	7	B	4	2022	1442	\N	\N	\N
1428	22001112	Yash	\N	Siddhabhatti	7	B	4	2022	1444	\N	\N	\N
1429	22001116	Sanvee	Sachin	Karandikar	7	B	4	2022	1445	\N	\N	\N
1430	22001117	Fahad	Ahmad	Khan	7	B	4	2022	1446	\N	\N	\N
1432	22001120	Gouri	\N	Biswas	7	B	4	2022	1448	\N	\N	\N
1433	22001128	Vivek	\N	Kumar	7	B	4	2022	1449	\N	\N	\N
1436	22001133	Atharvi	\N	Babhare	7	B	4	2022	1452	\N	\N	\N
1437	22001135	VILLAYAT	\N	ALI	7	B	4	2022	1453	\N	\N	\N
1439	22015035	Kasturi	\N	Chavan	7	B	4	2022	1455	\N	\N	\N
1440	22017002	Pariniti	\N	Agarkar	7	B	4	2022	1456	\N	\N	\N
1441	23101004	Rohan	Kailas	Ingle	7	B	4	2023	1457	\N	\N	\N
1442	23101006	Akshay	Pramod	Badalwar	7	B	4	2023	1458	\N	\N	\N
1405	22001053	Anush	Shankar	Dighore	7	B	4	2022	1421	\N	\N	\N
1422	22001094	Arya	Manish	Ingole	7	B	4	2022	1438	\N	\N	\N
1435	22001131	Sajal	Alok	Srivastava	7	B	4	2022	1451	\N	\N	\N
1443	23101008	Roshan	Sudhir	Bhuskute	7	B	4	2023	1459	\N	\N	\N
1434	22001130	Radhika	\N	Salodkar	7	B	4	2022	1450	\N	\N	\N
1407	22001056	Madhura	Gajanan	Shende	7	B	4	2022	1423	\N	\N	\N
1414	22001073	RUTUJA	NILESH	TAMBOLI	7	B	4	2022	1430	\N	\N	\N
1411	22001064	Khushi	Shedanand	Choudhari	7	B	4	2022	1427	\N	\N	\N
1423	22001100	Darshan	\N	Butle	7	B	4	2022	1439	\N	\N	\N
1406	22001054	Sarang	Vilas	Dandekar	7	B	4	2022	1422	\N	\N	\N
1408	22001057	Paritosh	Mahesh	Magare	7	B	4	2022	1424	\N	\N	\N
1333	23001039	TERENCE	JAMES	JOSEPH	5	A	3	2023	1348	11	\N	\N
1431	22001118	Gargi	\N	Gundawar	7	B	4	2022	1447	\N	\N	\N
1404	22001050	Kashish	Naresh	Kanojiya	7	B	4	2022	1420	\N	\N	\N
1415	22001075	Nakul	Bharat	Armarkar	7	B	4	2022	1431	\N	\N	\N
1427	22001111	Kaiwalya	Swanand	Pund	7	B	4	2022	1443	\N	\N	\N
1392	22001018	Shashwat	\N	Lautawar	7	B	4	2022	1408	\N	\N	\N
1393	22001021	Bhumika	Dinesh	Patrikar	7	B	4	2022	1409	\N	\N	\N
1394	22001022	Rishab	Suresh	Chawhan	7	B	4	2022	1410	\N	\N	\N
1395	22001023	Mansi	Murlidhar	Thakre	7	B	4	2022	1411	\N	\N	\N
1396	22001028	Parth	\N	Upadhye	7	B	4	2022	1412	\N	\N	\N
1397	22001031	Robi	Suresh	Manukonda	7	B	4	2022	1413	\N	\N	\N
1398	22001034	Neeraj	Randhir	Ruda	7	B	4	2022	1414	\N	\N	\N
1399	22001035	Ryan	Fabian	Lawrence	7	B	4	2022	1415	\N	\N	\N
1401	22001039	Justin	Joseph	Augustine	7	B	4	2022	1417	\N	\N	\N
1402	22001045	Elasha	\N	Deoghare	7	B	4	2022	1418	\N	\N	\N
1403	22001048	SANIKA	\N	UMREDKAR	7	B	4	2022	1419	\N	\N	\N
1400	22001038	Shalinya	Amit	Manwatkar	7	B	4	2022	1416	\N	\N	\N
1390	22001015	Kunal	Ashok	Wandhare	7	B	4	2022	1406	\N	\N	\N
1388	22001009	Mayur	\N	Aglawe	7	B	4	2022	1404	\N	\N	\N
1685	23011111	test user			5	A	\N	2023	1909	\N	\N	\N
342	24003065	Yash	Arun	Lute	5	A	2	2024	345	12	\N	\N
\.


--
-- Data for Name: student_personal_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student_personal_info (id, student_id, mobile_no, personal_email, college_email, linked_in_id, permanent_address, dob, gender, father_name, father_mobile_no, father_email, father_occupation, mother_name, mother_mobile_no, mother_email, mother_occupation, emergency_contact_name, emergency_contact_number, photo_url, photo_public_id, blood_group, category, aadhar_number, mis_uid, github_id, present_address, guardian_name, guardian_mobile, guardian_email) FROM stdin;
1	409	7021971018	siddhantlohakar12@gmail.com	siddhantlohakar.23@stvincentngp.edu.in	N/A	20, Sharda Nagar Pardi Nagpur	2003-12-10	Male	Tulshidas Lohakar	7498932853	N/A	Teacher	Jyoti Lohakar	7720063019	N/A	Housewife	Tulshidas Lohakar	7498932853	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2	414	8766619386	kaushikshahu156@gmail.com	kaushikshahu.23@stvincentngp.edu.in	N/A	41, Durgashree, Ganesh Nagar, Nagpur -440009	2005-06-01	Male	Chandrashekhar Shahu	9762156001	kaushman118@gmail.com	Business	Bhavana Shahu	9834207282	bhavanashahu01@gmail.com	Homemaker	Sunil Shahu	9373113012	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
5	659	7089339266	amitanshpardhi94@gmail.com	amitanshpardhi.24@stvincentngp.edu.in	https://www.linkedin.com/in/amitansh-pardhi-517b5a329?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	02,Samrat Nagar Waraseoni, Balaghat Madhya Pradesh	2006-08-30	Male	Arvind Pardhi	9669449266	arvindpardhi634@gmail.com	Teacher	Amita Pardhi	8989669036	amitapardhi235@gmail.com	Principal	8989669036	8989669036	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
6	366	8871334457	mayank.saha2006@gmail.com	mayanksaha.24@stvincentngp.edu.in	https://www.linkedin.com/in/mayank-saha-777aa833b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	a 203 sai parisar vypar vihar shrikant verma marg	2006-08-23	Male	Sanjay Saha	7771011656	N/A	Business	Nidhi Saha	6261088853	N/A	Job	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
7	688	9529682217	kalskaryugal@gmail.com	yugalkalaskar.24@stvincentngp.edu.in	https://www.linkedin.com/in/yugal-kalskar-a21261351?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Pandhurna BK, Tq. Ghatanji, Dist. Yavatmal	2007-04-08	Male	Ravindra Kalaskar	9373278148	ravindrakalaskar18776@gmail.com	Farmer	Kiran	8766882239	yugalkalaskar6@gmail.com	House Wife	Yugal	8010799924	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
8	704	7020547381	smitpatil2019@gmail.com	smitpatil.24@stvincentngp.edu.in	https://www.linkedin.com/in/smit-patil-82174a32a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	A1/2 1-C ,Building no. 10 ,Nirmal Nagari ,Umred Road, Nagpur, Maharashtra,440024	2006-01-02	Male	Aniruddha Patil	9373270629	N/A	Medical Practitioner	Sonali Patil	9209908478	N/A	Homemaker	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
9	660	8767296530	gunwantgbawankar@gmail.com	gunwantbawankar.24@stvincentngp.edu.in	https://www.linkedin.com/in/gunwant-bawankar-838590367?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	EWS-28, Adarsh mhada colony, Khadgaon road, Nagpur 440023	2006-01-03	Male	Gopal Bawankar	7709207469	maniramji66@gmail.com	Government job	Rajni Bawankar	9067283822	gunwantb99@gmail.com	House wife	Kaushik	8766741971	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
10	647	8177996198	itankarmayuresh09@gmail.com	mayureshitankar.24@stvincentngp.edu.in	https://www.linkedin.com/in/mayuresh-itankar-52b5b5328/	Plot no 34 FCI Colony Narendra Nagar Extension Nagpur - 440015	2006-07-09	Male	Mangesh Itankar	9619864080	N/A	Regional Manager in pharmacutical company	Monali Itankar	8087103983	N/A	House wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
11	364	9529340105	Himanshukedar9767@gmail.com	Himanshukedar.24@stvincentngp.edu.in	https://www.linkedin.com/in/himanshu-kedar-929b1133a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	224 vaishnav mata nagar pipla road nagpur	2006-06-26	Male	Kamlakar kedar	9767674872	kamlakarkedar786@gmail.com	Private	Premlata kedar	9767674872	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
12	667	9511236503	rahatedevendra631@gmail.com	devendrarahate.24@stvincentngp.edu.in	https://www.linkedin.com/in/devendra-rahate-9a5922280?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Plot 88, Avdhut nagar 2, Manewda, Nagpur -440034	2006-01-06	Male	Pancham Rahate	9371603965	N/A	Business (seat cover repairing)	Durga Rahate	7709849051	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
13	343	8007865008	neelaml2036@gmail.com	Neelamlashkare.24@stvincentngp.edu.in	N/A	6'1 Mersh Apartment Madhav nagar, Nagpur	2006-03-20	Female	Praveen Sudhakar Lashkare	8275285008	praveenlashkare149@gmail.com	Bank Manager	Deepti Praveen Lashkare	9284875914	deeptilashkare2711@gmail.com	Housewife	8275285008	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
14	311	8076302677	martinaman73@gmail.com	amanmartin.24@stvincentngp.edu.in	N/A	TNPS Boys Hostel, St Vincent Pallotti College of Engineering & Technology, Wardha Road, Gavsi Manapur, Nagpur, Maharashtra 441108	2005-11-14	Male	Martin Joseph	8368889406	N/A	Auto Electrician	Julie Mathew	8368889406	N/A	Nurse	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
15	653	9354004267	saviosanthosh111@gmail.com	saviomathew.24@stvincentngp.edu.in	N/A	Ayur Vigyan Nagar, New Delhi - 110049	2006-07-20	Male	Santhosh Mathew	9818229357	N/A	Private Job	Mini Santhosh	9999853438	N/A	Nurse	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
16	350	7249864706	pranavkhawshi534@gmail.com	pranavkhawashi.24@stvincentngp.edu.in	N/A	386 Ajani Chunabhatti Beside Shiv Mandir 440015 Nagpur	2006-07-04	Male	Subhash	7066119939	N/A	Farmer	Vaishali	8698792445	N/A	teacher	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
17	361	8766091703	shrushtivaidya810@gmail.com	shrushtivaidya.24@stvincentngp.edu.in	N/A	At.chicholi, post.dhanla , Dist.Nagpur \n441104	2005-10-25	Female	Raghuvir Vaidya	9765009130	N/A	Farmer	Keshlata Vaidya	9765009130	N/A	Housewife	Shivdas chopkar	79722 12763	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
18	327	7558517946	guptaharsh1969@gmail.com	harshgupta.24@stvincentngp.edu.in	https://www.linkedin.com/in/harsh-gupta-9a9869329?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Chuna Oli , Maskasath , Itwari , Nagpur	2006-04-27	Male	Sanjeev Gupta	7875869770	N/A	Business	Manisha Gupta	8999983208	manishasanjiv2@gmail.com	Housewife	7558517946	8999983208	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
19	347	9226581437	joshiatharva063@gmail.com	atharvajoshi.24@stvincentngp.edu.in	https://www.linkedin.com/in/atharva-joshi-b982b0310?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	21,Sai Appartment ,Dhangawli nagar,Hudkeshwar Road ,Nagpur (440034)	2006-03-18	Male	Gajanan Joshi	8329196630	gajananjoshi1977@gmail.com	Private	Aparna Joshi	7517073526	gajananjoshi1977@gmail.com	Housewife	9226581437	9226581437	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
20	334	9226591078	drishtibawankar@gmail.com	drishtibawankar.24@stvincentngp.edu.in	https://www.linkedin.com/in/drishti-bawankar-0804aa341?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app	104, Ganesh Nagar , sharda chowk near azad park, nandanwan , Nagpur (440024).	2006-06-19	Female	Hemant Bawankar	8830981826	hemant.yh@gmail.com	private	Rupali Bawankar	8668736935	rupalibawankar16@gmail.com	housewife	Hemant Bawankar	9975035186	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
25	338	8087490119	gaurigotmare08@gmail.com	gaurigotmare.24@stvincentngp.edu.in	https://www.linkedin.com/in/gauri-gotmare-00b423338?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Qt no. 221 Nandanvan Colony, Nagpur	2006-08-27	Female	Surendra Gotmare	9822526597	surendragotmare@gmail.com	Buisness	Sushma Gotmare	9623677053	sushmagotmare@gmail.com	House wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
21	358	9325759352	patankarkhushi@gmail.com	khushipatankar.24@stvincentngp.edu.in	https://www.linkedin.com/in/khushi-patankar-98507033b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Mayureshwar Apartment in front of maliwal gas godown jyoti nagar Jatherpeth, Akola 444005	2006-01-30	Female	Prakash Vishnu Patankar	8698397562	pvpatankar12@gmail.com	Assistant Teacher	Bharti Prakash Patankar	9763833750	patankarbharti429@gmail.com	Housewife	9325759352	8698397562	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
281	312	7588730625	mayureshmangrulkar1650@gmail.com	mayureshmangrulkar.24@stvincentngp.edu.in	N/A	C/O Pahantate Guruji House Kisan Wasahat Pathanpura Ward Chandrapur	2006-05-25	Male	Niranjan Mangrulkar	9822279483	N/A	Service	Girija Mangrulkar	8766587440	N/A	Housemaker	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
619	1579	9145253363	sbante009@gmail.com	sahilbante.21@stvincentngp.edu.in	N/A	ayurvedic layout plot no .42	2003-05-23	Male	markand bante	9527444337	N/A	retired	manisha bante	9657750721	N/A	housewife	9145253363	9657750721	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
303	1357	8208287106	vanshbansod72@gmail.com	vanshbansod.23@stvincentngp.edu.in	https://www.linkedin.com/in/vansh-bansod-646376350?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Nara, om nagar, Mankapur, Nagpur	2005-03-16	Male	Kamalsheel Suresh Bansod	7875735567	kamalsheelbansod1979@gmail.com	Farmer	Varsha Kamalsheel Bansod	9158232638	varsha@gmail.com	House maker	Mrunal	8261900186	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
165	1354	9322574044	kalyanijiotode3@gmail.com	kalyanijiotode.23@stvincentngp.edu.in	N/A	Girivihar layout behind shalimar traders warora	2005-10-22	Female	Pravin jiotode	7666682081	pkjiotode@gmail.com	Operator	Maya	7499130348	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
168	1321	9356989013	sharvarighotekar@gmail.com	sharvarighotekar.23@stvincentngp.edu.in	https://www.linkedin.com/in/sharvari-ghotekar-21517831b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	At. Mangrul ,Ta. Maregaon (445303), Dist. Yavatmal	2005-04-21	Female	Shyam Ghotekar	9822725423	N/A	Framing	Shubhangi Ghotekar	8554834028	N/A	House-wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
176	1332	9673102093	joeljacobvarghese390@gmail.com	JOELVARGHESE.23@stvincentngp.edu.in	https://www.linkedin.com/in/joel-varghese-a854b0321?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Ebenezer villa plot no 1/2 om nagar Mankapur	2005-03-10	Male	Varghese Jacob	7887996216	joeljacobvarghese390@gmail.com	Operation manager	Bency Varghese	8180939392	bencyvarghese763@gmail.com	House wife	Himanshu	9604686258	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
67	319	8788965280	bhenderoshan199@gmail.com	roshanbhende.24@stvincentngp.edu.in	https://www.linkedin.com/in/roshan-bhende-407457373?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	At Post Chandur	2004-08-08	Male	Narayan Purushottam Bhende	9673219488	N/A	Labour	Ujwala Narayan Bhende	7448147944	N/A	Housewife	7448147944	9673219488	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
70	386	7770088032	bhairavisawale@gmail.com	bhairavisawale.23@stvincentngp.edu.in	https://www.linkedin.com/in/bhairavi-sawale-771315326	At . Post Dongar khandala, Buldhana	2004-07-16	Female	Ramkrushna Sawale	9421494011	N/A	Farmer	Lata Sawale	92267 53076	N/A	Housewife	9421494011	7770088040	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
71	669	9146331612	resabenjamin2005@gmail.com	resabenjamin.24@stvincentngp.edu.in	N/A	DRM 189, WCL Colony, Durgapur, Chandrapur, Maharashtra	2005-03-20	Female	Isanur Benjamin	9096540190	N/A	WCL Worker	Varsha Benjamin	9860013194	N/A	Teacher	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
78	672	9209219543	kindoanish436@gmail.com	anishkindo.24@stvincentngp.edu.in	https://www.linkedin.com/in/anish-kindo-9a200431a	Plot No. 390, Chandan Nagar, Nagpur-440024	2007-04-17	Male	Barnabas Kindo	8007478996	N/A	Worker	Celestina Kindo	8007478996	N/A	House wife	Anish Kindo	9209219543	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
311	652	7524931862	shandilyasahastranshuoffc2@gmail.com	shandilyasahastranshu.24@stvincentngp.edu.in	https://www.linkedin.com/in/sahastranshu-shandilya-197404365?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	West of Jagjivan College, Near Gayatri Temple, Dehri, 821307	2007-03-14	Male	Rajesh Kumar Pandey	8409943000	rkpandey2101976@gmail.com	Government Employee	Manisha Kumari Dubey	9113770366	manishadubey1712@gmail.com	Advocate	8409943000	9113770366	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
187	378	9970525681	shreeshpawar9@gmail.com	shreeshpawar.23@stvincentngp.edu.in	www.linkedin.com/in/shreesh-pawar-010a85372	A-403 Rachana Sayantara Phase-1 Hazaripahad Nagpur	2005-05-09	Male	Santosh Pawar	9764446410	N/A	Service	Suvarna Pawar	9168284166	N/A	House Wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
194	405	9098900607	anchalgupta0725@gmail.com	anchalgupta.23@stvincentngp.edu.in	https://www.linkedin.com/in/anchal-gupta-3a507329a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	House no. 822 dadra pul road near nakloba temple Timki	2005-07-25	Female	Shailesh Gupta	9503824345	N/A	Business	Bhuvneshwari Gupta	9552174557	N/A	Homemaker	Sahil gupta	9146096566	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
213	368	7822851682	revantbajpai5207@gmail.com	revantbajpai.24@stvincentngp.edu.in	https://www.linkedin.com/in/revant-bajpai/	Room no. 240 phase 2 veer sawarkar Nagar , Butibori Nagpur pin - 441122	2007-02-05	Male	Santosh Bajpai	8446231589	santoshbajpai9877@gmail.com	Service	Swati Bajpai	7038502761	swati.shukla1981@gmail.com	Teacher	Santosh Bajpai	8446231589	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
214	365	9370850976	rachanarewatkar65@gmail.com	rachanarewatkar.24@stvincentngp.edu.in	N/A	At post Allipur \nTah-Hinganghat\nDist-Wardha	2006-09-03	Female	Harish	9923216551	harishrewatkar47@gmail.com	Farmer	Laxmi	8010376947	rachanarewatkar110@gmail.com	Housewife	9370850976	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
217	651	7085792626	hiyailenoinam@gmail.com	OINAMKHUMAN.24@stvincentngp.edu.in	N/A	Naranseina\nManing Leikai, Bishnupur	2007-02-21	Male	OINAMCHA DINAMANI KHUMAN	8798541432	N/A	Employee	OINAM BIJAYA LEIMA	6909 381 029	N/A	Weaver	OINAM SONAMANI KHUMAN	8888862667	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
220	346	7057422325	vedantghatole80@gmail.com	vedantghatole.24@stvincentngp.edu.in	https://www.linkedin.com/in/vedant-ghatole-26222532a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Balajipuram, Kuhi road, Umred	2005-04-13	Male	Ramu Ghatole	97648 29059	ramughatole9@gmail.com	Teacher	Manisha Ghatole	8007463665	manishaghatole22089@gmail.com	Housewife	Manisha Ghatole	8007463665	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
444	1442	7499988548	akshaybadalwar507@gmail.com	akshayreddy.23d@stvincentngp.edu.in	https://www.linkedin.com/in/akshay-badalwar-990b31347	At.Surdapur Post.Patan Tq.Zari Jamni Dist.yavatmal 445305	2005-02-02	Male	Pramod	8263980426	reddyakshayb493493@gmail.com	Farmer	Ravita	7517246236	reddyakshayb493493@gmail.com	Housewife	Sweety	7517246236	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
447	1443	9665234669	roshanbhuskute25@gmail.com	roshanbhuskute.23d@stvincentngp.edu.in	https://www.linkedin.com/in/roshan-bhuskute-253308205/	Near ZP school, pola chowk, Wadegaon , Tq. Balapur Dis. Akola	2003-01-25	Male	Sudhir Bhuskute	9921020144	N/A	Farmer	Durga Bhuskute	9921020144	N/A	House wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
23	330	9834576757	vedantigosai0706@gmail.com	vedantigosai.24@stvincentngp.edu.in	N/A	Plot No. 40, Ambika Nagar, Nagpur, 440024	2006-11-07	Female	Jitendrapuri Gosai	9665175942	jitupurigosai4464@gmail.com	Clerk	Priya Gosai	9284342914	gosaipriya685@gmail.com	House Wife	9284342914	7498526494	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
31	352	8799885749	trishajunghare.04@gmail.com	trishajunghare.24@stvincentngp.edu.in	https://www.linkedin.com/in/trisha-junghare-907a02346?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Ward No. 2, Panubali, Tah. Kalmeshwar, Dist. Nagpur-441502	2005-08-04	Female	Raju Junghare	9146422043	N/A	Farming	Vanita Junghare	8459852123	N/A	Farming	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
33	315	9359018205	rodeesha50@gmail.com	esharode.24@stvincentngp.edu.in	https://www.linkedin.com/in/esha-rode-b006a7351?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app	Gandhi chowk shaid ward chota bazar Bhandara	2006-04-02	Female	Bhalchandra Rode	7972379145	N/A	…	Sangita Rode	7972379145	N/A	Job	Sangita Rode	7972379145	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
36	318	8237398092	kadambariukinkarce@gmail.com	kadambariukinkar.24@stvincentngp.edu.in	https://www.linkedin.com/in/kadambari-ukinkar-42973b354?utm source=share&utm campaign=share_via&utm_content=profile&utm_medium=android_app	near shivaji park mahajanwadi wanadongri hingna road nagpur	2005-11-20	Female	Manish Ukinkar	8855937064	mahendraukinkar@gamil.com	private job	Aparna Ukinkar	8623009083	aparnaukinkar21@gmail.com	housewife	sanskruti Ukinkar	9511796022	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
282	1365	7389261796	krishnatelang22@gmail.com	Mohittelang.23@stvincentngp.edu.in	https://www.linkedin.com/in/mohit-telang-29078528a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Chattrapati shivaji nagar, Kareli, 487221	2004-11-06	Male	Mukesh telang	9407031796	mukeshtelang@gmail.com	Farmer	Manjusha telang	9644479852	manjutelang21@gmail.com	Teacher	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
293	433	9796554963	bjbhat4890@gmail.com	junaidhameed.23@stvincentngp.edu.in	N/A	Jammu and Kashmir	2004-09-30	Female	Ab hameed	8899803162	xyz@gmail.com	Xyz	Khazri Begum	8899803162	xyx@gmail.com	Abc	8899803162	8899803162	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
50	326	8624943866	piyushdeshmukh520@gmail.com	piyushdeshmukh.24@stvincentngp.edu.in	https://www.linkedin.com/in/piyush-deshmukh-6b658a300?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	25,shesh nagar kharbi road near papadkar kirana store,nagpur	2006-03-15	Male	sunil deshmukh	8624892700	N/A	private services	nirmala deshmukh	8624943866	N/A	housewife	8329841409	9209911418	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
54	353	8806102290	joshuaabraham19206@gmail.com	joshuaabraham.24@stvincentngp.edu.in	N/A	Flat no. 104,Atharva Enclave, behind Ganeshdham, Piplaphata, Nagpur	2006-02-19	Male	Binoj Abraham	9665477750	N/A	Share market investor	Sheena Jacob	9744895908	N/A	Teacher	K. M. Abraham	9809252680	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
173	370	7887387652	abhinavsingh912007@gmail.com	abhinavsingh.24@stvincentngp.edu.in	https://www.linkedin.com/in/abhinav-singh-3081b5334	F-14, shivdham colony, bhilgoan, Nagpur	2007-01-09	Male	Vinay kumar Singh	9730078360	N/A	Senior Section Engineer	Sarita Singh	9096857936	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
66	401	9284973502	mansirahangdale25@gmail.com	mansirahangdale.23@stvincentngp.edu.in	https://www.linkedin.com/in/mansi-rahangdale-01b605303?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B6LS9sBwFQEGhV6tZdkGBpA%3D%3D	At/post-Bamhni , Tal- Goregaon , Dist - Gondia , Maharashtra	2005-09-20	Female	BHALCHANDRA RAHANGDALE	9420866263	N/A	Farming	Bhumeshwari Rahangdale	+8329628153	N/A	House wife	9021431091	9021431091	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
625	1563	8075919009	nikhithacatharin@gmail.com	nikhithasanto.22@stvincentngp.edu.in	www.linkedin.com/in/nikhitha-catharin-santo	Erattamundackal (house) , Nadavayal p.o., Wayanad, Kerala, 670721	2003-01-24	Female	Santof E George	9447080968	santonadavayal@gmail.com	Farmer	Glicy George	6282774897	glicysanto81@gmail.com	House Wife	9447080968	6282774897	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
185	422	8767249356	siddhantshindey47@gmail.com	siddhantshindey.23@stvincentngp.edu.in	N/A	Plot no.18 SE RLY Colony Pratap Nagar Nagpur	2005-07-04	Male	Shrikant Shindey	9326728390	N/A	Business	Preeti Shindey	9665943336	preetishindey111@gmail.com	Housewife	9665943336	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
453	430	8624926490	saveridongre07@gmail.com	saveridongre.23@stvincentngp.edu.in	https://www.linkedin.com/in/saveri-dongre-796434359	Sujata Nagar, Binaki layout, Nagpur	2004-09-06	Female	Gautam Dongre	8888823390	N/A	Government Employee	Rajni Dongre	9657229540	N/A	Government Employee	8855089869	8624926490	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
373	1355	9309382023	vanshbarde805@gmail.com	vanshbarde.23@stvincentngp.edu.in	www.linkedin.com/in/vansh-barde-a2489331b	yerangoa , post goji, tahshil wardha	2005-11-08	Male	Ganesh Tatobaji Barde	9623780696	N/A	Farmer	Pratibha Ganesh Barde	9309382023	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
454	394	8010369854	deveshbanote2005@gmail.com	deveshbanote.23@stvincentngp.edu.in	N/A	Ward No.2 Fulchur Ambatoli Gondia Maharashtra	2005-05-06	Male	lekhram	9511718778	pujabanote7@gmail.com	chef	MAMTA	9511718778	pujabanote7@gmail.com	office	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
455	390	7499788805	roshanikhedkar55@gmail.com	roshnikhedkar.23@stvincentngp.edu.in	N/A	Plot no.19 Bidgaon road Near Barde kirana stores Aradhana Nagar Bidgaon Nagpur.\nBidgaon. Kapsi Bk Kamptee Nagpur Maharashtra 440035	2005-04-16	Female	Bhimrao Khedkar	8805388244	khedkarbhimrao88@gmail.com	Building construction	Sarita Khedkar	8329194973	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
243	1383	9373687761	waghmarearya02@gmail.com	aryawaghmare.24d@stvincentngp.edu.in	aryawaghmare27	Pragati colony, bhandara	2005-10-27	Female	Shrikrishna Waghmare	7978959143	N/A	.	Sushma Waghmare	7978959143	N/A	.	7978959143	9307338985	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
247	1417	9309363633	chaitanyakolate20@gmail.com	chaitanyakolate.22@stvincentngp.edu.in	linkedin.com/in/chaitanya-kolate-3a0959290	Vinchurkar Layout Saoner, Dist-Nagpur, Maharashtra - 441107	2004-12-20	Female	Vijay Kolate	8149500048	vkolate74@gmail.com	Farmer	Ranjana Kolate	9022523351	ranjanakolate28@gmail.com	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
248	1561	9322033716	tejasirinait@gmail.com	tejasirinait.22@stvincentngp.edu.in	https://www.linkedin.com/in/tejasi-rinait-512b24252?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Jayanti Nagari 7, Besa , Nagpur	2003-04-18	Female	Sunilkumar	9423413365	sunilrinait@gmail.com	Teacher	Sarita	7798275231	saririnait@gmail.com	Teacher	N/A	9423413365	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
632	1412	9922916221	jotanushree11@gmail.com	tanushreejoshi.22@stvincentngp.edu.in	N/A	Amrut Sadan, Dhantoli Nagpur	2004-03-11	Female	Manoj Joshi	9822572021	N/A	Business	Bhagyashree Joshi	8669972021	N/A	Housewife	Tanushree	9922916221	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
24	357	9923886183	parikapandharkar@gmail.com	parikapandhankar.24@stvincentngp.edu.in	https://www.linkedin.com/in/parika-pandharkar-949523326?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Akash Vihar, Anjangaon surji, Dist. Amaravati	2005-11-25	Female	Ravindra	9923461385	ravindrapandharkar7@gmail.com	worker	Meena	9404046765	N/A	housewife	Neha Pandharkar	8390810805	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
28	328	9172978104	jenniferjoseph1310@gmail.com	jenniferpjoseph.24@stvincentngp.edu.in	https://www.linkedin.com/in/jennifer-joseph-0095b1344?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app	Dev Appt ,Fulmati layout,Beltarodi road ,Nagpur	2006-07-04	Female	Philips Joseph	9326262057	philipsjoseph@gmail.com	Jounalist	Ana Joseph	9326262057	anajoseph232@gmail.com	Teacher	Mother	9326262057	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
445	1581	7559271454	saidenlloydsequeira@gmail.com	SAIDENSEQUEIRA.21@stvincentngp.edu.in	linkedin.com/in/saiden-sequeira-38ba87271/	Plot no 21 Shri Hari Nagar Narendra Nagar, Nagpur	2004-01-13	Male	Lloyd Sequeira	9325074275	lloyd@htr-india.com	Production Manager	Aparna Sequeira	9325892476	lloyd@htr-india.com	Housewife	9325074275	9325892476	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
59	436	8237468988	shivamkurhadkar24@gmail.com	shivamkurhadkar.24d@stvincentngp.edu.in	https://www.linkedin.com/in/shivam-kurhadkar-78783b311?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	At post jalka patache talk. Dhamangon \nDist. Amravati	2005-05-30	Male	Praful kurhadkar	9921642162	.	Farmer	Jyoti kurhadkar	9921642162	N/A	Housewife	Praful kurhadkar	9921642162	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
64	404	9356805304	vmgawli95@gmail.com	vanshmaheshgawli.23@stvincentngp.edu.in	N/A	Teacher colony butibori , nagpur	2005-10-20	Male	Pramod	9850726348	N/A	Employee	Pratibha	7796813917	N/A	House wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
65	439	7218496687	mudesuraj52@gmail.com	surajmude.24d@stvincentngp.edu.in	N/A	At post Hingani tahseel Seloo district Wardha	2005-08-01	Male	Vivek Vasantrao Mude	9545312762	N/A	Farmer	Vaishali Vivekrao Mude	9545312762	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
68	702	9284331076	aratishende2007@gmail.com	aratishende.24@stvincentngp.edu.in	www.linkedin.com/in/ arati-shende-237035348	AT DAHEGAON POST SHIROLI TA GHATANJI DIST YAVATMAL 445301	2007-05-13	Female	RAMBHAU	7498769472	rambhaushende1967@gmail.com	FARMER	RATNAMALA	7498769472	N/A	HOUSE WIFE	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
69	381	9860517542	sejalbhupal15@gmail.com	sejalbhupal.23@stvincentngp.edu.in	https://www.linkedin.com/in/sejal-bhupal-137bb9301?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	nagpur	2005-04-30	Female	Ravindra Bhupal	8329475997	bhupalravindra@gmail.com	business	jyoti bhupal	9665030393	jyotibhupal@gmail.com	house wife	sejal bhupal	9860517542	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
171	1372	6006938599	rajputsheetal0077@gmail.com	sheetaldevi.23@stvincentngp.edu.in	N/A	Village jasath, Tehsil Ghagwal, District (Samba)Jammu and kashmir (184141)	2005-03-07	Female	Avtar Singh	9797511325	N/A	Farmer	Radha Rani	7889495831	N/A	House wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
286	681	9022418630	burdeishika@gmail.com	ishikaburde.24@stvincentngp.edu.in	https://www.linkedin.com/in/ishika-burde-985780351?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Flat no. 201/A shivraj appartment, shesh nagar, manish layout kharbi road nagpur.	2006-09-29	Female	Sanjay Burde	9326046325	sanjayburde77@gmail.com	Business	Rekha Sanjay Burde	8669097371	rekhaburde2968@gmail.com	Private bank manager	Sanjay Burde	9326046325	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
287	1378	6005794993	manchitchoudhary9181@gmail.com	manchitchoudhary.23@stvincentngp.edu.in	N/A	H.no.-218, sec -5 , Nanak Nagar Jammu	2004-03-17	Male	Madan singh	9419232993	N/A	Business	Reena Devi	7006819932	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
292	1353	8767777971	pratikbhoyar156@gmail.com	pratikbhoyar.23@stvincentngp.edu.in	N/A	Hudkeshwar Nagpur pipla	2005-11-21	Male	Sanjay bhoyar	9850776530	N/A	Farmer	Venu Sanjay bhoyar i	98348 90985	N/A	House wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
184	1360	7709935596	ketki1305@gmail.com	KETKITHAKRE.23@stvincentngp.edu.in	https://www.linkedin.com/in/ketki-thakre?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Appt no. 02 ,Flat no. 305, Sarju Town ,infront of jagat public school, Wathoda, Nagpur-440035	2005-05-13	Female	Narendra Thakre	9049553083	nthakre.42@gmail.com	Service	Rohini Narendra Thakre	8806681515	N/A	Home maker	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
315	335	8265000411	shubhamdongare912@gmail.com	shubhamdongare.24@stvincentngp.edu.in	N/A	At Parsodi, PO Kakada, Ta Karanja, Dist Wardha	2005-12-06	Male	Shriram Dongare	7263837310	N/A	Farming	Yogita Dongare	7263837311	N/A	HomeMeker	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
202	700	8788859031	gulhanegaurav681@gmail.com	gauravgulhane.24@stvincentngp.edu.in	-	-	2006-06-22	Male	Dnyaneshwar Gulhane	8459632167	dnyaneshwargulhane123@gmail.com	Farmar	Swati	8459632167	swatigulhane@gmail.com	Housewife	Gaurav Gulhane	8788859031	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
203	1394	7796542860	rishabchawhan99@gmail.com	rishabchawhan.22@stvincentngp.edu.in	www.linkedin.com/in/ rishab-chawhan-533512281	House No 25 Malani Layout Jamb Road Wadgaon Yavatmal Maharashtra 445002.	2003-06-11	Male	Suresh Namdevrao Chawhan	9158166300	sureshchawhan24@gmail.com	ITI RAC Instructor	Manjushree Chawhan	8668552718	manjuchawhan82@gmail.com	Housewife	8668552718	8080694457	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
459	362	7559395548	ruchikathosar06@gmail.com	ruchikathosar.24@stvincentngp.edu.in	N/A	Plot no. 3, shyam nagar, behind Tapovan Complex, Somalwada, Nagpur	2006-07-26	Female	Pankaj Thosar	9922585548	N/A	Private job	Ashwini Thosar	9767761061	N/A	Private job	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
626	1430	7999672364	fahadkhan.cengr@gmail.com	fahadkhan.22@stvincentngp.edu.in	https://www.linkedin.com/in/fahad-khan-58babb2b1?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Bedi Colony, Ward no.5, Chhindwara, Madhya Pradesh	2003-10-22	Male	Abdul Nafees	9425896232	N/A	Service(WLC)	Rizwana Nikhat	7806059894	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
324	1346	9370813943	sumedhmeshram2701@gmail.com	sumedhmeshram.23@stvincentngp.edu.in	https://www.linkedin.com/in/sumedh-meshram-66539a28a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	bhante Aanand kaushlya nagar pili nadi kamptee road nagpur	2006-01-27	Male	shamrao meshram	9370160645	N/A	Labour	Vishakha meshram	7972294816	N/A	Housewife	9370813943	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
363	425	8448259309	jeenajoseph2505@gmail.com	jeenajoseph.23@stvincentngp.edu.in	N/A	Gh 5 & 7, 891 Meera Bagh Paschim Vihar New Delhi -110087	2005-08-25	Female	P.V Joseph	9891754635	N/A	Private Service	Rosamma Joseph	8595928361	N/A	House Wife	Josna Joseph	8800237743	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
470	696	7798423805	kavyamude404@gmail.com	kavyamude.24@stvincentngp.edu.in	N/A	Plot no 158, lane no 3,hawrapeth,bhagwan nagar,nagpur	2006-04-04	Female	Gunvant Mude	9422318142	gunvantmude@gmail.com	Police,wireless department (hwo)	Rohini Mude	7057465423	N/A	Housewife	Gunvant Mude	9422318142	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
789	1331	8767651207	elizabethchouri13@gmail.com	elizabethchauri.23@stvincentngp.edu.in	N/A	Mahanubhav nagar gorewada	2005-05-13	Female	Stephen chouri	9075122592	N/A	Ex-army	Joan chouri	9405608972	N/A	Teacher	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
26	367	9881361725	pokharerishita@gmail.com	rishitapokhare.24@stvincentngp.edu.in	N/A	Plot no.37 Datta Sadan,Priti Society,Hazaripahad ,Bhivsan Khori Road,Nagpur	2005-11-29	Female	Shivadas Gopal Pokhare	9766353424	P_shiva2008@yahoo.com	Private job	Manisha Pokhare	9881361725	N/A	HousewifeP	8983353424	9766353424	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
284	1371	7724946256	mannasarabilu@gmail.com	mannabilu.23@stvincentngp.edu.in	N/A	E/4, street-2, Ashish Nagar(west), Risali, Bhilai, Chhattisgarh	2004-06-25	Female	K. I. John	9826500555	N/A	Retired	Binu John	9424120383	N/A	Retired	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
157	1325	8149497011	tanusinha.chd@gmail.com	tanusinha.23@stvincentngp.edu.in	N/A	S4 sukhakarta appartment sargar nagar chandrapur	2005-10-13	Female	Rakesh Sinha	9890254600	rakeshsinha.chd@gmail.com	Income tax practitioner	Vibha Sinha	9890456699	vibhasinha.chd@gmail.com	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
288	1336	7249572601	romadive77@gmail.com	romadive.23@stvincentngp.edu.in	N/A	Opp.ST Workshop, Ranjankhol, Rahata, PO: Tilaknagar, DIST: Ahmadnagar, Maharashtra - 413720	2005-09-27	Female	Amol Dive	8975123080	N/A	Business	Rupali Dive	9325434121	N/A	House wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
289	1370	9832468590	guradeshdhillon@gmail.com	guradeshdhillon.23@stvincentngp.edu.in	N/A	S.p. mukherjee road near Gurudwara beside Vigneshwara arcade, Murgasol, Asansol, West Bengal - 713303	2004-10-25	Male	Baljinder Singh	7001372693	N/A	Businessman	Jaswinder kaur	8918624085	N/A	Housewife	Baljinder Singh	7001372693	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
290	1363	7058047675	utkarshraut47@gmail.com	utkarshraut.23@stvincentngp.edu.in	https://www.linkedin.com/in/utkarsh-raut-934560308?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	96, Nirmal colony, Nara Road, Nagpur -440014	2005-04-07	Male	Dharmendra Raut	9422123529	dharmendraraut05@gmail.com	Contractor	Sandhya Raut	9657500285	sandhyaraut8901@gmail.com	Homemaker	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
306	349	8668998935	dravishpardhi980@gmail.com	dravishpardhi.24@stvincentngp.edu.in	N/A	Wcl umred tsmq 6a	2006-03-07	Male	Ganesh	9834097442	N/A	Ward boy	Pornima	7588937912	N/A	House wife	86689998935	8998668935	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
446	420	9408164323	hannahturkey15@gmail.com	hannahabraham.23@stvincentngp.edu.in	https://www.linkedin.com/in/hannah-elsa-abraham-4b84a430b	Plot No. 41, Shilpa Co Op Society. Near Maha Rudra Nagar, Somwar Bazaar Road, Landmark Besa-Manish Nagar Road, Manish Nagar, Nagpur 440015	2006-02-15	Female	T A Abraham	94787 32313	N/A	Social Worker	Betty Abraham	9016113883	N/A	House wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
624	1428	8766759361	siddhabhattiyash@gmail.com	yashsiddhabhatti.22@stvincentngp.edu.in	N/A	Sai Ganesh Appartment, Jai Gurudeo Nagar, Manewada - Besa Road , Nagpur-27	2005-02-22	Male	Pravin	8669980211	N/A	Private Job	Shilpa	7972179074	N/A	House Wife	Pravin Siddhabhatti	9503669258	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
73	698	9373899136	ojasmitakumbhare27@gmail.com	ojasmitakumbhare.24@stvincentngp.edu.in	www.linkedin.com/in/ojasmita-kumbhare-139835359	Flat no. 202 tulip B metroplex residency near pallotti school besa	2006-05-27	Female	ASHOK KUMBHARE	9422109364	ashok7246@gmail.com	business	anita kumbhare	9373899136	ojasmitakumbhare.24@stvincentngp.edu.in	housewife	9422109634	9373899136	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
77	442	8149940314	shravanwar42@gmail.com	shravanwargantiwar.24d@stvincentngp.edu.in	https://www.linkedin.com/in/shravan001/	Balaji Nagar Bhagwan Nagar road Manewada Nagpur 440027	2005-04-05	Male	Pramod Wasudeo Wargantiwar	8446392743	N/A	Electrician	Jyoti Pramod Wargantiwar	7887353642	N/A	House wife	Shravan Wargantiwar	7887353642	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
182	697	9673370654	aryannakade123@gmail.com	aryannakade.24@stvincentngp.edu.in	N/A	Plot no 31 talmaley layout butibori	2006-03-30	Male	Suresh Nakade	9673370613	N/A	Employee	Sarita Nakade	9403420170	N/A	House wise	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
452	1330	7744804964	melrickpaul308@gmail.com	melrickpaul.23@stvincentngp.edu.in	https://www.linkedin.com/in/melrick-paul-888690325?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Adress- Duplex no-23 near anganwadi school Rishikesh town, phase -2 Bhiligaon Nagpur Maharashtra-441002	2004-11-19	Male	Regie Gounder	9730078932	regiegounder71@gmail.com	railway employee	Philomina Gounder	9422808864	philominagounder7519@gmail.com	teacher	mark paul	7972782646	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
456	1425	9403939109	ankitaaitwar@gmail.com	ankitaaitwar.22@stvincentngp.edu.in	https://www.linkedin.com/in/ankita-aitwar-625a35303	Kannamwar chowk, sironcha	2003-09-28	Female	Venkateshwar Aitwar	9405659103	aitwar1977@gmail.com	Teacher	Varsha Aitwar	9405136230	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
201	380	9561853380	sayalibambal218@gmail.com	sayalibambal.23@stvincentngp.edu.in	https://www.linkedin.com/in/sayali-bambal-1a6241302/	Reshimbag, Nagpur, Maharashtra	2004-05-13	Female	Sandip Bambal	7709639114	N/A	Government Service	Madhuri Bambal	7020242218	N/A	Housewife	Madhuri Bambal	7020242218	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
342	391	8668928980	teenalbiju@gmail.com	teenalbiju.23@stvincentngp.edu.in	N/A	80/7 subhadra apartment, ujjwal nagar, somalwada, nagpur.	2005-03-24	Female	Biju Joseph	9970361406	N/A	Dy.manager(HR)	Reeja Biju	9300653831	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
265	1334	8421157970	aarushighadge123@gmail.com	aarushighadge.23@stvincentngp.edu.in	www.linkedin.com/in/aarushi-ghadge-8542a2384	29, Old Jagaruti Colony, Friends colony, Near Seminary Hills	2005-12-14	Female	VINIT GHADGE	9423631371	aarushighadge@gmail.com	Audit Officer	MEETA GHADGE	8275741822	ghadgemeeta@gmail.com	Teacher	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
343	1426	9307053289	ayushihatwar137@gmail.com	ayushihatwar.22@stvincentngp.edu.in	https://www.linkedin.com/in/ayushi-hatwar-66a41b257	Goverdhan Nagar Tumsar\nAai nivas,goverdhan nagar, dhewadhi road tumsar	2004-04-05	Female	Ajay Hatwar	9422133898	NA	NA	Kavita Hatwar	9422133898	ajayhatwar91@gmail.com	Housewife	Nita Nasre	9272934475	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
353	379	7709421412	jenika.barai@gmail.com	jenikabarai.23@stvincentngp.edu.in	N/A	Near Tulja Bhavani Mandir,Khat road, Bhandara	2004-12-14	Female	Kishor Moreshwar Barai	7038825935	kishor.barai721971@gmail.com	Distributor	Madhuri Kishor Barai	9922889255	N/A	Housewife	Kishor Barai	7038825935	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
364	410	9834140368	atharva.kamde13@gmail.com	atharvakamde.23@stvincentngp.edu.in	https://www.linkedin.com/in/atharva-kamde-7726a22a7?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Dighori , nagpur	2005-04-13	Male	Ravindra Kmade	9881235399	N/A	B.Ed	Shalini Kamde	9028357599	N/A	.	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
367	1437	7780862928	arzoovillayatali@gmail.com	villayatali.22@stvincentngp.edu.in	N/A	KARGIL , LADAKH \nPIN CODE:-194303	2005-02-01	Male	MOHD SADIQ	9469113917	N/A	farmer	RAHIMA BANOO	0000000000	N/A	farmer	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
371	1395	8459470730	mansithakre23@gmail.com	mansithakre.22@stvincentngp.edu.in	N/A	Chitnavis Nagar Umred Road, Nagpur	2003-09-23	Female	Murlidhar Thakre	9766063121	N/A	Farmer	Mangala Thakre	9767037382	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
468	1317	9022898198	mulankaryash22@gmail.com	yashmulankar.22@stvincentngp.edu.in	http://linkedin.com/in/yash-mulankar-09a81825a	15 damayanti, Kothari watika no 2, Mallapur road Akola	2004-05-22	Male	Vijay Mulankar	9823976354	N/A	Police Inspector	Anagha Mulankar	9049590121	N/A	Housewife	Yogesh Kahale	9922240022	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
575	1405	9518536714	anushdighore2003@gmail.com	anushdighore.22@stvincentngp.edu.in	N/A	Warghane Layout, MIDC Butibori	2003-10-08	Male	Shankar	9850984098	N/A	Private Employee	Rekha	9921383443	N/A	house wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
156	1322	9527319575	juelichintawar25@gmail.com	juelichintawar.23@stvincentngp.edu.in	jueli_chintawar	Vaishnav nagar near bavane mangal karaylay, warora,chandrapur 442907	2005-07-25	Female	Prakash Chintawar	9921836737	N/A	Businessman	Jaya Chintawar	7385566580	N/A	Housewife	Piyush Chintawar	9561498489	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
158	1323	7350776952	payalmohanapure@gmail.com	Payalmohanapure.23@stvincentngp.edu.in	N/A	Ganga Sagar water,gharote hospital,kamala Nehru hospital ramnagar Wardha 442001	2004-03-08	Female	Sanjay mohanapure	7517036184	sanjaymohanapure@gmail.com	Contractor	Vidhya mohanapure	9011129197	vidhyamohanapure@gmail.com	Teacher	7517036184	9011129197	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
35	372	8263818483	shivnayanthakare8@gmail.com	shivnayanthakare.24@stvincentngp.edu.in	https://www.linkedin.com/in/shivnayan-thakare-320919292	At. Post Kumbha  Ta. Maregaon Dist. Yavatmal	2005-08-29	Male	Ashok Vitthal Thakare	9529535752	N/A	Farmer	Vanita Ashok Thakare	9529535752	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
285	432	7051678451	nalakshrandhawa7051@gmail.com	nalakshrandhawa.23@stvincentngp.edu.in	N/A	Village Devi Garh, Sai\r\nKalan, Jammu,\r\nJammu and Kashmir - 181131	2005-01-08	Male	Subash chander	9067011406	N/A	Retired	Preeti choudhary	7051678451	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
291	1347	7709688592	tanishashingne04@gmail.com	tanishashingne.23@stvincentngp.edu.in	https://www.linkedin.com/in/tanisha-shingne-5885aa330?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Plot no 2,Ekta Nagar,Gorewada tank road, Nagpur 440013	2004-04-07	Female	Ramesh Shingne	9765774448	rameshshingne@gmail.com	Retired	Archana Shingne	9421706288	archanashigne1@gmail.com	Teacher	Tanisha Shingne	7709688592	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
45	360	7410509989	lanjewarkrish07@gmail.com	krishlanjewar.24@stvincentngp.edu.in	https://www.linkedin.com/in/krish-lanjewar	Dighori bridge, behind omkar celebration lawn snehal nagar ,nagpur	2006-06-08	Male	Naresh Lanjewar	9423483954	N/A	Teacher	Yeshuka	9423483954	N/A	House wife	9423483954	8855869231	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
294	434	6006349805	rohansingh59110@gmail.com	rohansingh.23@stvincentngp.edu.in	N/A	Kirpalpur , phallain mandal, Jammu 180003 Jammu and Kashmir	2004-10-18	Male	Surinder Singh	6006284899	N/A	Driver	Reeta Devi	8805503653	N/A	House wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
52	351	8237417251	samikshathawakar61@gmail.com	samikshathawakar.24@stvincentngp.edu.in	https://www.linkedin.com/in/samiksha-thawakar-14a4a9341?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Nayapura Bastarwari near Shakti dham mandir, Nagpur	2007-07-04	Female	Vimeshwar Thawkar	9764740880	N/A	Private	Kalawati Thawkar	7972283329	N/A	Housewife	Neha Thawkar	9112983206	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
53	339	8830889603	kanchanghode.08@gmail.com	kanchanghode.24@stvincentngp.edu.in	https://www.linkedin.com/in/kanchan-g-a280352b5?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Panchawati, Katol, Nagpur - 441302	2006-08-18	Female	Nitin Ghode	7020318707	nitinghode347@gmail.com	Farmer	Pooja Ghode	8830889603	lukughode12@gmail.com	House Wife	Pooja Ghode	8830889603	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
174	690	8625052853	ayushingole806@gmail.com	ayushingole.24@stvincentngp.edu.in	N/A	Buttibori, Nagpur	2006-08-29	Male	Avinash Ingole	9765028730	N/A	Farmer	Archana Ingole	9545629669	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
177	313	7410593208	omnagpure5678@gmail.com	omnagpure.24@stvincentngp.edu.in	N/A	Camp Area Rampuri Ward ward no 18 Gadchiroli	2006-03-11	Male	Bhaskar Nagpure	9421733208	N/A	Private Sector	Varsha	8698636908	N/A	HouseWife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
72	675	8767491830	fionasam2229@gmail.com	fionasamuel.24@stvincentngp.edu.in	https://www.linkedin.com/in/fiona-samuel-a38856329	Plot no 69-70, Sanjeevani Enclave, Flat no 401, Green Field Society, Zingabai Takli, Nagpur - 440030	2006-04-29	Female	Terrence Samuel	9762002946	N/A	Private Job	Vinisha Anthony	9767491830	N/A	Teacher	Fiona Samuel	8767491830	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
183	336	9767445679	nikitabhushanwar03@gmail.com	nikitabhushanwar.24@stvincentngp.edu.in	www.linkedin.com/in/nikita-bhushanwar-a57847369	TYPE - VII/06/05, Vidyut Vihar K.T.P.S. Colony , Near SBI Bank, Koradi, Nagpur - 441111	2005-08-03	Female	SANJAY MAHADEORAO BHUSHANWAR	9850903826	sanjaybhushanwar.103@gmail.com	Service	ALPANA SANJAY BHUSHANWAR	9823616688	alpanabhushanwar1981@gmail.com	Homemaker	SANJAY BHUSHANWAR	9850903826	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
186	684	8080472304	vedantikabhoyar135@gmail.com	vedantikabhoyar.24@stvincentngp.edu.in	N/A	Vitthal Mandir Ward no. 1 infront of Vitthal Mandir, Chandrapur,Maharashtra,442401	2006-12-05	Female	Anil Bhoyar	9850000843	N/A	Shopkeeper	Seema Bhoyar	8830957081	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
79	325	9860112964	garvinaaron26@gmail.com	aarongarvin.24@stvincentngp.edu.in	N/A	P.NO.423, D-Block, St. Martin Nagar, Jaripatka, Nagpur	2006-08-26	Male	Clive Garvin	9860889910	N/A	Government	Avril Garvin	9822368672	N/A	Private	Clive Garvin	9860889910	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
80	707	8668260665	zubiyakhushgil@gmail.com	zubiyakhan.24@stvincentngp.edu.in	N/A	Plot no 31, Kohinoor Society ,Paradise Colony Walgaon road,Amravati,Maharashtra.	2006-06-21	Female	Shakeel Ahmad Khan	9422555192	shakeelykhan@gmail.com	Assistant Professor	Nikhat Jahan	9403088002	N/A	House Wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
81	369	8815988292	saviocherian06@gmail.com	saviocherian.24@stvincentngp.edu.in	https://www.linkedin.com/in/savio-cherian-899835383?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Betul Madhya Pradesh	2006-01-26	Male	Cherian Dominic	9589216398	cheriandominic68@gmail.com	Ex service man	Elizabeth Cherian	9893973305	cheriandominic68@gmail.com	Nurse	Cherian Dominic	9589216398	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
82	705	7972749506	ruchiambatkar2@gmail.com	ruchiambatkar.24@stvincentngp.edu.in	https://www.linkedin.com/in/ruchi-ambatkar-01a774351	Bahadura, Umred Road, Nagpur	2006-01-23	Female	Ramesh Ambatkar	9158216500	ramesh.ambatkar25@gmail.com	Private job	Rekha Ambatkar	9529093509	rekhaambatakr1981@gmail.com	Housewife	Yash Ambatkar	9657884302	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
83	356	8669412569	valenciowilliam59@gmail.com	valenciowilliam.24@stvincentngp.edu.in	www.linkedin.com/in/valencio-william-863424378	St. Martin Nagar, Jaripatka	2006-03-23	Male	Robin William	7020857783	N/A	Private Sector	Pasca William	8669131765	N/A	Lecturer	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
85	712	7498916062	atharvatrinagariwar@gmail.com	atharvatrinagariwar.23@stvincentngp.edu.in	N/A	Shubhangi Nagar 2 near balaji mandir besa	2005-09-07	Male	Subhash	9689544989	subashtrinagariwar@gmail.com	Auditor	Seema	9822468043	seematadurwar@gmail.com	Housewife	Seema Subhash Trinagariwar	9822468043	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
297	1384	8530080205	shravanib722@gmail.com	shravanibobde.24@stvincentngp.edu.in	N/A	Chinchbhawan wardha road opposite datta mandir shree nagar nagpur	2006-08-07	Female	Vijay Bobde	8237057925	N/A	Marketing	Roshni Bobde	8983261296	roshnibobde22@gmail.com	Teacher	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
94	668	9226748676	kajolwanode@gmail.com	kajolwanode.24@stvincentngp.edu.in	N/A	At. Wagdara, post. Gumgaon , Tah. Hingna  Dist. Nagpur	2006-09-16	Female	Purushottam Wanode	8308122363	N/A	Farmer	Darshana Wanode	8308122363	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
494	1327	8263808680	skzsh95@gmail.com	md.shahanwaz.23@stvincentngp.edu.in	N/A	Bijuli sadar darbhanga Bihar 847115	2001-04-07	Male	Md sanzar	8294981964	mdshahanwazshaikh4580@gmail.com	Business	Hasmati khatoon	7739343274	N/A	House wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
193	1318	9823743971	rochansawasthi@gmail.com	rochanawasthi.23@stvincentngp.edu.in	https://www.linkedin.com/in/rochan-awasthi-393242302/	55, Baba Farid Nagar, Koradi Road, Nagpur	2005-01-15	Male	Shrish Awasthi	9923753971	shrishawasthi1975@gmail.com	Service	Shuchi Awasthi	8208951658	rochanawasthi@gmail.com	HomeMaker	9923753971	8208951658	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
93	683	7889964900	sparshchalotra2975@gmail.com	sparshchalotra.24@stvincentngp.edu.in	https://www.linkedin.com/in/sparsh-chalotra-5340b9379?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app	Omara morh near police academy udhampur jammu and kashmir	2005-11-09	Male	Ravi kumar	7889546427	sparshchalotra89@gmail.com	Businessman	Madhu bala	7889964900	sparshchalotra2975@gmail.com	House wife	Ravi kumar	7889546427	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
105	399	7841855945	shreyash4546c@gmail.com	shreyashtawade.23@stvincentngp.edu.in	https://www.linkedin.com/in/shreyash-tawade-4a91b331b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Naginabag, Chandrapur	2025-09-10	Male	Vilas Tawade	7972365938	N/A	Government Service	Kalpana Tawade	9637754840	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
277	1381	9370130652	priyapachgade@gmail.com	priyapachgade.24d@stvincentngp.edu.in	https://www.linkedin.com/in/priya-pachgade-7b55b42a6/	Rai Town Society Flat No B1 409 Hingna Road Nagpur	2005-05-27	Female	Vinod Pachgade	7620619148	vinodpachgade125@gmail.com	Business	Pooja Pachgade	7020450492	poojapachgade@gmail.com	Business	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
129	665	7620891917	jadhaosankalp@gmail.com	sankalpjadhao.24@stvincentngp.edu.in	N/A	wathoda layout,nagpur	2006-12-20	Male	sanjay jadhao	7083324277	sanjayjadhao08@gmail.com	government job	sanjana jadhao	8668722462	sanjanajadhao658@gmail.com	housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
302	1345	9356807527	aniketsinganjude1@gmail.com	aniketsinganjude.23@stvincentngp.edu.in	https://www.linkedin.com/in/aniket-singanjude-912050308?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	(Kawdak) Dudhala, Ramtek	2005-05-29	Male	Kailas Shripat Singanjude	9049358752	N/A	Clerk	Jyoti Kailas Singanjude	86050 47281	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
460	1584	8975903889	beleanuja6@gmail.com	anujabele.22@stvincentngp.edu.in	https://www.linkedin.com/in/anuja-bele-076549258	Plot no 33 Bhandarkar layout bypass road umred	2004-09-08	Female	Anil Bele	9823918314	anilbele07@gmail.com	Business man	Archana Bele	7219524826	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
476	354	9149577621	stanyboy379@gmail.com	stanzinchosrab.24@stvincentngp.edu.in	http://linkedin.com/in/stanzin-chosrab-985874376	Bodhkharbu, kargil , ut ladakh , india	2005-06-26	Male	Skarma Tsering	8899687798	stanyboy379@gmail.com	Farmer	Skarma Zangmo	8899687798	stanyboy379@gmail.com	House wife	7051116483	9469627770	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
639	1434	8767853987	salodkarra@gmail.com	radhikasalodkar.22@stvincentngp.edu.in	N/A	51, Pride Residency 5, Manish Nagar, Nagar	2005-02-27	Female	Abhijit Salodkar	9975497307	N/A	Mechanical Engineer	Prachi Salodkar	9960125258	salodkarpa@gmail.com	Assistant Professor	Prachi Salodkar	9960125258	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
491	383	9322526739	devanshuekhar11@gmail.com	devanshuekhar.23@stvincentngp.edu.in	https://www.linkedin.com/in/devanshu-ekhar-bb484b313?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Plot No.6, Gorale Layout, Near Anjana Devi Hall, Zingabai Takli, Nagpur	2005-01-16	Male	Sanjay Ekhar	9421807264	sanjayekhar@gmail.com	Service	Bharti Ekhar	8208867583	bhartiekhar@gmail.com	Home maker	8208867583	9421807264	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
356	377	9702059013	kgbig7siddu@gmail.com	siddheshbhiwapurkar.23@stvincentngp.edu.in	http://linkedin.com/in/siddhesh-bhiwapurkar-1a7a25326	Flat 201, Ganadhish Apartment 2 \nManish Nagar , Nagpur-440019	2005-10-14	Male	Ganesh Kothiram Bhiwapurkar	9884425310	gkbhiwapurkar@gmail.com	AAI	Bhavana Ganesh Bhiwapurkar	9025974377	N/A	House Wife	Anup Nandanwar (Mama)	9028386784	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
358	388	9021815055	annlinmathew004@gmail.com	annlinmathew.23@stvincentngp.edu.in	N/A	138, Chaya Apartment\nSantaji Society, Balpande Layout, Narendra Nagar	2004-10-23	Female	K.A. Mathew	9422144995	N/A	Civil Engineer	Treesa Mathew	8329307073	N/A	Homemaker	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
643	1541	7887752884	ishabarapatre115@gmail.com	ishabarapatre.22@stvincentngp.edu.in	https://www.linkedin.com/in/isha-barapatre-93220b345	260, near NIT garden, mhalgi nagar, hudkeshwar road, Nagpur	2004-05-20	Female	Vinayak Barapatre	9226430718	vinayakbarapatre3322@gmail.com	Business	Sunita Barapatre	7620274458	sunitabarapatre1308@gmail.con	Housewife	Yash Barapatre	9623431911	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
496	1349	7666458896	shirkemanthan40@gmail.com	manthanshirke.23@stvincentngp.edu.in	www.linkedin.com/in/manthan-shirke-4935b22a7	107, Sant Tajeshwar Nagar, Hudkeshwar Road, Naka, Nagpur - 34	2005-09-24	Male	PRASHANT DAULATRAO SHIRKE	9850433538	shirke.prashant61@gmail.com	Advocate	KARUNA PRASHANT SHIRKE	8830949078	shirkekaruna93@gmail.com	Housewife	Prashant Shirke	9850433538	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
498	437	9359903793	rushikeshbh18@gmail.com	rushikeshbhandekar.24d@stvincentngp.edu.in	http://linkedin.com/in/rushikesh-bhandekar-7a462635b	Wankhade Nagar, Dabki Road, Old city , Akola	2005-08-12	Male	Chandrashekhar Rameshrao Bhandekar	7741062190	chbhakl@gmail.com	Private Employee	Vidya Chandrashekhar Bhandekar	8087327454	vidyabhandekar08@gmail.com	Housewife	Rushikesh Bhandekar	8956780177	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
500	1524	9699043155	vaibhavib524@gmail.com	vaibhavibalbudhe.22@stvincentngp.edu.in	www.linkedin.com/in/vaibhavi-balbudhe-b76560249	Plot no. 25, Gopal nagar\n1 st bus stop, Nagpur	2003-05-03	Female	Hirankumar Balbudhe	9673366644	hiru.balbudhe@gmail.com	Business	Vaishali Balbudhe	7498932192	vaishalibalbudhe@gmail.com	Home-maker	9673366644	7498932192	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
501	1413	7249360170	ayushkshirsagar28@gmail.com	ayushkshirsagar.22@stvincentngp.edu.in	N/A	Manewada Ring Road Uday Nagar Square	2004-02-08	Male	Haribhau Kshirsagar	9665800170	haribhau444@gmail.com	-	Usha Kshirsagar	7666843817	N/A	-	Haribhau Kshirsagar	9665800170	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
652	1526	7066352882	hwanjari43@gmail.com	harshwanjari.22@stvincentngp.edu.in	www.linkedin.com/in/harshwanjari	Juni Shukrawari Telipura, Nagpur, Maharashtra, India	2004-02-21	Male	Sukhadeo Wanjari	8788241019	wanjari20@gmail.com	Business	Kanchan Wanjari	8329402764	hwanjari43@gmail.com	Homemaker	Sukhadeo Wanjari	8788241019	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
703	1552	9579353134	aayushjibhkate30@gmail.com	aayushjibhkate.22@stvincentngp.edu.in	https://www.linkedin.com/in/aayushjibhkate	At.Post.Wag , Tah.Kuhi ,Dist.Nagpur 441210	2005-03-30	Male	Nitin	9579353134	N/A	N/A	Tarkanya	9511643332	tarkanyajibhkate@gmail.com	Farmer	Tarkanya Jibhkate	9511643332	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
304	1445	9529291610	palashbhong@gmail.com	palashbhong.23d@stvincentngp.edu.in	N/A	At.post  jamani tq.zarijamani dist.yavtmal	2004-08-08	Male	Wasudeo Bhong	9529291610	N/A	Farmer	Babita	9527291610	N/A	Farmer	7745020247	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
206	1422	7709217039	aryaingole2@gmail.com	aryaingole.22@stvincentngp.edu.in	https://www.linkedin.com/feed/	149 - Swamy colony, Aakar Nagar.	2003-11-14	Female	Manish Ingole	9422553446	manishingole2108@gmail.com	CLA	Sarita Ingole	9665133678	ingolesarita3@gmail.com	housewife	Sarita	9665133678	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
22	355	9588429301	pallavidahake028@gmail.com	dhanashreedahake.24@stvincentngp.edu.in	https://www.linkedin.com/in/dhanashree-dahake-69419b329?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	D-9 Sugog colony , \nMIDC Butibori,Nagpur	2006-04-30	Female	Ravindra Dahake	9921782008	N/A	Employee	Pallavi Dahake	8411968174	dhanashreedahake3103@gmail.com	Housewife	9588429301	9921782008	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
231	387	9552207044	nupurthakkar993@gmail.com	nupurthakkar.23@stvincentngp.edu.in	www.linkedin.com/in/ nupur-thakkar17	102 prachi apartment Chandak layout Ghat Road Nagpur	2005-07-17	Female	Jitendra Thakkar	9922587244	N/A	Businessman	Deepa Thakkar	9049755220	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
103	344	9552157554	sahil.girme.79@gmail.com	sahilgirme.24@stvincentngp.edu.in	https://www.linkedin.com/in/sahil-girme-7a1459345?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Flat No.204B, Plot no.13, Madhur Heights, Manmode Layout,Sumit Nagar, Zingabai Takli, Mankapur, Nagpur	2006-08-16	Male	Suraj Girme	8928696897	girmesuraj@gmail.com	Employee	Rashmi Girme	8975750319	N/A	Employee	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
238	428	8856885904	anushreekhadgi3@gmail.com	anushreekhadgi.23@stvincentngp.edu.in	Check out Anushree Khadgi’s profile on LinkedIn https://in.linkedin.com/in/anushree-khadgi-ba6a58299	Dr. Panjabrao Colony, Arvi road, Wardha	2005-05-11	Female	Dharmendra Khadgi	7038681526	dpkhadgi@rediffmail.com	Electrical Engineer	Archana Dharmendra Khadgi	9307250937	khadgiarchana2@gmail.com	Housewife	Dharmendra Khadgi	7038681526	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
108	687	7558645260	dhanshreehande76@gmail.com	dhanshreehande.24@stvincentngp.edu.in	https://www.linkedin.com/in/dhanshree-hande-5b4777321	Plot no. 12-B, Maharashtra Bank road, Ayodhya Nagar, Nagpur 440024	2006-10-25	Female	Hemant Hande	9767418665	hyhande72@gmail.com	Private Job	Alka Hande	9561800260	alkahande31@gmail.com	Insurance agent	9561800260	9767418665	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
109	692	7066246044	prajwalmartiwar525@gmail.com	prajwalmartiwar.24@stvincentngp.edu.in	https://www.linkedin.com/in/prajwal-martiwar-635793371?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	At post bembal tah mul district chandrapur	2005-10-15	Male	Vinod Moreshwar Martiwar	91302 90488	N/A	Farmer	Bharati	91302 90488	N/A	House-wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
307	1339	9503490891	kharwadeamruta18@gmail.com	amrutakharwade.23@stvincentngp.edu.in	N/A	At post sangadi ta sakoli bis bhandara	2005-07-27	Female	Ravindra Kharwade	9421716448	N/A	Business	Reena Kharwade	9421716448	N/A	House wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
110	322	7744094853	gauravtribhuwan08@gmail.com	gauravtribhuwan.24@stvincentngp.edu.in	https://www.linkedin.com/in/gaurav-tribhuwan-284a74334?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	TNPS boys hostel, ashokwan, jamtha, Nagpur	2006-08-27	Male	Deepak Tribhuwan	7744094853	gauravtribhuwan08@gmail.com	Not applicable	Justin Tribhuwan	7744094853	gauravtribhuwan08@gmail.com	Labour	Chandrakant Tribhuwan	9326127128	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
111	654	8329760896	wagherutuja23@gmail.com	rutujawaghe.24@stvincentngp.edu.in	N/A	Plot no. 18/2, near Radha Krishna Temple, Sumitra Nagar, Tukum, Chandrapur	2006-03-23	Female	Diwakar Waghe	8788581861	N/A	Teacher	Suchita Waghe	9021693757	N/A	Teacher	Diwakar Waghe	8788581861	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
241	406	9307651183	sanketnagapure453@gmail.com	sanketnagpure.23@stvincentngp.edu.in	N/A	Pukhraj Kochar Ward, Hinganghat, Wardha	2006-04-28	Male	Bharat Nagapure	9158356157	bharatnagapure67@gmail.com	Worker	Vaishali Nagapure	9158356157	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
114	421	8329658628	krushnataiwade@gmail.com	krushnataiwade.23@stvincentngp.edu.in	https://www.linkedin.com/in/krushna-taiwade-73a415350/	Plot No. 11, Sharda Nagar ,Hudkeshwar Road,Nagpur	2005-12-20	Male	Sunil Taiwade	8767196327	sharwaritaiwade@gmail.com	Job	Devki Taiwade	9921504458	devkist78@gmail.com	Service	Ravindra Taiwade	9881712985	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
120	679	8668501087	abelpbovas@gmail.com	abelbovas.24@stvincentngp.edu.in	N/A	Plot no 34. Bapu Nagar Nagpur	2006-07-06	Male	Bovas Varghese	8999633819	beenabovas@gmail.com	Enginer	Beena Bovas	8999126807	beenabovas@gmail.com	House Wife	8999126807	8668501087	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
127	694	8459244904	bhavishkapaunikar@gmail.com	bhavishkapaunikar.24@stvincentngp.edu.in	N/A	Plot no.34, Shri Ram society, prem nagar,nagpur	2006-11-23	Female	Anand Paunikar	9423063026	anandspaunikar@gmail.com	Business	Maya Paunikar	9423063026	N/A	House wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
135	709	9359730819	nehapatil01102006@gmail.com	nehapatil.24@stvincentngp.edu.in	https://www.linkedin.com/in/neha-patil-943959351	Mssfa girls hostel, vincent pallotti college	2006-10-01	Female	Raju patil	9422837623	rajupatil@gmail.com	Transport business	Laxmi	9156774627	laxmi@gmail.com	Housewife	Sonal patil	9156774627	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
244	1386	9561571755	Manasvigiradkar64@gmail.com	manasvigiradkar.22@stvincentngp.edu.in	https://www.linkedin.com/in/manasvi-giradkar-203b62290/	249, Sadhbhavana nagar, Nandanwan, Nagpur	2004-11-06	Female	Mohan Sheshrao Giradkar	9623867684	mohangiradkar123@gmail.com	Central Government Servant	Jyoti Giradkar	9422810084	jyotigiradkar19@gmail.com	Housewife	Mohan Giradkar	9623867684	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
633	1436	8767455601	atharvibabhare3@gmail.com	atharvibabhare.22@stvincentngp.edu.in	N/A	Plot no 41, lakshminarayan apartment flat no 202, Gawande Layout, Nagpur 440015	2004-10-06	Female	Pravin Babhare	9673837189	pravinbabhare@yahoo.co.in	Government service	Tanuja Babhare	9404310865	tanujababhare@gmail.com	MA completed in Arts	8767455601	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
637	1568	7972103821	sanikap880@gmail.com	sanikapatil.22@stvincentngp.edu.in	https://www.linkedin.com/in/sanika-patil-064591273	Plot no. 39, Vaishali Nagar ,Sherkey Lay Out , Hingna Road , 440016-Nagpur	2004-08-08	Female	Nivrutti Patil	9011096993	nivruttip565@gmail.com	Private Service	Suwarna Patil	8767789867	psuwarna54@gmail.com	Housewife	8767789867	9881320146	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
471	1380	7972208818	doyeshreya18@gmail.com	shreyadoye.24d@stvincentngp.edu.in	N/A	176, Mayuri appartment ayurvedic layout umred road nagpur	2005-04-02	Female	Sachin Vinayakraw Doye	9764779210	sachindoye672@gmail.com	Farmer	Rajani Sachin Doye	7887574169	sachindoye672@gmail.com	Housewife	7887574169	9764779210	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
274	438	7020061778	vedantvairale15@gmail.com	vedantvairale.24d@stvincentngp.edu.in	N/A	Plot no. 97 ,RAJGRUHA NAGAR, HINGNA ROAD ,	2005-04-15	Male	Narendra Vairale	9923925652	N/A	Employee	Bhavana Vairale	9112892103	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
276	363	8888080345	e10.anthony345@gmail.com	ethananthony.24@stvincentngp.edu.in	https://www.linkedin.com/e10anthony	31 Shivam Kunj, Barde Nagar, Nagpur	2007-03-10	Male	Ivan Anthony	9021111747	i1_anthony@hotmail.com	Medical Transcription	Nisha Anthony	9172150772	nishaivan2015@gmail.com	Teacher	Nisha Anthony	9172150772	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
305	1376	7835912404	jacobpmathew21@gmail.com	jacobmathew.23@stvincentngp.edu.in	https://www.linkedin.com/in/jacob-pmathew?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	DLF, Dilshad Extn 2	2005-09-30	Male	Mathew P Chacko	8287408843	mathew.chacko2011@gmail.com	Graphic Designer	Rani Mathew	9891803310	mathew.rani@gmail.com	Pvt. Service	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
207	1344	8421032572	misraprachi292@gmail.com	prachimishra.23@stvincentngp.edu.in	N/A	Malviya Ward Warora , chandrapur 442907	2006-04-15	Female	Sanat Mishra	8421032572	N/A	N/A	Priyanka Mishra	8805195398	N/A	Nurse	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
211	673	9518708957	joyseegrace76@gmail.com	joyseekannuri.24@stvincentngp.edu.in	N/A	Riddhi apartment, near bhukte hospital, chandrapur	2005-10-06	Female	Raju Kannuri	9960004750	awana.raju@gmail.com	Account Manager	Sadhana Kannuri	9923927408	sadhana.joy@gmail.com	Teacher	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
212	359	7218599129	devashishkamble06@gmail.com	devashishkamble.24@stvincentngp.edu.in	linkedin.com/in/devashish-kamble-a28b8b328	Plot no. 29, Tribhuvan cooperative housing society, Chakrapani Nagar, Pipla road, Nagpur	2006-06-28	Male	Dewanand Kamble	9921859918	dewanandkamble13@gmail.com	Assistant Professor (C. H. B.)	Jyoti Kamble	7721960059	jyotikamble2012@gmail.com	Assistant Professor	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
99	382	7620736679	vedantlade9@gmail.com	vedantlade.23@stvincentngp.edu.in	N/A	Hawaldarpura , ward no. 13, wardha	2005-02-19	Male	Santosh Lade	8830948445	N/A	Businessman	Archana Lade	9322276863	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
100	664	8851992308	bijujoel2000@gmail.com	joelbiju.24@stvincentngp.edu.in	N/A	158-G,pocket A2,Mayur vihar phase 3,New Delhi	2007-01-23	Male	Biju K Matthews	991-035-7241	j	Managment	Reena Biju	991-095-6837	bijureena658@gmail.com	Histopathology	Reena Biju	991-095-6837	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
216	656	7385097971	kunalsahu4045@gmail.com	kunalsahu.24@stvincentngp.edu.in	https://www.linkedin.com/in/kunal-sahu-99812737b	Near Sahu kirana store behind orange city hospital danteshwari Nagar West high court road Nagpur	2006-02-18	Male	Vinod sahu	9096420330	kunalsahu4045@gmail.com	Shop keeper	Dipika Sahu	7385097971	kunalsahu4045@gmail.com	House wife	7385097971	9096420330	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
219	435	7498575232	rashibongirwar10@gmail.com	rashibongirwar.23@stvincentngp.edu.in	N/A	flat no. 101, Vasvi 4 Appartment , Chandgaon road, Bramhapuri, Chandrapur 441206	2005-02-10	Female	Raju Bongirwar	9767560030	N/A	service	Smita Bongirwar	9284739913	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
308	337	8329092865	anshulthakre879@gmail.com	anshulthakre.24@stvincentngp.edu.in	N/A	At. Lapka, th . Post. Mouda, dis. Nagpur	2006-09-12	Male	Ravindra Thakre	9326510877	N/A	Worker	Manisha Thakre	9420366241	N/A	Teacher	+919307622038	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
117	695	8329447785	saniyashende9875@gmail.com	saniyashende.24@stvincentngp.edu.in	saniya shende	bhandara	2006-08-15	Female	vikas shende	9373142866	saniyashende9875@gmail.com	farmer	lata shende	7350156765	saniyashende9875@gmail.com	house wife	8329447785	8329447785	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
122	384	9021503605	vanshikakhedkar89@gmail.com	vanshikakhedkar.23@stvincentngp.edu.in	N/A	26, Aashirwad nagar, near Buddha vihar, hudkeshwar road nagpur	2005-04-08	Female	Sunil Khedkar	9922090508	N/A	Government service	Vijaya Khedkar	9404084009	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
124	686	7249158331	parkhinachiket691@gmail.com	nachiketparkhi.24@stvincentngp.edu.in	http	siddharth ward ,old wani naka ,near metha hall ,warora , maharastra	2006-12-19	Male	Ajay parkhi	7875144667	ajayparkhi08@gmail.com	bissnessman	Prathibha parkhi	7249158331	parkhinachiket691@gmail.com	Housewife	Nachiket parkhi	7249158331	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
334	663	7038033151	ishanibassin@gmail.com	ishanbassin.24@stvincentngp.edu.in	https://www.linkedin.com/in/ishan-bassin-b10a39317?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Siddhtek Nagar, ITI-Ambad Link Road, Near Khutwad Nagar, Nashik	2006-07-12	Male	Inderjeet Bassin	7020046788	inderjittbassin@gmail.com	Private Sector	Amamdeep Bassin	7020085407	amandeep.bassin@gmail.com	Lecturer	Inderjeet Bassin	7020046788	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
640	1564	9356995449	ishikabhallangp16@gmail.com	ishikabhalla.22@stvincentngp.edu.in	N/A	Rh-94, Jayanti Nagri-3, New manish nagar, behind hotel pride, Nagpur, Maharashtra -440005	2003-10-03	Female	Ruchit Bhalla	9422110175	ruchitbhalla.ngp@gmail.com	Auditor	Parul Bhalla	9422473860	parulbhalla.ngp@gmail.com	Homemaker	94236 83637	7796196322	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
130	706	7350639659	khetrevedant@gmail.com	vedantkhetre.24@stvincentngp.edu.in	https://www.linkedin.com/in/vedant-khetre-783501347/	Bramhapuri, Chandrapur	2006-03-06	Male	Hemraj Khetre	7798800395	N/A	Farmer	Monali Khetre	7798800395	N/A	Housewife	Parish Khetre	9527603193	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
339	427	9022502620	navgharevab@gmail.com	vaibhavinavghare.23@stvincentngp.edu.in	N/A	House no. 21, Rose Garden, Eden Park, Gawasi, Nagpur\nPincode: 441108	2005-09-21	Female	Chandrashekhar Navghare	9130975438	N/A	-	Kalpana Navghare	9130975438	N/A	Teacher	Sampada Navghare	9921826183	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
134	677	9370458234	sherwindias038@gmail.com	sherwindias.24@stvincentngp.edu.in	https://www.linkedin.com/in/sherwin-dias-6308bb324?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	19/6 Aakar Builders,Byramji Town, Nagpur	2006-01-13	Male	Sheridan Dias	8830671758	diasvpes1234@gmail.com	None	Wilnellia Dias	8830671151	N/A	Housewife	Wilnellia  Dias	8830671151	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
138	671	7666590138	madniwaleprayukta@gamil.com	prayuktamadniwale.24@stvincentngp.edu.in	https://www.linkedin.com/in/prayukta-madniwale-11b02231b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Plot no 6 sundervan layout narendra nagar nagpur	2006-10-21	Female	mohan madniwale	9860557327	madniwale.mohan@gmail.com	clerk in Bank of baroda	harsha madniwale	8275783600	harshamadniwale@gamil.com	home maker	7666590138	9860557327	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
139	415	8669476069	sakshibondre0208@gmail.com	sakshibondre.23@stvincentngp.edu.in	https://www.linkedin.com/in/sakshi-bondre-834a93280?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Near Sai Lawn, Neharu Ward, Tumsar Road, Warthi, Dist. Bhandara, Maharashtra	2004-08-02	Female	Shivlal K. Bondre	9637888196	bondreshivlal@gmail.com	Employee (SISCO)	Kalpana S. Bondre	7719959544	kalpanabondre0710@gmail.com	Homemaker	Akansha S. Bondre	9637622353	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
340	413	8554001884	anveshmulkalwar66@gmail.com	anveshmulkalwar.23@stvincentngp.edu.in	https://www.linkedin.com/in/anvesh-mulkalwar-598453285?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Shastri ward,Gondia	2005-11-05	Male	Nitin Mulkalwar	8806209224	nitinmulkalwar@gmail.com	Private sector	Nanda Mulkalwar	8698912756	nandamulkalwar@gmail.com	Teacher	Anvesh	8554001884	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
344	400	8623099389	tanvikshirsagar2005@gmail.com	tanvikshirsagar.23@stvincentngp.edu.in	N/A	156, old subhedar layout, Ayodhya Nagar, nagpur	2005-02-18	Female	Ritesh kishirsagar	9923192888	N/A	Private service	Nilima kshirsagar	9923193888	N/A	Teacher	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
469	1388	7620098404	mayuraglawe06@gmail.com	mayuraglawe.22@stvincentngp.edu.in	N/A	At Dhamna Hudkeshwar Road , Nagpur.	2004-04-06	Male	Ajabrao Aglawe	7057416794	N/A	Farmer	Rekha Aglawe	7620889517	N/A	House Wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
95	324	7218242923	bhagyashrir2006@gmail.com	bhagyashrirahangdale.24@stvincentngp.edu.in	https://www.linkedin.com/in/bhagyashri-rahangdale-64355933b	Plot no. 105B, Near V. V. Niketan School, Wardhman Nagar, Butibori, Nagpur, 441108	2006-09-30	Female	Babanrao Rahangdale	8007601562	N/A	Worker	Meera Rahangdale	9545864453	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
208	331	9226395443	noelalgar77@gmail.com	noelalgar.24@stvincentngp.edu.in	https://www.linkedin.com/in/noel-algar-950109335?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	F type 7/3 Ordnance factory estate jawaharnagar bhandara	2006-08-10	Male	Rajesh Algar	7972526306	rajnansbi@yahoo.com	Government servant	Nancy Algar	9834173100	algarnancy72@gmail.com	House wife	Noel 2	8275431169	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
209	1438	9149655254	sahilkumarsahil401@gmail.com	sahilkumar.22@stvincentngp.edu.in	N/A	Doda,Jammu and Kashmir	2004-09-15	Male	Des Raj	8669309419	nill	Jammu and Kashmir police	Kamlesha Devi	7051676750	nill	House maker	Sahil kumar	8669309419	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
215	1407	8830353270	madhu5shende@gmail.com	madhurashende.22@stvincentngp.edu.in	madhura-shende-73ba60261	Plot No.213,Bhande plot square.\nUmred Road,Nagpur	2004-09-12	Female	Gajanan Hari Shende	9689355057	gajananshende75@gmail.com	Government Servant	Ratnamala Gajanan Shende	8999213419	ratnamalashende880@gmail.com	Home Maker	Gajanan Hari Shende	9921286905	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
116	693	8767746860	virajmohadikar5@gmail.com	virajmohadikar.24@stvincentngp.edu.in	https://www.linkedin.com/in/viraj-mohadikar-589141372?trk=contact-info	Dhangwli nagar, pipla road, nagpur	2006-03-09	Male	Manoj Mohadikar	9699819194	manojmohadikar177@gmail.com	Superviser	Nalini Mohadikar	8459460775	nalinimohadikar7@gmail.com	House wife	8767746860	8669592083	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
222	703	9209042338	janhavijoshi934@gmail.com	janhavijoshi.24@stvincentngp.edu.in	Janhavi Joshi	vitthalwadi,wani	2006-05-18	Female	Pradip Joshi	9545171713	pradipjoshi1210@gmail.com	Business	Godawari Joshi	9518577402	godawari15676@gmail.com	Housewife	Ganesh Joshi	9552926562	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
121	680	9518340404	tushar.tiple18@gmail.com	tushartiple.24@stvincentngp.edu.in	N/A	Plot No. 38 Pardhe Layout Beltarodi	2006-01-24	Male	Satish Tiple	9545547917	N/A	banking	Jyoti Tiple	9975240395	N/A	banking	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
226	320	8600293579	annepaul7890@gmail.com	rozannepaul.24@stvincentngp.edu.in	https://www.linkedin.com/in/rozanne-paul-2ba21a338?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	St. Martin nagar, jaripatka, Nagpur	2006-08-25	Female	Akash Paul	9860373917	paulakash276@gmail.com	Private Job	Isha Paul	9665436700	ishap@montfortnagpur.ac.in	Private Job	Isha Paul	9665436700	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
230	1429	9322998152	sanveekarandikar71@gmail.com	sanveekarandikar.22@stvincentngp.edu.in	linkedin.com/in/sanvee-karandikar	Plot no. 11, central excise colony, telecom nagar, Nagpur\nPlot no. 11, central excise colony, telecom nagar, Nagpur	2004-11-21	Female	Sachin Karandikar	7972242178	ssdonkarandikar@gmail.com	Employee at Airport Authority of India (AAI)	Rajshree Karandikar	9284265794	rajshreekarandikar9517@gmail.com	Homemaker	Rajshree Karandikar	9284265794	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
233	407	8261056093	prafulkharpuriya@gmail.com	prafulkharpuriya.23@stvincentngp.edu.in	N/A	At. Jolwadi, Post. Maywadi, Tah. Narkhed, Dist. Nagpur - 441305	2005-04-01	Male	Pyarelal Kharpuriye	7498962391	N/A	Teacher	Natho Kharpuriye	7498932391	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
472	1396	9511827732	parth.upadhye4@gmail.com	parthupadhye.22@stvincentngp.edu.in	https://www.linkedin.com/in/parth-upadhye	Plot no : 56, Pawanbhumi Somalwada Wardha Road Nagpur - 440025	2004-11-27	Male	Manish Upadhye	9850331357	N/A	Income tax officer	Renuka upadhye	9850129111	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
335	1352	7559118983	ritikpandey.4161@gmail.com	ritikpandey.23@stvincentngp.edu.in	N/A	72,Pavansut Nagar,, Nagpur 440024	2005-07-12	Male	MUNESH	6262540121	muneshpandey08@gmail.com	Farmer	SAVITA PANDEY	6261540121	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
259	340	9272122456	soham.kale83@gmail.com	sohamkale.24@stvincentngp.edu.in	www.linkedin.com/in/soham-kale-491a85351	Plot 50, The Paijar, 2nd floor\nSakkardara Sq, near NMC Water Tank	2006-03-08	Male	Vijay Kale	8390736459	VKale251@gmail.com	Business	Chhaya Kale	8805800606	chhaya.kale1612@gmail.com	Housewife	Sibling	8999629161	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
260	1382	7276350668	bhongadeshriddhi@gmail.com	shriddhibhongade.24d@stvincentngp.edu.in	N/A	Shastri Nagar Tumsar 441912, district bhandara	2005-09-17	Female	Umesh	7219849429	N/A	-	Sunita	7559490105	N/A	job	sunita	7559490105	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
338	441	8657774455	royalhadkens@gmail.com	royalhadke.24d@stvincentngp.edu.in	N/A	1258,Takli sim Hingna Road Nagpur	2004-12-29	Male	Vidhyadhar David Hadke	8657774455	royalthatworks@gmail.com	Service	Seema V. Hadke	8657774455	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
273	699	9209758699	satonevaishnavi68@gmail.com	vaishnavisatone.24@stvincentngp.edu.in	https://www.linkedin.com/in/vaishnavi-satone-977a94339?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	At :Warud, Post:KhanGaon ,Tal:Hinganghat,Dist:Wardha	2006-11-14	Female	Gunwanta Satone	8308204647	N/A	Farmer	Shital Satone	9028252647	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
341	1341	9112313413	radhatadas11@gmail.com	radhatadas.23@stvincentngp.edu.in	N/A	201, Devi Krupa Apartments, Manish Nagar, Nagpur - 37	2005-08-11	Female	Ashish Tadas	8208628483	ashishtadas@gmail.com	Engineer	Anumeha Tadas	7972295926	anumehatadas@gmail.com	Homemaker	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
474	1385	8552877097	naitamatharva14@gmail.com	atharvanaitam.22@stvincentngp.edu.in	https://in.linkedin.com/in/atharva-naitam-b896521b4	20, Pardhi Layout Tajeshwar Nagar near Medhekar Hospital Hudkeshwar road, Nagpur	2004-06-14	Male	Anant Naitam	9764003237	anantnaitam@gmail.com	Government Occupation	Savita Naitam	8806682424	naitamatharva14@gmail.com	Housewife	Ritik Naitam	9834828541	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
641	1565	9370596442	rajastarapure10@gmail.com	rajastarapure.22@stvincentngp.edu.in	http://linkedin.com/in/rajas-tarapure-60178125a	C-40, Manavseva Nagar Seminary Hills Nagpur	2004-09-10	Male	Rahul Tarapure	9890196005	rahul_tarapure@yahoo.com	Business	Rupa Tarapure	9096171075	rupatarapure2@gmail.com	Business	9096359900	9370596442	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
359	419	7000940877	vedika130425@gmail.com	vedikamalhotra.23@stvincentngp.edu.in	N/A	A-501 Vardhaman Skyline New rajendra nagar Raipur Chhattisgarh	2005-04-13	Female	Anand Malhotra	9589517799	anandmal@gmail.com	Business	Leena Malhotra	9755133299	leena3977@gmail.com	Housewife	Father	9589517799	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
140	329	8767330270	adiyende111@gmail.com	adityayende.24@stvincentngp.edu.in	N/A	67,new prerna nagar, new narsala road, nagpur	2006-10-31	Male	Prashant Yende	7972360458	drprashantyende@gmail.com	Assistant professor	Sonali Yende	7058736613	drsonaliyende@gmail.com	Assistant professor	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
141	650	9921975553	swara6g@gmail.com	swaranisal.24@stvincentngp.edu.in	https://www.linkedin.com/in/swara-nisal-36a5b4323?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	27/7, Ujjwal Nagar , Somalwada , Wardha Road , Nagpur 440025	2006-09-06	Female	Sandeep Nisal	9370867249	mail2sandeepnisal@gmail.com	Private	Pranjal Nisal	9579255554	npranjali7@gmail.com	Teacher	9370867249	9579255554	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
142	689	7020903172	adityachafale2006@gmail.com	adityachafale.24@stvincentngp.edu.in	N/A	Samudrapur, Wardha,Maharashtra 442305	2006-03-05	Male	Shatrughna	8668228635	N/A	Teacher	Vandana	8605138634	N/A	House maker	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
143	648	8830542186	tejasadhal93@gmail.com	tejasadhal.24@stvincentngp.edu.in	https://www.linkedin.com/in/tejas-adhal-147b07346?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Bela umrer nagpur	2005-10-09	Male	Vilas nusaji adhal	8830542186	tejasadhal93@gmail.com	Farmer	Rukhma adhal	8830542186	tejasadhal93@gmail.com	Farmer	Tejas Vilas Adhal	8830542186	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
144	1362	9730718197	adityazade355@gmail.com	adityazade.23@stvincentngp.edu.in	https://www.linkedin.com/in/aditya-zade-738105307?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	201,Vijayshree Appt., Vijayanand Society, Narendra Nagar, Nagpur	2005-02-14	Male	Rajesh Zade	9422827212	N/A	Consultant	Maya Zade	9423598425	N/A	Civil Engineer	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
210	332	8390062332	lokeshbarve0502@gmail.com	lokeshbarve.24@stvincentngp.edu.in	N/A	House no 29, Hanuman Galli, Koshtipura, Sitabuldi Nagpur 440012	2006-02-05	Male	Manoj Sukritdas Barve	8329744832	manojbarve04@gmail.com	Labour	Sarika Manoj Barve	8983724403	sarikabarve1981@gmail.com	Housewife	8390062332	8983724403	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
309	321	9922738676	ayushahale312006@gmail.com	ayushahale.24@stvincentngp.edu.in	https://www.linkedin.com/in/ayush-ahale-44ba09334?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	D4,Keshav Madhav Nagar,Near Krishna Dairy Jaitala road Nagpur	2006-03-31	Male	Sachin Ahale	9423183697	sachinahale76@gmail.com	Business	Swati Ahale	9689082730	swatiahale@gmail.com	Accountant	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
147	1364	9624525414	aditya.ngp2005@gmail.com	adityanagpurkar.23@stvincentngp.edu.in	https://www.linkedin.com/in/aditya-nagpurkar-7b3772281?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app	Plot no. 21, Narendra Nagar, Beside Safalya Heritage 7, Venuwan Society, Nagpur MH 440015	2005-03-14	Male	Mahesh Nagpurkar	9979701685	nagpurkar7@gmail.com	Central Government Official	Latika Nagpurkar	9586831085	lmnagpurkar80@gmail.com	Home maker	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
227	708	7972214154	shenderohini19@gmail.com	rohinishende.24@stvincentngp.edu.in	N/A	Chandrapur	2006-09-25	Female	Prakash Shende	8308801718	N/A	Worker	Ranjita Shende	8805093975	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
310	1359	9404014986	yugakale2005@gmail.com	yugakale.23@stvincentngp.edu.in	https://www.linkedin.com/in/yuga-kale-613189324?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Rukhmini Nagar Khat Road Bhandara	2005-03-04	Female	Nilaram Kale	0000000000	o@m.c	..	Rajani Kale	7972625418	kalerajani61@gmail.com	Farmer	Damodhar Lute	9049900401	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
234	649	7225942964	navajotmishra80@gmail.com	navajotmishra.24@stvincentngp.edu.in	N/A	Near Sai mandir Prem nagar balaghat (M.P)	2006-09-25	Female	Yankesh Mishra	9424614877	ynkesh1812@gmail.com	Lecturer at govt school	Sarika Mishra	8982842964	sarikamishra@gmail.com	House wife	Navtez Mishra	7879969596	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
473	1328	9371561454	bokdebhumika15@gmail.com	bhumikabokde.23@stvincentngp.edu.in	https://www.linkedin.com/in/bhumika-bokde-a40475353?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Shankar nagar, dharam peth	2004-04-11	Female	Jagannath Bokde	8668550429	shubhabeautyparlour@gmail.com	St. Mahamadal tc	Manjusha Bokde	8600609848	shubhabeautyparlour@gmail.com	House wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
475	402	9763331264	chatapmitali@gmail.com	mitalichatap.23@stvincentngp.edu.in	https://www.linkedin.com/in/mitali-chatap-388042283?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Plot no. 121 Block B, Ramna Maruti Nagar, Near Sakhore Complex, Nagpur	2005-01-27	Female	Vinod M. Chatap	9767201377	mitalichatap22@gmail.com	Government Servant	Drakshayani V. Chatap	9960798620	chatapmitali@gmail.com	House wife	9960798620	9960798620	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
477	1392	7397993459	shashwatlautawar009@gmail.com	shashwatlautawar.22@stvincentngp.edu.in	https://www.linkedin.com/in/shashwat-lautawar-a4b283278/	Sharda Square Katol	2003-06-25	Male	Chandu Lautawar	9890539921	N/A	Site Supervision	Arti Lautawar	9657330901	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
325	1329	9970636857	krutikathakur1114@gmail.com	krutikathakur.23@stvincentngp.edu.in	N/A	4, Shri Ram square, indra nagar, new narsala road, Nagpur	2004-11-01	Female	Rajendra Thakur	7378898606	rajendrathakkur0@gmail.com	Private job	Bhavika Thakur	7218820686	bhavikathakur510@gmail.com	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
352	385	9356884826	sanketkadhao6@gmail.com	SANKETKADHAO.23@stvincentngp.edu.in	N/A	Kdk college road ,Galli no 13 ,near shiv mandir , Nandanvan Nagpur	2005-06-07	Male	Murlidhar kadhao	8275530689	N/A	Central gov servent	Sarita kadhao	7887947990	N/A	House wife	Murlidhar kadhao	8275530689	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
266	1535	9673625096	pratikshaghate03@gmail.com	pratikshaghate.22@stvincentngp.edu.in	https://www.linkedin.com/in/pratiksha-ghate-81752135b	Dhume Nagar Near Hanuman Mandir Wani pin code	2004-03-23	Female	Raju Ghate	9922195704	rajughate992@gmail.com	Farmer	Archana Ghate	9604097915	archanaghate607@gmail.com	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
268	416	9371459603	vidhimenghare0305@gmail.com	vidhimenghare.23@stvincentngp.edu.in	N/A	somalwada wardha road tirupati layout, H	2005-05-03	Female	Pravin Menghare	9881662583	N/A	-	Surekha Menghare	8378033270	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
357	1366	8010483418	preyashchandurkar19@gmail.com	preyashchandurkar.23@stvincentngp.edu.in	https://www.linkedin.com/in/preyash-chandurkar-b7312a282?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Near Sadawarti Mandir,Jogithana Peth Umred	2004-07-19	Male	Premraj Chandurkar	9767714452	premchandurkar1@gmail.com	Teacher	Chitralekha	9028236661	chitralekhachandurkarumred@gmail.com	Teacher	9767714452	9028236661	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
362	1373	8208049171	sharwariwadalkar@gmail.com	sharwariwadalkar.23@stvincentngp.edu.in	https://www.linkedin.com/in/sharwari-wadalkar-6a423532a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	862, Shaniwari, Immamwada road , Cotton Market, Nagpur - 440018	2005-06-04	Female	Sudhir Wadalkar	9822573690	sudhirwadalkar@gmail.com	Business	Manali Wadalkar	9130003624	manaliwadalkar@gmail.com	House Wife	Sudhir Wadalkar	9822573690	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
375	323	9356968970	vidhikathakre611@gmail.com	Vidhikathakre.24@stvincentngp.edu.in	N/A	1,Mitra Nagar,Manewada Road,Nagpur	2006-05-28	Female	Sachin Thakre	9356968970	yogitathakre849@gmail.com	Private job	Yogita Thakre	9356968970	yogitathakre849@gmail.com	Private job	8390409648	8390409648	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
384	375	9970870920	mudeindrayani5@gmail.com	indrayanimude.23@stvincentngp.edu.in	N/A	MIG-9, 2nd floor, Sundervan Layout, near Container Depot, Narendra Nagar, Nagpur - 440015	2005-07-14	Female	Prashant Mude	9372610987	N/A	NIL	Manali Mude	9372610987	manali.mude75@gmail.com	Advocate	Manali Mude	9372610987	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
392	1416	7350490113	bamanpalliwarsayali@gmail.com	sayalibamanpalliwar.22@stvincentngp.edu.in	https://www.linkedin.com/in/connectsayali/	dattatray nagar	2004-07-08	Female	Sanjay Bamanpalliwar	9657673337	N/A	Teacher	Smita Jawajwar	8999298301	N/A	Teacher	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
478	1432	8210359949	gouribiswas011@gmail.com	gouribiswas.22@stvincentngp.edu.in	https://www.linkedin.com/in/gouri-biswas-5b0503298/	H.No-01, Zone No-9, House no.1, Birsanagar, Jamshedpur -831004	2003-10-01	Female	Pratyush Kumar Biswas	7488332665	pratyushbiswas69@gmail.com	Service	Soma Biswas	8340700397	somabiswas1677@gmail.com	House Wife	8340700397	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
502	1554	9518376709	mruduldehankar@gmail.com	mruduldehankar.22@stvincentngp.edu.in	https://www.linkedin.com/in/mrudul-dehankar-1b31342b7?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	16, Dream Residency,Gawande layout, Sneha nagar , Nagpur 440015	2004-03-17	Female	Vilas Dehankar	7767033118	vilas.dehankar@rediffmail.com	Retired	Archana Dehankar	9422807628	N/A	Teaching	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
647	1423	7020791794	darshanbutle@gmail.com	darshanbutle.22@stvincentngp.edu.in	Darshan Butle	Plot no. '80', Swaroop Nagar,Nagpur.	2004-08-04	Male	Raju Butle	9923441523	N/A	Advocate	Suvarna Butle	9420145744	N/A	Teacher	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
421	393	8600777010	shawngregory040@gmail.com	shawngregory.23@stvincentngp.edu.in	N/A	Plot no 71 Natraj cooperative housing society, Utthan Nagar gorewada road Nagpur	2005-07-26	Male	Stanley Gregory	9890407896	stanleysir68@gmail.com	Teacher	Elizabeth	7507542992	elizabethgregory0207@gmail.com	Teacher	Shawn gregory	8600777010	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
649	1536	8767953733	ingleg377@gmail.com	gauravingle.22@stvincentngp.edu.in	N/A	1406, New Nandanvan , Nagpur	2004-09-25	Male	Rajesh Ingle	8275368974	N/A	Service	Sushma Ingle	8275368974	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
653	1431	7499397597	gargipgundawar@gmail.com	gargigundawar.22@stvincentngp.edu.in	http://linkedin.com/in/gargi-gundawar-376437291	satyam Villa plot no. 10 Navneet soc. Narendra Nagar Napgur , 440015	2004-07-07	Female	Pravin Gundawar	9923179292	gundawar.pravin@gmail.com	Solution Architect (Project Manager)	Sonali Gundawar	9823371345	sonaligundawar@gmail.com	Housewife	Pravin Gundawar	9923179292	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
525	1348	9699958251	parulgaurkar02@gmail.com	parulgaurkar.23@stvincentngp.edu.in	N/A	35, Laxmi Nagar, Wadgaon Road, Chandrapur	2005-06-02	Female	Prakash Gaurkar	8149871305	prakash.sg.chn@gmail.com	Teacher	Asmita Gaurkar	9890134034	asmita_prakash@rediffmail.com	House maker	Gauri Yergude	9960556354	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
552	682	9699271014	sujalgaikwad070@gmail.com	sujalgaikwad.24@stvincentngp.edu.in	https://www.linkedin.com/in/sujal-gaikwad-02a78333a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	74 Prabhat Nagar Narsala	2005-09-13	Male	Shantaram Gaikwad	9665898570	sahantaram181@gmail.com	Taxy dirver	Seema Gaikwad	9665898570	sahantaram181@gmail.com	house wife	9665898570	9172837228	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
554	657	9970241680	athravasonone7@gmail.com	atharvasonone.24@stvincentngp.edu.in	https://www.linkedin.com/in/atharva-sonone-b3081336a	Plot no 44 zingabai Takli kale layout Godhani road Nagpur	2006-03-06	Male	Rajesh Sonone	9970241680	N/A	Supervisor	Usha Sonone	9970241680	Uashsonone@gmail.com	House wife	Atharva Sonone	9970241680	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
556	333	8788546384	swadhin457@gmail.com	swadhinupadhyay.24@stvincentngp.edu.in	https://www.linkedin.com/in/swadhin-upadhyay-9728a8303/	Plot No. 48, Suraj Nagar\nbehind Pallotti School\nNagpur,440013.	2005-11-09	Male	Vishwanath Upadhyay	8830991622	vish1812@gmail.com	Private Job	Arahana Upadhyay	9422438669	aradhanau15@gmail.com	Social Worker	8830991622	9637260950	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
739	982	9309320554	rimanshusonule00@gmail.com	rimanshusonule.22@stvincentngp.edu.in	N/A	Manewada Shahu Nagar Nagpur\n249/B	2004-09-27	Male	Prashant Sonule	9850336299	N/A	Businessman	Priti Sonule	9356615832	N/A	Housewife	Prashant Sonule	9850336299	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
574	1379	8459682245	tanushreewanjari2005@gmail.com	tanushreewanjari.24d@stvincentngp.edu.in	www.linkedin.com/in/tanushree-wanjari-90b7b337b	Mahada colony , MIDC . Butibori , Nagpur	2005-08-12	Female	Raju Wanjari	7744005813	rajuwanjari@gmail.com	RTO	Rashmi Wanjari	8007608045	rashmiwanjari56@gmail.com	Housewife	Tanmay Wanjari	7559494791	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
748	1546	8956548357	sprasad8956@gmail.com	sumitprasad.22@stvincentngp.edu.in	https://www.linkedin.com/in/sumit-prasad-179612262	Amba-Shivshakti Nagar, Manewada, Besa Road, Nagpur	2004-05-01	Male	Ramashankar Prasad	8080768593	sprasad8956@gmail.com	Government Servant	Sunaina Prasad	8080768593	sprasad8956@gmail.com	Housewife	Sumit	8956548357	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
650	371	7385699914	tanushreedes1206@gmail.com	tanushreedeshpande.24@stvincentngp.edu.in	https://www.linkedin.com/in/tanushree-deshpande-677369319?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Revati nagar, Besa, Nagpur	2006-12-17	Female	Shriram Deshpande	9552597344	N/A	Service	Anagha Deshpande	9922730886	N/A	House wife	9552597344	9922730886	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
651	1338	9370325802	pathakamod785@gmail.com	amodpathak.23@stvincentngp.edu.in	https://www.linkedin.com/in/amod-pathak-7077b12a7?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	" Swapnapurti ", Near Yogiraj Bakery,  Jambharun Road, Buldhana - 443001	2004-12-02	Male	Sachin Pathak	9922183689	.	Service	Deepali Pathak	9823070370	.	Housewife	Amod pathak	9370325802	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
388	412	9822200441	kshitijkdeshmukh@gmail.com	kshitijdeshmukh.23@stvincentngp.edu.in	https://www.linkedin.com/in/kshitij-deshmukh-21a09b280?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Plot no 3 Nalode Layout Gopal Nagar Nagpur 440022	2005-10-24	Male	Kalpesh Deshmukh	9423103879	kalpeshdeshmukh73@gmail.com	Buisness	Arati Deshmukh	9822200865	aratikdeshmukh@gmail.com	Housewife	Kalpesh Deshmukh	9822200865	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
390	392	9420186287	kencherian16@gmail.com	kencheran.23@stvincentngp.edu.in	https://www.linkedin.com/in/ken-cherian-661899286	Plot no.26, Ramkrishna Nagar, Gorewada Road, Nagpur, 440013	2005-04-19	Male	Cherian Mathai	8983729791	cherianmathai73@gmail.com	Government Service	Bindu Cherian	7264801135	binducherian156@gmail.com	Teacher	Kelvin Cherian	9172482520	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
657	1518	9325217943	meghashahare12@gmail.com	meghashahare.22@stvincentngp.edu.in	https://www.linkedin.com/in/megha-shahare-981377369	At Gohalli ,Po. Thutanbori ,Tah. Bhiwapur, Dist Nagpur.	2003-03-17	Female	Harichandra Shahare	8767323348	meghashahare13@gmail.com	Round Officer (Forest Department)	Rukhmini Shahare	9325217943	rukhminishahare@gmail.com	Housewife	9325217943	9325217943	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
398	1406	9767398012	sarangdandekar420@gmail.com	sarangdandekar.22@stvincentngp.edu.in	https://www.linkedin.com/in/sarang-dandekar?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	At. Waigaon haldya Ta. Samudrapur Dist. Wardha	2004-04-11	Male	Vilas Dandekar	8830853026	N/A	Farmer	Suchita Vilas Dandekar	7821832531	N/A	Housewife	7822834229	9067118525	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
503	1408	9325741699	paritoshmagare@gmail.com	paritoshmagare.22@stvincentngp.edu.in	N/A	58, Aradhana Appt., Sundervan Layout, Narendra Nagar, Nagpur - 440015	2004-04-04	Male	Mahesh Magare	7249045485	maheshmagare02@gmail.com	Accountant	Maithili Magare	8600778071	kaclassesnagpur4@gmail.com	Financial Advisor	Maithili Magare	9175778071	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
661	1528	9096195570	timothyshandy28@gmail.com	timothishandy.22@stvincentngp.edu.in	https://www.linkedin.com/in/timothy-shandy-146273305?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	APJ Abdul Kalam Chowk,Warora	2004-05-28	Male	Pranil Shandy	9096195570	timothyshandy28@gmail.com	Labour	Mary shandy	9730706392	timothyshandy28@gmail.com	House wife	9730706392	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
533	1368	7666809984	vishweshpatil2110@gmail.com	vishweshpatil.23@stvincentngp.edu.in	N/A	Plot no. 69 shree nagar\nNear Narendra Nagar ring road	2005-10-21	Male	Suhas Patil	9850582919	suhaspatil70@gmail.com	Self occupied	Sheetal Patil	9421111691	sheetalspatil22@gmail.com	Self occupied	Vishwesh Patil	7666809984	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
433	1414	8010585283	rutuja.tambolin@gmail.com	rutujatamboli.22@stvincentngp.edu.in	www.linkedin.com/in/rutuja-tamboli-/	219, Sahakar Nagar , khamla road , Nagpur	2004-06-27	Female	Nilesh Tamboli	9970781117	aryan.tambolin@gmail.com	Engineer	Swati Tamboli	9511871203	aryan.tambolin@gmail.com	Pharmacist	RUTUJA NILESH TAMBOLI	8010585283	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
435	1387	9322533960	parthnageshdange@gmail.com	parthdange22@stvincentngp.edu.in	https://www.linkedin.com/in/parth-dange-978087293/	138 , smruti nagar, koardi raod, near anganwadi 441111	2004-05-31	Male	Nagorao Shamrao Dange	9325265500	parthdange680@gmail.com	Business	Shilpa Nagorao Dange	9588414908	parthdange680@gmail.com	Housewife	Parth Nagorao Dange	9322533960	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
755	1544	9630848668	pranjalkothekar@gmail.com	pranjalkothekar.22@stvincentngp.edu.in	N/A	Plot no. 32 Dhangawri nagar, Nagpur	2002-05-30	Female	Sanjay kothekar	8208165317	smkothekar@gmail.com	Private job	Lata kothekar	8554968553	latakothekar@gmail.com	Housewife	Pranjal sanjay kothekar	8208165317	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
756	431	8625033356	sanyujaskuwar@gmail.com	sanyujasonkuwar.23@stvincentngp.edu.in	N/A	12, Saileela Appartment Deepali nagar Nashik-422009 Maharashtra	2005-07-19	Female	Rajesh Sonkuwar	8425875656	N/A	Bank manager	Vidya Sonkuwar	9422148176	N/A	Housewife	Anaya Sonkuwar	8793244825	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
560	1548	8956358340	ubhoyar12@gmail.com	udaybhoyar.22@stvincentngp.edu.in	N/A	206/k block\nNandanvan behind kdk college	2004-11-26	Male	Suraj	9763228340	N/A	Business	Anjali	9604455003	N/A	Home Maker	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
561	1574	9356570214	vaibhavvdy@gmail.com	vaibhavvaidya.23d@stvincentngp.edu.in	linkedin.com/in/vaibhav-vaidya-a2a466301	At. Dawdipar Post-Bela, th+dist : Bhandara,  Maharashtra,  441906	2002-09-28	Male	Balkrushna	7741978040	vaibhavvdy@gmail.com	farmer	Nalu	7741978040	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
762	1356	9156003791	akshitkamble21@gmail.com	akshitkamble.23@stvincentngp.edu.in	N/A	N/A	2005-07-21	Male	PRASHANT	9156003791	N/A	Bank Officer	MAMATA	9156003791	N/A	House wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
769	1530	7798752157	chaudhariyogesh1910@gmail.com	yogeshvarchaudhari.22@stvincentngp.edu.in	https://www.linkedin.com/in/yogeshvar-chaudhari-897438263?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	At. Post Kajali Ta. Karanja Di. Wardha	2002-10-19	Male	Ramdas	7798752157	chaudhariyogesh1910@gmail.com	Farmer	Manda	7798752157	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
784	417	8669959339	lonkarparth2004@gmail.com	parthlonkar.23@stvincentngp.edu.in	N/A	273, vrundavan apartment near water tank laxmi nagar nagpur	2004-11-06	Male	Mukul Lonkar	8055649339	N/A	Bcom graduation	Pranjali Lonkar	9021334906	N/A	Bcom graduation	Pranjali lonkar	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
786	411	9146317998	darshanharidasgadekar1@gmail.com	darshangadekar.23@stvincentngp.edu.in	N/A	Near Sarnath Buddha Vihar, Bhamti, Jay Durga Colony, Trimurti Nagar , Nagpur	2005-09-18	Male	Haridas Gadekar	9763343534	N/A	Private Job	Devla Gadekar	9921624926	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
790	1324	7447287716	dhawasmanthan05@gmail.com	manthandhawas.23@stvincentngp.edu.in	www.linkedin.com/in/manthan-dhawas	Ekvira Colony , Datala road , Chandrapur - 442401	2005-10-09	Male	Nagoba Nanaji Dhawas	8806502982	nagobad33@gmail.com	Farmer	Nanda Nagoba Dhawas	8805363473	dhawasmanthan@gmail.com	Housewife	Mrunal Dhawas	8847702219	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
795	1335	7972716884	munurwankhede@gmail.com	prashansawnakhede.23@stvincentngp.edu.in	None	48,49, jaigirudev nagar near omkar nagar ,manewada ring road , nagpur	2006-01-05	Female	Prabhudas Wankhede	9970703781	_	Businessman	Mercy Wankhede	9130130164	mercyprabhu73@gmail.com	House Wife	7972716884	9130130164	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
387	1351	8767625047	mayankbalpande23@gmail.com	mayankbalpande.23@stvincentngp.edu.in	N/A	plot 9 mangaldeep nagar2,besa road,manewada,nagpur-27	2005-11-23	Male	Prashant Balpande	7776050817	prashantbalpande1@gmail.com	Agri-Consultant	Ranjana Balpande	9307390585	ranjanabalpande26@gmail.com	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
397	1444	9356470379	shreyashwadi@gmail.com	shreyashwadibhasme.23d@stvincentngp.edu.in	https://www.linkedin.com/in/shreyash-wadibhasme-34a2942a7	At.Paraswada Post.Dewhadi Tah.Tumsar, Dist. Bhandara Maharashtra 441913	2002-11-22	Male	Ramratan Wadibhasme	8806683188	shreyashwadi22@gmail.com	Farmar	Usha Wadibhasme	8806683188	shreyashwadi22@gmail.com	Housewife	Shreyash Ramratan Wadibhasme	9356470379	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
485	1421	9699284532	nevinsuniloommen@gmail.com	nevinoommen.22@stvincentngp.edu.in	www.linkedin.com/in/nevin-sunil-oommen-a4963b2b5	AIIMS type 4 quarters Mihan Nagpur Maharastra	2004-03-12	Male	Sunil Oommen	9820402425	nevinsuniloommen@gmail.com	self employed	sushma oommen	9930911737	nevinsuniloommen@gmail.com	Associate professor	Atharva bhede	8956313827	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
411	396	7498296597	SUKHADEVEANOSH@GMAIL.COM	anoshsukhadeve.23@stvincentngp.edu.in	N/A	Mission India Theological Seminary,Khadgaon,Wadi,Nagpur	2004-12-15	Male	Satish	9860853443	ssukhadevecbtt@gmail.com	Professor	Karuna	8788720392	karunasukhadeve1@gmail.com	Librarian	Anosh Sukhadeve	7498296597	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
413	1361	8600996670	abhyudayaaware2005@gmail.com	abhyudayaaware.23@stvincentngp.edu.in	N/A	Plot 129,Yashraj Appartment opposite viveka hospitals,nelco society trimurti nagar,subhash nagar nagpur	2005-11-11	Male	Hemant Aware	9422111675	N/A	Government service	Manjusha Aware	9975498175	N/A	Teacher	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
492	1377	9322429336	tmeshram195@gmail.com	tanmaymeshram.23@stvincentngp.edu.in	N/A	Panchyanshi plot area , plot no. 63, near career path institute nagpur	2005-11-02	Male	Narendra Meshram	9834121864	N/A	Job	Kavita Meshram	9049751420	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
654	1559	9354353039	edwintojo@gmail.com	edwinjoseph.22@stvincentngp.edu.in	https://www.linkedin.com/in/edwin-t-joseph/	House No.157, Second Floor, Indraprastha Colony, Sector 30/33, Faridabad, Haryana 121003	2004-04-08	Male	Tojy K Joseph	9599108779	tojokuzhuppallil@gmail.com	Business	Minimol Tojy	9818098779	N/A	Nurse	Felix T Joseph	7306480953	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
424	1435	8830820175	srivastavasajal075@gmail.com	sajalsrivastava.22@stvincentngp.edu.in	N/A	Plot no. 39, Nasemon Co-housing Society, Smurti Nagar, Koradi Road, Nagpur, Maharashtra-441111	2004-04-16	Male	Alok Kumar Srivastava	7757066259	N/A	Government Servant	Ruchi Srivastava	8329368480	N/A	Homemaker	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
506	1441	7058853840	rohaningle7058@gmail.com	rohaningle.23d@stvincentngp.edu.in	https://www.linkedin.com/in/rohan1023l?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	At. Post Sangrampur Tq. Sangrampur Dist. Buldhana - 444202	2005-01-07	Male	Kailas Dayaram Ingle	9763179948	kailasingle9763@gmail.com	Farmer	Nalini Kailas Ingle	9763179948	N/A	House Wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
434	445	8848438994	samchackor@gmail.com	samruby.22@stvincentngp.edu.in	https://www.linkedin.com/me?trk=p_mwlite_feed-secondary_nav	Ivadasserill(H), Deepa Junction, Muttar PO, Alappuzha, 689574, Kerala.	2003-11-15	Male	Ruby IC	95674 16716	icruby170@gmail.com	Retired	Leena Thomas	9961452989	leenaruby@gmail.com	Retired	Joseph Antony	98714 56021	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
658	1539	9665466621	Lakshikhar14@gmail.com	Lakshikhar.22@stvincentngp.edu.in	https://www.linkedin.com/in/laksh-ikhar-630104263?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	E-136,New madha colony,wardha\nwardha	2003-09-14	Male	Vinay ikhar	9881369080	N/A	Teacher	sushma ikhar	7219470671	N/A	housewife	laksh ikhar	9665466621	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
659	1521	7887781220	vedantiwandhare2@gmail.com	vedantiwandhare.22@stvincentngp.edu.in	N/A	At post Chunala,manigarh ,Rajura, dist. chandrapur	2004-10-17	Female	Dipak Wandhare	9527256792	N/A	farmer	Vandana Wandhare	8007586505	N/A	Teacher(Anganwadi)	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
662	1534	9322866983	umredkarharsh49@gmail.com	harshwanjari.22@stvincentngp.edu.in	www.linkedin.com/in/harsh-umredkar	Plot No. 59 Vishwas Nagar jaripatka police station nara road nagpur	2004-09-06	Male	Tukaram Govinda Umredkar	8007840886	N/A	labour	Satyabhama Tukaram Umredkar	7020201430	N/A	ladies tailor	Nikhil Tukaram Umredkar	8788591056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
757	701	9766490848	chetangaiwad0801@gmail.com	chetangaikwad.24@stvincentngp.edu.in	N/A	Datta Mandir Road\nBoldha	2006-01-08	Male	vasant gaikwad	9511796050	vasantchetan1@gmail.com	farmer	alka gaikwad	9527270245	vasantchetan1@gmail.com	house wife	9421732996	9766490848	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
532	1333	9325651747	terencejoseph618@gmail.com	terencejoseph.23@stvincentngp.edu.in	N/A	Behind dindhaw factory gittikhadan Nagpur	2006-01-23	Male	James Joseph	8329593494	jamessir937@gmail.com	Teacher	Juliet joseph	9325651747	N/A	House wife	9325651757	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
779	316	7879635534	ishurajekka75@gmail.com	ishuekka.24@stvincentngp.edu.in	N/A	TNPS boys hostel gavsi manapur , wardha road , nagpur	2005-03-16	Male	ZACHARIAS EKKA	9406440260	N/A	Government service	Prasan ekka	9171327572	N/A	Government service	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
783	444	8010249114	anugrahkasbe005@gmail.com	anugrahakasbe.22@stvincentngp.edu.in	linkedin.com/in/anugraha-kasbe-9ab887263	Plot 67,68, Dnyneshwar layout, Dattawadi, Amravati Road, Nagpur	2003-12-16	Male	Pravin Kasbe	9422496439	pravinkasbe123@gmail.com	Private Job	Sarita Kasbe	8999562807	saritakasbe000@gmail.com	Housewife	8010249114	8261852812	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
542	655	8767067497	pr203735@gmail.com	pavanrathod.24@stvincentngp.edu.in	https://www.linkedin.com/in/pavan-rathod-a26b72383	at post shilona, tq pusad dist yavatmal	2006-08-29	Male	Namdev chimnaji rathod	9881899039	pr203735@gmail.com	Farming	Chhaya	8767067497	N/A	Farming	Sanjay	9921370955	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
785	983	8459863418	navinchollangi1234@gmail.com	Navincholangi.22@stvincentngp.edu.in	N/A	At-Kodamendhi tk-mauda dist-nagpur Maharashtra 441106	2004-02-03	Male	Jeevandas	8329797118	N/A	Farmer	Swartha	95791 84798	N/A	House wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
791	1342	7219399721	anujselokar7@gmail.com	harshadselokar.23@stvincentngp.edu.in	https://www.linkedin.com/in/harshad-selokar-9a68aa287	Tilak nagar, Bramhapuri-441206	2004-05-25	Male	Vijay Selokar	9423515012	vijay28selo@gmail.com	Business	Harsha Selokar	9370826098	harshaselokar80@gmail.com	Housewife	Anchal Selokar	9168676712	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
389	389	7387310958	adolphpeter444@gmail.com	peternicholas.23@stvincentngp.edu.in	https://www.linkedin.com/in/adolph-peter-08a2b7310?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app	202, Vidarbha Premier Society Building no 3, Lodhipura, Nagpur - 440002	2005-01-14	Male	Nicholas Peter	9423683330	nicholasapeter@gmail.com	Businessman	Lata Nicholas Peter	7378666012	latapeter63@gmail.com	Homemaker	Angel Peter	8530598368	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
394	1583	7972835378	aryanaryankale969@gmail.com	aryankale.23@stvincentngp.edu.in	.	Manish nagar plot no. 104 jaidurga society no.3 Nagpur	2005-09-17	Male	Rajendra Kale	9403015619	rajendrakale26101966@gmail.com	Lecturer	Aruna Kale	9307618813	.	House wife	7972835378	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
655	1520	9112990687	piyushbutle30@gmail.com	Piyushbutle.22@stvincentngp.edu.in	https://www.linkedin.com/in/piyush-butle-3a6b3a262	Near Bank of India Kothari Ward No 2 Kothari	2004-05-30	Male	Shridhar Butle	9764890687	piyushbutle30@gmail.com	Farmer	Harsha Butle	7798473205	harshabutle@gmail.com	Housewife	7745822142	7798473205	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
406	1411	7558521104	khushichoudhari2004@gmail.com	khushichoudhari.22@stvincentngp.edu.in	https://www.linkedin.com/in/khushi-choudhari-84b75525a	near hanuman mandir, amrai ward, Rajura ,Chandrapur	2004-10-21	Female	Shedanand Choudhari	7875313412	kaushalc7houdhari@gmail.com	Shopkeeper	Geeta Choudhari	9146203652	kaushalc7houdhari@gmail.com	Housewife	9689955943	9689955943	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
409	1403	8080772798	sanikaumredkar77@gmail.com	sanikaumredkar.22@stvincentngp.edu.in	https://www.linkedin.com/in/sanika-umredkar-2aa80a32a	42 sai nagr 1 hudkeshwar road nagpur	2004-04-11	Female	Ramkrushna Umredkar	9823616029	sanikaumredkar77@gmail.com	Private Job	Ratanamala umredkar	9823326931	sanikaumredkar77@gmail.com	Home Maker	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
412	1391	9960934410	himanshuhiwanj@gmail.com	himanshuhiwanj.22@stvincentngp.edu.in	https://www.linkedin.com/in/himanshu-hiwanj-530a31250/	Plot no 9, Shyam Nagar, Hudkeshwar Road, Nagpur	2003-10-26	Male	Vilas Hiwanj	9145004404	vilashiwanj15@gmail.com	Worker	Vaishali Hiwanj	7498345739	vaishalihiwanj@gmail.com	House Wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
490	1350	7758975184	kadugunjan6@gmail.com	gunjankadu.23@stvincentngp.edu.in	https://www.linkedin.com/in/gunjan-kadu-a318a2344?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app	Trimurti nagar ,wardha	2005-07-23	Male	Vilas kadu	8788970441	vkadu@gmail.com	Govt servant	Vijaya kadu	7507503295	vijayakadu@gamil.com	Housewife	7758975184	7758975184	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
656	1415	9309728338	nakularmarkar99@gmail.com	nakularmarkar.22@stvincentngp.edu.in	N/A	Narkhed	2004-05-06	Male	Bharat Armarkar	9226882880	N/A	Buisnessman	Manisha Armarkar	7499112662	N/A	Corporator	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
422	1390	7798738305	wandharekunal587@gmail.com	kunalwandhare.22@stvincentngp.edu.in	https://www.linkedin.com/in/kunal-wandhare/	25. Suryoday Nagar, near panchamukhi hanuman mandir ,New narsala road, Rajapeth , Nagpur -440034	2005-06-07	Male	Ashok	9765780627	kunalwandhare91@gmail.com	Carpentar	Pooja	8329490261	kunalwandhare91@gmail.com	housewife	Harshad	7798738305	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
660	1538	7410128253	bhujadeaditya28@gmail.com	adityabhujade.22@stvincentngp.edu.in	www.linkedin.com/in/aditya-bhujade1028	334, Bhole Baba Nagar,Uday Nagar Square, Nagpur.	2004-10-28	Male	Ramkrushna Bhujade	9225218715	bhujaderamkrushna@gmail.com	Business	Prameela Bhujade	7083623474	prameelabhujade@gmail.com	Homemaker	9225218715	7083623474	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
663	1553	7058413375	vaishalimagarde09@gmail.com	vaishalimagarde.22@stvincentngp.edu.in	N/A	I front of Gujrat tiles showroom,betul Bazar, badora	2003-09-21	Female	Harishankar magarde	9604245560	N/A	Retired	Vandana magarde	9421814589	N/A	House wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
518	1560	9923345451	aayushiasole04@gmail.com	aayushiasole.22@stvincentngp.edu.in	https://www.linkedin.com/in/aayushi-asole-376b56289/	404,parijat apartment, near sai mandir vikas nagar wardha road, Nagpur-440015	2004-09-06	Female	Jayant Asole	9860328470	jayantasole06@gmail.com	Mechanical Engineer	Rupali Asole	7775033876	asolerupali22@gmail.com	Homemaker	Rupali Asole	7775033876	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
763	424	9693946828	ayushjaiswal12123@gmail.com	ayusjaiswal.23@stvincentngp.edu.in	N/A	Jabra, Bounsi, Banka, Bihar, pin-813104	2005-04-12	Male	Pankaj Kumar Choudhary	9431190197	N/A	Buisness	Arti Devi	62078 29914	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
764	408	9403470343	krishgokhale01@gmail.com	krishgokhale.23@stvincentngp.edu.in	N/A	17, Sant Yemaji Colony, Darvhekar Dangal, Tandapeth, Nagpur - 440017	2005-10-23	Male	PRAKASH SHANKAR GOKHALE	9371457812	N/A	Service	AARTI PRAKASH GOKHALE	9021110615	N/A	Service	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
531	1424	9325235973	rudraasati2004@gmail.com	rudrakshaasati.22@stvincentngp.edu.in	https://www.linkedin.com/in/rudraksha-asati-894805279/	Near Snehal Takies, Station road, Tirora	2004-03-27	Male	Krushnakumar Asati	9325235973	N/A	Business	Chhaya Asati	9922099120	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
564	317	8793716570	adityavir96@gmail.com	bhaveshghubde.24@stvincentngp.edu.in	N/A	42-Anand nagar khat road bhandara	2006-05-16	Male	Arun ghubde	9403582588	N/A	Farmer	Sushma ghubde	9561522797	N/A	HOUSEWIFE	Anushka	8983094146	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
781	685	8530922997	mungalvedanshu@gmail.com	vedanshumungal.24@stvincentngp.edu.in	N/A	Satyam Garden Tulip 408 Godhni Road Nagar Maharashtra	2006-01-11	Male	Prashant Ramraoji Mungal	9168232453	prashantmungal@gmail.com	Technician MSEB	Vijayshree Prashant Mungal	8605242737	vijayshreev@gmail.com	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
792	1374	7276248558	ananyarajurkar10@gmail.com	ananyarajurkar.23@stvincentngp.edu.in	https://www.linkedin.com/in/ananya-rajurkar-a5aa502b7?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app	11, “Shivneri”, Prasad Colony, Ambika Nagar, Amravati-444606	2005-10-11	Female	Niraj V. Rajurkar	9881904434	nirajrajurkar1975@gmail.com	Business	Yogita N. Rajurkar	9405424762	ryogita04@gmail.com	Associate Professor	9881904434	9405424762	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
567	1545	8149625031	shreyaborde17@gmail.com	shreyaborde.22@stvincentngp.edu.in	https://www.linkedin.com/in/shreya-borde-4b8a52265/	At post Q haram achalpur district amravati 444806\nAt post Q haram achalpur district amravati 444806	2004-09-27	Female	Ravindra Borde	9923367531	raviborde50@gmail.com	Farmer	Seema borde	9096666438	rajborde07@gmail.com	Housewife	Ravindra Borde	9923367531	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
794	1326	9970216695	sohamakre2005@gmail.com	sohamakre.23@stvincentngp.edu.in	N/A	behind honda showroom , beside nakade nursing home , shikshak colony , takiya ward , bhandara , maharashtra	2005-03-07	Male	Girish Vijay Akre	9420355199	girishakre.2010@gmail.com	Businessman	Arti Girish Akre	7588848301	agakre1979@gmail.com	Teacher	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
804	1557	9910887719	alvisjosephv@gmail.com	alvisvarghese.22@stvincentngp.edu.in	N/A	RZ-2082/26, Happy Appartment, Tuklakabad Extension, New Delhi-110019	2004-07-13	Male	Varghese Joseph	9810596905	josephvarghese1508@gmail.com	Sales Manager	Sandhya Varghese	9871895864	sandhyareji76@gmail.com	Assistant Nursing Supridendent	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
806	674	7219737602	marioagade@gmail.com	marioagade.24@stvincentngp.edu.in	N/A	St John school compound mohn nagar nagpur	2006-10-24	Male	Martin Agade	77689 60038	N/A	Service	Flory Agade	9545896654	N/A	Teacher	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
583	676	9309523717	enoshsanchit2681@gmail.com	enoshramteke.24@stvincentngp.edu.in	N/A	Christian Colony, Chandrapur	2006-01-08	Male	Shamuel Ramteke	9370990972	N/A	Retired	Doris Ramteke	9370990972	N/A	Service	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
391	345	7276278490	louisalisha818@gmail.com	alishalouis.24@stvincentngp.edu.in	N/A	sant martin nagar jaripatka nagpur	2006-05-13	Female	Anthony	7378547802	brianlouis970@gmail.com	private job	Blossom	7798384866	louisalisha818@gmail.com	housewife	7798384866	7798384866	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
395	395	9284919227	sebastianguntur2025@gmail.com	sebastianguntur.23@stvincentngp.edu.in	N/A	Ayodhya Nagar, N 7, Cidco, near Sai Baba Mandir, Chhatrapati Sambhajinagar, Maharashtra 431003	2006-02-22	Male	Anthony	9765849104	sebastianguntur2025@gmail.com	Teacher	VRUSHALI	7721099126	sebastianguntur2025@gmail.com	Teacher	Sebastian Guntur	9284919227	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
493	1420	9607045925	thakresanket95@gmail.com	sanketthakre.22@stvincentngp.edu.in	N/A	At post kawalewada, tah. tirora,dist. gondia, maharashtra.	2002-09-05	Male	Shamrao Thakre	7350519220	N/A	Farmer	Alkabai Thakre	9607045925	N/A	housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
664	691	9373334727	rishiwalokar7@gmail.com	rishiwalokar.24@stvincentngp.edu.in	N/A	H no. 814, Pothi Lane,Gandhi putla, Itwari, Nagpur, 440002	2006-09-10	Male	Mahendra Walokar	8806682001	N/A	Businessman	Swati Walokar	7972408665	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
408	423	9667070469	jonathanshiju@gmail.com	jonathanshiju.23@stvincentngp.edu.in	N/A	714-LIG Flats, Hastsal, Uttam Nagar, New Delhi -110059	2005-09-18	Male	Shiju Manuel	9667070469	shijumanuel@hotmail.com	Self Employed	Lekha Paul	9868321974	lekks@rediffmail.com	Software Engineer	Shiju Manuel	9968562766	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
431	418	9424256637	shivjeetpatel05@gmail.com	shivjeetpatel.23@stvincentngp.edu.in	https://www.linkedin.com/in/shivjeet-p-patel-b24039296?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	B 303 Third floor B wing Shewalkar Gardens appartment Above DIY food complex, Gopal Nagar, Ahead Mate Square Nagpur 440022	2005-04-02	Male	Premsingh Patel	8817728304	premsinghpatel07@gmail.com	Service	Aarti Patel	9373179538	parati748@gmail.com	House Wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
530	1410	7499250407	sanvedkabade101@gmail.com	sanvedkabade.22@stvincentngp.edu.in	www.linkedin.com/in/sanvedkabade	Veer Sawarkar Nagar,Plot - 103, MIDC,Butibori,Nagpur	2004-03-12	Male	Sharad Kabade	9158707879	sharadkabade1234@gmail.com	Technical Assistant	Vandana Kabade	7499250407	vandanakabade101@gmail.com	Housewife	Sharad Kabade	9158707879	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
679	1529	9356850935	himanshushahare17@gmail.com	himanshushahare.22@stvincentngp.edu.in	N/A	At.Rengepar/kohali Ta.Lakhani Dist.Bhandara	2003-06-17	Male	Narendra Shahare	9405668811	N/A	Farmer	Kavita Shahare	9405668811	N/A	House Wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
680	1576	9370858505	chinmayeechandurwar2203@gmail.com	chinmayeechandurwar.23d@stvincentngp.edu.in	N/A	Pioneer Daffodils jaitala nagpur	2004-03-22	Female	Swapnil Chandurwar	9370858505	schandurwar34@gmail.com	Business	Madhavi Chandurwar	9422834248	N/A	Business	9370858505	9370858505	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
688	1515	9021667707	naineshzod311@gmail.com	naineshzod.22@stvincentngp.edu.in	www.linkedin.com/in/nainesh-zod-45693427a	At.Khairgaon post akola bazar district Yavatmal.	2004-12-03	Male	Vishnu	9370499573	N/A	Farmer	Aruna Zod	9021667707	N/A	HiuseWife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
555	341	9529573634	chandijaison8@gmail.com	jaisonchandi.24@stvincentngp.edu.in	https://www.linkedin.com/in/jaison-chandi-376898356?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Kuhi,ward no.14,taluk kuhi ,dist Nagpur	2005-04-21	Male	BABYCHAN CHANDI	7821006286	chandijaison8@gmail.com	Shopkeeper	MANJU CHANDI	7821006286	chandijaison8@gmail.com	Housewife	SIMON CHANDI	9022552835	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
697	1577	9686019222	piyushkhati04@gmail.com	piyushkhati.23d@stvincentngp.edu.in	www.linkedin.com/in/piyush-khati-a90a472b0	B-4 , Liberty Enclave , Malviya Nagar\nKhamla , Nagpur	2004-04-16	Male	Parag Khati	9604257579	paragkhati@gmail.com	Corporate Job	Kalyani Khati	9260173310	kallyanikhati1972@gmail.com	Housewife	Piyush Khati	9686019222	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
576	1558	9643351583	alwynpaul2004@gmail.com	alwynpaul.22@stvincentngp.edu.in	www.linkedin.com/in/alwyn-paul	A2/226-227, Third Floor\nSector-8, Rohini, Delhi, 110085	2004-11-15	Male	Paul T Poulose	9999641433	paultpoulose@gmail.com	Sr. MRI Supervisor	Jolly Paul	9811952697	jollypaul2008@gmail.com	Nurse In-charge	Paul T Poulose	8826818763	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
580	1398	8879962654	neerajruda@gmail.com	neerajruda.22@stvincentngp.edu.in	N/A	capt prakash pethe marg, colaba mumbai-400005	2004-07-28	Male	randhir munna ruda	9920698501	N/A	driver	Meera ruda	7045385230	N/A	housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
581	1337	7385121036	utkarshkuchankar0109@gmail.com	utkarshkuchankar.23@stvincentngp.edu.in	https://www.linkedin.com/in/utkarsh-kuchankar-0039b6290?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Behind gajanan mandir Wadgoan ward Chandrapur, 442401	2005-09-01	Male	Mahesh kuchankar	9823400155	maheshkuchankar@gmail.com	Business	Kavita kuchankar	87668 07448	kuchankarkavita@gmail.com	Housewife	7385121036	7385121036	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
582	1547	9834105118	dhawassamiksha@gmail.com	samikshadhawas.22@stvincentngp.edu.in	https://www.linkedin.com/in/samiksha-dhawas-4463b6262	At Sangam, Opposite Datta mandir, Wanadongri , Post Wadhhamana, Tahashil Hingna, Nagpur	2004-09-12	Female	Sunil Dhawas	9545438681	sunildhawas91@gmail.com	Farmer	Shalini Dhawas	9146486615	N/A	Housewife	7757865686	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
584	1401	9156141060	justin.joseph.91561@gmail.com	justinaugustine.22@stvincentngp.edu.in	www.linkedin.com/in/ justinaugustine	64, Shivganga appartment ,karve nagar, Wardha rd ,nagpur	2004-07-26	Male	Joseph Augusthy	9156141060	justin.joseph.91561@gmail.com	Business	Mary Joseph	9156141060	justin.joseph.91561@gmail.com	Bsc Nurse	9960157343	9156141060	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
585	1549	8767023703	adityaganvir358@gmail.com	adityaganvir.22@stvincentngp.edu.in	https://www.linkedin.com/in/aditya-ganvir-12346828b	At post Takalghat ward no. 1 th. Hingna dist. Nagpur	2003-09-08	Male	Vilas Ganvir	8767023703	N/A	-	Shalini Ganvir	8698948671	shalinichandankhede358@gmail.com	Labour	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
586	1419	8459301917	latikmohariya8@gmail.com	latikmohariya.22@stvincentngp.edu.in	N/A	At kolambi ta katol dis Nagpur Maharashtra	2004-11-24	Male	Rajesh Mohariya	9922987144	N/A	Farmer	Nita Mohariya	9405436428	N/A	Na	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
587	1440	9881408428	parinitiagarkar@gmail.com	parinitiagarkar.22@stvincentngp.edu.in	https://www.linkedin.com/in/pariniti-agarkar-200ba2245/	Plot no. 162 , Balaji nagar, manewada road nagpur	2004-12-13	Female	Nandkishor Agarkar	9359473878	N/A	Teacher	Aruna Agarkar	7350066485	arunaagarkar@5gmail.com	Housewife	Aruna Agarkar	7350066485	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
588	1555	7588085602	mersajoy04@gmail.com	mersajoy.22@stvincentngp.edu.in	https://www.linkedin.com/in/mersa-joy-800002315/	koovely (h), karukutty p.o\nmambra,ernakulam,kerala	2004-07-08	Female	Joy k.p	9656118267	joykp@gmail.com	Farmer	Suna Joy	9562872495	seenajoy@gmail.com	House wife	Fr.Joseph	9404147347	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
589	1582	8208860774	aryanhumane14@gmail.com	aryanhumane.21@stvincentngp.edu.in	N/A	Bante layout, Somalwada	2003-03-18	Male	Vishal Humane	9970879417	vishalhumane1979@gmail.com	Corporate Employee	Tressa Humane	9309713900	tressa28@rediffmail.com	Corporate Employee	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
590	1427	7414913787	kaiwalyapund112233@gmail.com	kaiwalyapund.22@stvincentngp.edu.in	no id	topaz residency	2003-10-08	Male	Swanand Pund	9822644611	sgpund@gmail.com	Professor	Pranita Pund	9850782311	pranita@gmail.com	home maker	9822644611	7387143878	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
591	670	7559255606	fernandeskevin860@gmail.com	kevinfernandes.24@stvincentngp.edu.in	N/A	Shila Nagar Gittikhadan Police Station Nagpur\nShakun Appt	2006-08-02	Male	Merwyn Fernandes	9689330035	merwynfernandes2015@gmail.com	Business	Deepamala	9834443076	fernandesdeepa0@gmail.com	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
592	1397	7385338060	robisuresh8@gmail.com	manukondasuresh.22@stvincentngp.edu.in	N/A	77,Gittikhadan Layout, Pratap nagar, nagpur	2004-07-08	Male	Manukonda Suresh Kumar	9422300590	N/A	Scientist	Manukonda Neelima	9860155088	N/A	Homemaker	Suresh Kumar	9422300590	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
665	1550	9175091359	simabhongade25@gmail.com	simabhongade.22@stvincentngp.edu.in	N/A	At post Ambhora [Khurd], Taluka: Kuhi , Dist : Nagpur	2004-09-25	Female	Pandurang Ramaji Bhongade	9588414850	sevakrambhongade24@gmail.com	Farmer	Kalpana Bhongade	9657549192	sevakrambhongade24@gmail.com	House wife	Brother	9588414850	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
667	1575	9307688581	nishantwankhede1311@gmail.com	nishantwankhede.23d@stvincentngp.edu.in	N/A	Pt. No. 41, Swagat nagar kapse layout Hudkeshwar road Nagpur	2004-11-13	Male	Sunil Rambhauji Wankhede	9765750520	N/A	Service	Vaishali Sunil Wankhede	9527397218	N/A	House wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
595	443	8237370379	varadpatilkalyankar@gmail.com	waradkalyankar.24d@stvincentngp.edu.in	N/A	At post:-shirad\nTq hadgaon\nDist nanded	2006-05-11	Male	Suresh Punjarao Kalyankar	9764170379	..	Farmer	Jyoti suresh Kalyankar	8378822731	..	Housewife	9604341968	7757867782	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
596	1578	7249045084	maitreyadalal5@gmail.com	maitreyadalal.22d@stvincentngp.edu.in	https://www.linkedin.com/in/maitreya-d-b83ab422a/	68,Annapurna Santaji society Manish Nagar near Raliway Crossing Nagpur	2003-05-29	Male	Sanjay Dalal	9764476851	sanmardal66@gmail.com	Retired	Sushama Dalal	8237789029	sushamadalal1@gmail.com	Housewife	Maitreya Dalal	8237789029	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
597	1389	9175186136	gargiudapure16@gmail.com	gargiudapure.22@stvincentngp.edu.in	www.linkedin.com/in/gargi-udapure-331198325	Plot no-46, Lane no-3 ,Old Dhyaneshwar Nagar, Near Sherawali Mata Mandir, Manewada Road, Nagpur-440027	2004-12-16	Female	Prabodh Udapure	7410555599	1973prabodh.udapure@gmail.com	Private Job	Nita Udapure	9840756136	neetaudapure@gmail.com	Housewife	9840756136	9175186136	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
598	1556	9322774108	roshantigga0000@gmail.com	roshantigga.22@stvincentngp.edu.in	N/A	SHASTRI WARD, TIWARI LAYOUT , HINGANGHAT	2003-10-14	Male	Dinesh	9765237874	N/A	Driver	Sushma	9322774108	N/A	HouseWife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
599	1566	7057920704	sohamrothe2004@gmail.com	sohamrothe.22@stvincentngp.edu.in	N/A	Plot no. 77 impress mill colony srinagar opposite Narendra Nagar Nagpur	2004-03-17	Male	Yogesh Rothe	9011011764	N/A	Store incharge	Bharati Rothe	9860279104	N/A	House wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
600	1399	7447437334	ryanlawrence742@gmail.com	ryanlawrence.22@stvincentngp.edu.in	N/A	mohan nagar, nagpur	2004-10-28	Male	Fabian Lawrence	7447437334	N/A	-	Prarthana Lawrence	8888822430	prarthanafabian@gmail.com	Central Government Service	Kimberley Lawrence	7888044454	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
678	1567	8007689441	thotesarthak04@gmail.com	sarthakthote.22@stvincentngp.edu.in	https://www.linkedin.com/in/sarthak-thote-432052260?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	44, anna baba nagar , kale layout, zingabai takli, godhani road , nagpur	2004-01-20	Male	Govind Thote	8007689441	N/A	None	Anuradha Thote	9922261514	N/A	Government servant	Anuradha Thote	9922261514	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
683	1562	8983283384	meetshivhare0270@gmail.com	meetshivhare.22@stvincentngp.edu.in	https://www.linkedin.com/in/meet-shivhare-4943a022b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Plot no 93. Vyankatesh appt. Khankhoje Nagar manewada road nagpur	2005-01-26	Male	Prakash shivhare	9890465483	shivhareprakash68@gmail.com	businessman	Mamta shivhare	9503983384	N/A	Housewife	Prakash shivhare	9890465483	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
603	1540	9373298561	renushreewadhi123@gmail.com	renushreewadhi.22@stvincentngp.edu.in	https://www.linkedin.com/in/renushree-wadhi-a567b3290	At post Telgaon, Tah - Kalmeshwar, Dist - Nagpur	2004-08-04	Female	Pravin Wadhi	9764573191	N/A	Farmer	Prachi Wadhi	9075114877	prachiwadhi1@gmail.com	Housewife	9764573191	9373298561	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
604	1527	7620984895	amiyabovas@gmail.com	amiyabovas.22@stvincentngp.edu.in	https://www.linkedin.com/in/amiya-p-bovas/	34, Bapu nagar, Bhandeplot, Nagpur.	2003-09-09	Female	Bovas P Varghese	8999633819	beenabovas@gmail.com	Engineer	Beena Bovas	8999126807	beenabovas@gmail.com	Home-maker	8668501087	8999126807	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
605	1439	9322350210	kasturichavan2000@gmail.com	kasturichavan.22@stvincentngp.edu.in	N/A	Plot no. 12 near mahakalkar sabhagruha bidhipeth ayodhya nagar nagpur, 440024	2005-03-17	Female	Pravin Chavan	8767455601	pravinchavan2@gmail.com	Business man	Nayna Chavan	9370074340	naynachavan6@gmail.com	Teacher	9322350210	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
694	1514	8010692357	aryawankhedework03@gmail.com	aryawankhede.21@stvincentngp.edu.in	https://www.linkedin.com/in/arya-wankhede-470759375?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Plot no. 68, Vaibhav nagar, Wadi, Nagpur, Maharashtra, 440023	2003-10-21	Male	Uttam Wankhede	9372350001	N/A	Proprietor	Sangita Wankhede	8329985204	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
666	1523	8340341863	adityakumar28122004@gmail.com	adityaraj.22@stvincentngp.edu.in	rajaditya28122004	St. Kabir Main Road , Banuchhapar,Bettiah, Bihar.	2004-12-28	Male	Avinash Kumar	73678 11833	N/A	Clerk.	Kumari Sumi Shrivastava	8084331293	N/A	Supervisor	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
675	1532	7083072697	vaibhavthakare878@gmail.com	vaibhavthakare.22@stvincentngp.edu.in	https://www.linkedin.com/in/vaibhavthakare2004/	24 B Shukla Nagar\nHawarapeth Nagpur	2004-08-10	Male	Ganesh Thakare	9960723625	ganeshthakare878@gmail.com	Business	Bharati Thakare	9503748495	bharatithakare878@gmail.com	Business	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
677	1573	7249391873	uttara0111@gmail.com	uttarabalpande.23d@stvincentngp.edu.in	https://www.linkedin.com/in/uttara-balpande-a6924a2a0/	84, Adhyapak Nagar,behind Mahalley Sabhagruha,\nManewada Ring Road, Nagpur,Maharashtra	2004-11-01	Female	Nitin Balpande	9860041873	N/A	Graphic designer	Praveena Balpande	9860400103	N/A	House wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
684	1543	9322148675	choudhariaastha185@gmail.com	aasthachoudhari.22@stvincentngp.edu.in	N/A	Vaishali nagar, sewagram road ,Wardha	2003-12-04	Female	Vedanath Choudhari	97640 99735	N/A	Farmer	Kalpana Choudhari	97645 79701	N/A	House wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
686	1570	8956830580	shubhamdhabu06@gmail.com	shubhamdhabu.22@stvincentngp.edu.in	www.linkedin.com/in/shubham-dhabu-15183925b	67, Income tax colony, Ranapratap nagar, Nagpur	2004-07-06	Male	Mohan Dhabu	940 407 8305	N/A	Buisness	Sangita Dhabu	9404078336	N/A	Nil	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
691	1516	9309031977	pratiksha1337@gmail.com	pratikshaparate.22@stvincentngp.edu.in	https://www.linkedin.com/in/pratiksha-parate-b294a6283?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Flat no.116 , Heritage-B ,Atharva nagari -2, Besa pipla road Nagpur	2004-02-28	Female	Ashish S Parate	7838792592	ashuparate76@gmail.com	Government service	Shubhangi Parate	8767034831	shubhangiparate79@gmail.com	Housewife	Shubhangi Parate	8767034831	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
692	1533	7738248820	danishgaus6@gmail.com	danishgaus.22@stvincentngp.edu.in	www.linkedin.com/in/danish-gaus-75aa28281	15, Mosambi Chawl, Milind Nagar, Gaodevi, Vakola Pipe Line, Mumbai, Maharashtra - 400055	2004-03-21	Male	Ayub Mohammad Gaus	9920053413	N/A	Driver	Tabassum Ayub Gaus	9833123496	N/A	N/A	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
698	1517	9156929978	dishantkewat2510@gmail.com	dishantkewat.22@stvincentngp.edu.in	https://www.linkedin.com/in/dishant-kewat/	Mauda-441104	2004-10-25	Male	Damodhar Kewat	8275288448	damodharkewat@gmail.com	Employee	Lalita Kewat	8275288448	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
753	981	9096993926	kashishjoseph2@gmail.com	kashishjoseph.24d@stvincentngp.edu.in	N/A	Ankit Apartment near christ hospital tukum Chandrapur Maharashtra India	2003-12-08	Female	Robert joseph	9834751049	N/A	Private job	Arti joseph	8087407567	naharkararti@gmail.com	Private job	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
761	1320	8668385933	makdebhumi@gmail.com	bhumimakde.23@stvincentngp.edu.in	bhumi-makde-09b3a7320	Bhande plot sq , Nandanwan road, Nagpur	2005-09-14	Female	Kishor Makde	8007772939	N/A	Civil Contractor	Sangita Makde	7798807866	N/A	Housewife	Prasad Makde	9765940802	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
765	1537	8208364375	darshanjadhav312@gmail.com	darshanjadhv.22@stvincentngp.edu.in	https://www.linkedin.com/in/darshan-jadhav-2a0056292?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Aaradhana Nagar Kharbhi Ring Road Nagpur	2005-05-14	Male	Shankar Jadhav	8888839344	N/A	Police inspector	Shalini jadhav	7887510952	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
775	376	8275531970	nimishasureshnair@gmail.com	nimishanair.23@stvincentngp.edu.in	N/A	Qtr no. 1/122/2 OFAJ Estate defence Nagpur Maharashtra - 440021	2006-01-18	Female	Suresh Nair	8600074113	N/A	Engineer	Gopika Nair	9049234948	N/A	Teacher	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
782	1531	9607535308	swankhede228@gmail.com	saurabhwankhede.22@stvincentngp.edu.in	N/A	Nagpur	2002-12-27	Male	Chandanlal wankhede	9552812550	N/A	Farmer	Padma wankhede	9607535308	N/A	House wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
610	1393	9834759767	bhumipatrikar7@gmail.com	bhumikapatrikar.22@stvincentngp.edu.in	https://www.linkedin.com/in/bhumika-patrikar-270849318/	Katol , Nagpur ,Maharashtra.	2004-03-14	Female	Dinesh Patrikar	9923859201	N/A	Teacher	Sudeshna Patrikar	9209791981	N/A	Homemaker	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
673	1409	8055772928	pranavhatwar124@gmail.com	pranavhatwar.22@stvincentngp.edu.in	https://www.linkedin.com/me?trk=p_mwlite_feed-secondary_nav	Navjeevan colony ,Sendurwafa,Sakoli	2004-06-26	Male	Dilip	7741024489	N/A	Buisnessman	Meena	8055772928	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
676	1572	9579027160	sharwariraut7@gmail.com	sharwariraut.22@stvincentngp.edu.in	N/A	Jagganath Nagar , Nagpur	2004-09-07	Female	Prakash Raut	9309184734	N/A	Police Inspector	Revati Raut	8767809616	N/A	Homemaker	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
685	1580	8459947619	salonisable586@gmail.com	salonisable.21@stvincentngp.edu.in	www.linkedin.com/in/saloni-sable-478b24235	UDAY NAGAR , NAGPUR PLOT NO :- 12	2003-08-15	Female	RAJENDRA SABLE	8010575687	N/A	Farmer	SEEMA SABLE	9049550300	seemasabale60@gmail.com	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
687	1525	9172468506	prayushadhengre.04@gmail.com	prayushadhengre.22@stvincentngp.edu.in	N/A	168, Akash Nagar, Manewada, Nagpur	2004-09-10	Female	Prabhakar Dhengre	9665885163	N/A	Private job	Vishakha Dhengre	9579475492	N/A	Nurse	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
696	1551	8177986659	dangesujal07@gmail.com	sujaldange.22@stvincentngp.edu.in	https://www.linkedin.com/in/sujal-dange-a71b71262	House No. 5, Swami Samarth Nagri, Besa-Pipla Road, Nagpur-440037	2004-01-20	Male	Anant Ganpat Dange	9665171969	N/A	Nil	Urmila Dange	9322391896	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
700	1522	9322272041	diyachilmulwar@gmail.com	diyachilmulwar.22@stvincentngp.edu.in	https://www.linkedin.com/in/diya-chilmulwar-340878289	Plot No. 166, Sai Nagar 1, Hudkeshwar Road	2004-06-10	Female	Anil Chilmulwar	9503928091	anilchilmulwar@gmail.com	Private Job	Suvarna Chilmulwar	9561488586	suvarnachilmulwar@gmail.com	House Wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
704	1433	7564830072	vivekkumar822883@gmail.com	vivekkumar.22@stvincentngp.edu.in	N/A	Muzaffarpur, Bihar\nPIN code : 843103	2005-09-04	Male	Sudhir Kumar	9931861045	N/A	Teacher	Sangita Kumari	8757490104	N/A	Sevika	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
754	403	8459229501	nishikantdalal47@gmail.com	nishikantdalal.23@stvincentngp.edu.in	https://www.linkedin.com/in/nishikant-dalal-a769a0328?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Waghdhara , New Gumgaon , Tah. Hingna , Dist. Nagpur - 441122	2005-06-28	Male	Namdeo	7350060357	N/A	Shop	Vanita	7350060357	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
766	1404	8605859688	kkanojiya975@gmail.com	kashishkanojiya.22@stvincentngp.edu.in	www.linkedin.com/in/kashish-kanojiya	RTMNU quarter behind Subhedar hall, University Ground\nAmravati Rd, near law college square, Ravi Nagar, Uday	2004-08-26	Female	Naresh Mohanlal Kanojiya	9420845068	.	Assistant Administrative Officer	Dr. Archana Naresh Kanojiya	8830961159	akanojiya177@gmail.com	Professor	Archana Naresh Kanojiya	8830961159	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
770	666	6265197195	prathamtiwari684@gmail.com	prathamtiwari.24@stvincentngp.edu.in	N/A	Ward no. 4 Balaghat road\nNear jaiswal petrol pump	2005-03-28	Male	Late prashant tiwari	6265197195	prathamtiwari684@gmail.com	Business	Priyanka Tiwari	9302697395	N/A	Business	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
699	1519	7717743375	princeksingh010@gmail.com	princesingh.22@stvincentngp.edu.in	N/A	New Delhi	2004-01-02	Male	Sunil Kumar Singh	8287421913	singhsunil7321@gmail.com	Private Job	Preety Devi	7493098766	preetysunil02@gmail.com	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
614	1542	8766609208	prathmeshnishane@gmail.com	prathmeshnishane.22@stvincentngp.edu.in	linkedin.com/in/prathmesh-nishane-a150292b6	75, Samarth Nagari, HB Estate, Sonegaon, Khamla, Nagpur, Maharashtra 440025	2004-05-27	Male	Vishnu Nishane	9423636194	vishnunishane@gmail.com	Exam Instructor	Sushama Nishane	8975742135	sushamanishane@gmail.com	Head Mistress	8975742135	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
701	1400	8767912262	dreammanwatkar@gmail.com	shalinyamanwatkar.22@stvincentngp.edu.in	N/A	161 mecosabagh christian colony bezonbagh nagpur	2004-02-22	Male	Amit Manwatkar	7387377333	N/A	Service	Saroj manwatkar	9372755333	N/A	House wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
702	1402	8983546576	elashashailesh17@gmail.com	elashadeoghare.22@stvincentngp.edu.in	N/A	Garden court nagpur	2004-01-27	Female	Shailesh	8983272276	N/A	Real estate	Ajaya	9421916020	N/A	Nurse	8983546576	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
767	1340	9022105175	surajdhere8300@gmail.com	surajdhere.23@stvincentngp.edu.in	https://www.linkedin.com/in/surajdhere8300	WB 6/8, Indorama colony no. 2, MIDC Area, Butibori, Nagpur, Maharashtra, India	2005-03-11	Male	Sham Dhere	9021667548	surajdhere8300@gmail.com	-	Chandrakala Dhere	7798296722	surajdhere8300@gmail.com	-	Home number	7798296722	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
780	426	7887537591	Palakdugad22@gmail.com	palakdugad.23@stvincentngp.edu.in	N/A	Arihant residency near all india reporter, congress nagar, nagpur	2005-11-22	Female	Lalit dugad	9225237484	N/A	Business	Shilpa dugad	7755928811	N/A	House wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
787	397	9921336948	salvepeter9@gmail.com	petersalve.23@stvincentngp.edu.in	https://www.linkedin.com/in/peter-salve-3377272a7?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	Mecosabagh Christian colony near gold gym Nagpur - 440001	2004-06-30	Male	Roshan Salve	7972484659	roshansalve692@gmail.com	Private Job	Swarana Salve	8446403969	yarushasalve35@gmail.com	House wife	Swarana Salve	8446403969	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
788	1367	9109291605	bismeetkukreja@gmail.com	bismeetkukreja.23@stvincentngp.edu.in	N/A	Opp banerjee hospital, suraj ganj, itarsi, M.P., 461111	2005-08-09	Female	Daljinder Singh Kukreja	9826225990	N/A	Businessman	Ravinder Kaur Kukreja	8878187770	N/A	Housewife	Daljinder Singh Kukreja	9826225990	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
796	440	8080480184	abhiamair@gmail.com	abishaiamair.24d@stvincentngp.edu.in	https://www.linkedin.com/in/abishai-amair-a04234247/	Bhramhanand Apartment, near Indrayani Matimand School, Akola	2004-12-09	Male	Edward Amair	9420101441	edwardamair637@gmail.com	Teacher	Sheetal Amair	7588759148	edwardamair637@gmail.com	House Wife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
799	658	7000084816	jaiwarakshat@gmail.com	akshatjaiwar.24@stvincentngp.edu.in	.	Madhya Pradesh, waraseoni district balaghat	2006-07-20	Male	Balkrishna singh Jaiwar	9977990435	jaiwarbalu@gmail.com	Teacher	Sujata jaiwar	7489888964	jaiwarsujata1@gmail.com	Teacher	9329517465	...	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
800	1319	7875121636	shreyaaroyy2005@gmail.com	shreyaroy.23@stvincentngp.edu.in	https://www.linkedin.com/in/shreya-roy-2592a9324	6,Ajanta Colony near chhaoni masjid opposite to poonam chambers,nagpur	2005-07-28	Female	Abhijit Roy	7276872141	abhijitroy1021974@gmail.com	Clerk	Suparna Roy	9763228532	suparna2101978@gmail.com	Principal	9763228532	9763228532	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
803	348	9322681686	parthkhandar27@gmail.com	parthkhandar.24@stvincentngp.edu.in	--	9-Anjaneya Nagri, Besa-Pipla, Hudkeshwar road, Nagpur	2006-10-17	Male	Sujit Khandar	8055712888	--	Business	Varsha Khandar	9356779226	--	Housewife	Parth Rebhe	8855014048	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
805	398	9325897872	gregorythomas2005@gmail.com	gregorythomas.23@stvincentngp.edu.in	www.linkedin.com/in/gregthomas25	G-3 Saimahak Apartments, Mohan Nagar , Nagpur	2005-05-23	Male	Saju Thomas	9420464548	sajuthomaskarukunnel@gmail.com	LOCO PILOT (CRLY)	Jessy Saju Thomas	8788546815	jessysaju1999@gmail.com	TEACHER	MARINA SAJU THOMAS	7666484390	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
4	662	7666325216	thakreharsh178@gmail.com	harshthakre.24@stvincentngp.edu.in	Harsh Thakre	B606 green view colony khairpur raigarh cg	2006-10-14	Male	Chandra kumar thakre	9827177908	thakre1976@gmail.com	Service	Kalita thakre	9827163062	kalita.raji2019@gmail.com	Service	7666325216	9827177908	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
807	710	9359163535	shlokhotey22973@gmail.com	shlokhotey.24@stvincentngp.edu.in	https://www.linkedin.com/in/shlok-hotey-354853329?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app	Lotus-1 apartment, Manish nagar, Nagpur	2005-10-14	Male	Mangesh Hotey	9422125125	mhotey11@gmail.com	Lecturer	Vijeta Hotey	8668871711	vhotey11@gmail.com	Housewife	Renu Hotey	92096 50461	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
810	373	9975330302	sabnesanand@gmail.com	sanandsabne.23@stvincentngp.edu.in	N/A	Sant dnyaneshwar waad , vidya nagar , bhandara.	2005-12-24	Male	santosh sabne	9860437087	santoshsabne@gmail.com	banker	sanika sabne	9049757979	sanikasabne@gmail.com	teacher	ganesh sabne	9423109737	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
811	1375	9175243234	zanjalsrujan94@gmail.com	srujanzanjal.23@stvincentngp.edu.in	https://www.linkedin.com/in/srujan-zanjal-42868b1b2/	93, Vitthal Nagar No. 1,  Vidharbha Premier housing society, near New Era School, Uday Nagar Square, Manewada, Nagpur 440034	2005-10-22	Male	Bhushan Zanjal	8830406972	bhushanzanjal1981@gmail.com	businessman	Rasika Zanjal	9921249930	rasikazanjal@gmail.com	Govt. Job	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
812	1369	7030055965	adityaexploring27@gmail.com	adityayelne.23@stvincentngp.edu.in	https://www.linkedin.com/in/aditya-yelne-1921b8292?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	197, New Amar Nagar, Manewada, Nagpur.	2005-07-02	Male	Kiran Yelne	9892202829	N/A	Service	Jyotsna Yelne	9561487694	jyotsna.umak@gmail.com	House Wife	Keshaorao Umak	9860239735	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
34	314	7666592371	anishbezalwar17@gmail.com	anishbezalwar.24@stvincentngp.edu.in	https://linkedin.com/in/AnishBezalwar	Sneh nagar ward No.2 gadchiroli near mama savji hotel	2005-04-17	Male	Kishor Bezalwar	8275296002	N/A	Teacher	Kiran Bezalwar	9421735217	N/A	Housewife	88884655353	9421735217	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
499	1358	9595421276	sksahilsheikh1210@gmail.com	sahilsheikh.23@stvincentngp.edu.in	N/A	Nagpur 441108	2005-10-12	Male	Sajid	8329222524	N/A	Business	Roshana	8329956530	N/A	Housewife	N/A	N/A	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
830	1685	0987654321	mirehimanshu@gmail.com	mirehimanshu@stvincentngp.edu.in	N/A	edc dcwfd	2002-01-01	Male	yghjb hljk	9604686258	mirehimanshu@gmail.com	tfygh	vhgjb	9604686258	ftygvhj	tyiukghbj	ctfjgvhb	9604686258	https://res.cloudinary.com/dmjig83kx/image/upload/v1771986458/students/p9gllwzz1eiwdc7uumor.jpg	students/p9gllwzz1eiwdc7uumor	\N	\N	\N	\N	\N	\N	\N	\N	\N
3	1052	9604686258	mirehimanshu@gmail.com	himanshumire.23@stvincentngp.edu.in	https://www.linkedin.com/me?trk=p_mwlite_profile_view-secondary_nav	Umred Maharashtra	2005-03-12	Male	Vijay Mire	8806577596	vijaymire6@gmail.com	Business	Alka Mire	9604686258	shrawanimire@gmail.com	House wife	Vijay Mire	8806577596	https://res.cloudinary.com/dmjig83kx/image/upload/v1771468684/students/ckcb2wrc1csqotdm5qvw.jpg	students/ckcb2wrc1csqotdm5qvw	A+	OBC	291346409718	23001066	https://github.com/syt4himanshu	TNPS BOYS HOSTEL	Vijay Mire	8806577596	test@gmail.com
267	1343	9067096996	sahilshri0405@gmail.com	sahilshrivastava.23@stvincentngp.edu.in	https://www.linkedin.com/in/sahil-shrivastava-758b032bb?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app	D 102, Empire Residency, near uco bank somalwada branch, manish nagar, nagpur , maharashtra 440015	2005-11-06	Male	Sanjeev Shrivastava	9272175665	amanshrivastava256@gmail.com	Private sector	Mamta Shrivastava	8329593537	N/A	House wife	9272175665	8329593537	https://res.cloudinary.com/dmjig83kx/image/upload/v1771924429/students/ck5n0fgjsbgi9dfikiwo.jpg	students/ck5n0fgjsbgi9dfikiwo	\N	\N	\N	\N	\N	\N	\N	\N	\N
84	342	7387091508	yashlute19@gmail.com	yashlute.24@stvincentngp.edu.in	https://www.linkedin.com/in/yashlute19/	BHANDARA	2005-08-15	Male	Arun Lute	9421808723		pensioner	suchita lute	9420620561	N/A	housewife	N/A	N/A	https://res.cloudinary.com/dmjig83kx/image/upload/v1785036617/students/htjyfxguywaghqcajwgx.jpg	students/htjyfxguywaghqcajwgx	A+	OBC	894932938745	24003065	https://github.com/yashlute19	SVPCET	Local Guardian Details		
\.


--
-- Data for Name: swoc; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.swoc (id, student_id, strengths, weaknesses, opportunities, challenges) FROM stdin;
2	414	Flexibility	Can't get angry	Zenith forum	Time
5	659	Online games	Very low confidence in more people	None	Achieving a good marks.\nAchieving a good job.
6	366	I’m disciplined with my routine and curious to learn new things. I also like taking initiative, whether it’s in studies, coding, or working on startup ideas.	Sometimes I take on too many things at once, which makes me lose focus. I also tend to overthink instead of just executing quickly	College gives me the chance to explore projects, build a startup, and learn from mentors and peers. I also have access to endless online resources to grow faster	Balancing academics with my startup dreams is tough. Plus, competition is high, so I need to stay consistent and adaptable to succeed
7	688	Technical, logical, quick learner.	Communication, Management.	Hackathons and projects	Communication, presentation, lack of team members
8	704	Communication	Lack of consistency	Sports	Vast topic to explore in CS
9	660	I have Good technical knowledge.\nI know c, python,html,css,JavaScript .	I am working on improving my communication and presentation skills.	GATE exam and internships.	Balancing academics, GATE preparation, and skill development.\nOvercoming hesitation in public speaking and teamwork discussions.
10	647	I have good  hand in coding languages like c ,javascript,pythonand learing java	Communication	Internships and hackathons	Time managment
11	364	Quick learning ,	Communication	My curiosity, mix of tech + soft skills, and interest in robotics /AI are strong career boosters.	I need to focus on one primary domain, build real projects, and improve self-confidence in presenting without guidance.
12	667	My strength is that once I decide to do something, I fully commit myself to it and make sure I complete it. I don’t just plan or talk about it—I take action. This quality helps me stay focused on my goals and overcome obstacles on the way.	My main weakness is that sometimes I struggle with consistency and tend to become a bit lax. I notice that I start tasks with enthusiasm, but at times I delay or lose focus. However, I’m aware of this, and I’ve been working on building discipline by setting small daily goals, using reminders, and following a routine. This has already helped me improve, and I’m becoming more consistent day by day.	Technical competitions like hackathon, Internship	Job preparation, interview, soft skills, and improve personality
13	343	Good at practical learning.\nGood speaker.\nTeam management skills.\nEvent management skills.	Over talkative.\nSlow theory learner.	Over enthusiastic.\nCan take part in every thing.\nSocially active.	Managing studies with social activities.\nPermission from parents.
15	653	Ambitious, Logical Thinker, Adaptable.	Procrastination, Lose Focus when needed.	Hackathon, College Events, Internships, Online Courses.	Attempting a lot at once, paradox of choice, distractions.
17	361	Hardworking ,quick learner	Shy	...	Low communication skills
18	327	Leadership , Passionate , Problem solver , Corageous	Self criticism , over confident	Gain practical knowledge through various internships , projects , etc .	Time management , academic workload .
19	347	Time Management , Keen Learner , Leadership Skill, Communication	Overthinking ,Stress, Procastination	Sports, Internships,Hackathons	Lack of awareness and guidance
20	334	leadership skills , communication skills, problem-solving	Overthinking , Stress, Procastination	Sports , Internships, Hackathons	lack of oppotunities , lack of awareness
21	358	Good learner	Communication	Academics	Technology, technical skills
23	330	Quick Learner, Teamwork,	Procrastination, Time Management,	Departmental Events, College Events, Intercollege hackathons, Smart India Hackathon, Internships	Time Management, Lack of Awareness
24	357	Adaptability, Creativity, Discipline and Consistency	Weak communication skills, Lack of goal setting, Poor time management	Skill development, Networking, Soft skill development	Balancing Theory and Practical , macro project work
25	338	Punctual \nGrasping power\nListener	Overthinking \nShort Tempered	Internships, Competitions, Departmental Events, College Events.	Time Management, Stress management.
26	367	I am a highly motivated and adaptable individual with strong problem-solving skills and a keen attention to detail. I excel in both independent and team settings, consistently demonstrating effective communication and collaboration abilities. My dedication to continuous learning allows me to quickly grasp new concepts and apply them efficiently. I am reliable, organized, and able to manage multiple tasks while maintaining a positive attitude and strong work ethic. These strengths enable me to contribute meaningfully to any project or team I am part of.	One area I am continually working to improve is my tendency to be overly detail-oriented, which can sometimes slow down my progress on tasks. While my attention to detail ensures high-quality work, I am learning to balance this by prioritizing efficiency and knowing when to step back and view the bigger picture. Additionally, I sometimes find it challenging to delegate tasks because I want to ensure everything is done correctly, but I am actively developing trust in my team and improving my delegation skills. Overall, I view these weaknesses as opportunities for growth and am committed to improving them through self-awareness and practice.	College offers me numerous opportunities to prepare for my future career and personal growth. For example, I can take advantage of specialized courses and workshops that deepen my knowledge in my field of study. I also have the chance to join clubs and student organizations related to my interests, such as academic societies or volunteer groups, which help me build leadership and teamwork skills. Internship programs provide valuable real-world experience and professional networking, while research projects allow me to develop critical thinking and problem-solving abilities. Additionally, career fairs and mentorship programs connect me with industry professionals who can offer guidance and open doors for future job opportunities. These experiences in college equip me with the practical skills, knowledge, and connections necessary to achieve my future goals.	I sometimes face challenges in balancing multiple priorities, but this pushes me to improve my time management and organizational skills. I see these challenges as opportunities to grow and become more efficient and effective in my work.
28	352	Hardworking, quick learner	Introvert	..	..
29	315	Hardworking\nGood communication skills	Taking extra time for work\nTake time to think about the ans	Skill development courses \nInternship opportunities	Practice time management with daily schedule\nAttend personality development workshops
30	314	leardership  , skill, programming skills, playing physical Game	overthinking ,public speaking ,	Internship, Skill Development, Certifications and projects	lack of guidence in programming skills
31	372	Programming C, Teamwork, Learning,  Time Management , Focus	Communication in english , Confidence	GATE	Communication in english , Resources,  guidance
42	319	Quick Learner	Communication	Web developer, AI/ML	Project
3	1052	Team Player, Leadership,	Multitasking	Projects	Academics, personal projects
16	350	Logic building	Short tempered	Departmental events\nCollege events\nHackathons	Chess championship \nSports \nCultural activities
4	662	Learning	Academics and coding	College and department	Coding
1	409	Curiosity, Critical Thinking, Development	Hard to manage schedules	Hackathon, Internships	Managing Academic workload with personal certifications
407	1685	Fast	Very Fast	Jobs	Fear
27	328	Academically, my strengths are that I’m very consistent and dedicated in my studies, and once I set a goal, I work hard until I achieve it. I have a curious mindset, so I always try to understand concepts in depth rather than just memorizing them. I also manage my time well by planning and following routines, which helps me balance different subjects effectively. Along with that, I keep looking for smarter ways to study, so I can learn faster and remember better.	As a student, I feel my weaknesses are that sometimes I procrastinate and delay starting my work, which makes me rush at the last moment. I also tend to lose focus if the subject feels too theoretical or less interesting, which affects my consistency. At times, I overthink whether I’ve studied enough or not, which makes me stressed instead of confident. Another weakness is that I can get distracted by small things and it takes me some time to get back into my study flow.	From my college, I got opportunities to build my academic knowledge through lectures, labs, and projects, which helped me understand my subjects more practically. I also got chances to improve my communication and teamwork skills by participating in group assignments, presentations, and discussions. College gave me exposure to different events, seminars, and workshops where I could learn beyond the syllabus and explore new areas. Most importantly, it gave me a platform to interact with different people, share ideas, and grow both personally and professionally.	One of the main challenges I faced in college was managing time between multiple subjects, especially when some topics were very lengthy and required extra effort to understand. Sometimes I found it difficult to stay consistent with my studies because of distractions or a lack of motivation. Handling theoretical subjects that felt less interesting was also a challenge, as I had to push myself harder to focus on them. Along with academics, balancing personal goals, self-care, and college activities also tested my patience and disciplin
38	436	Strong technical knowledge in website development, Data Structures & Algorithms (DSA), and programming languages like Java and C++\n\nGood at teamwork and collaboration, able to coordinate well with peers\n\nProblem-solving and logical thinking ability\n\nQuick learner and adaptable to new tools and technologies	Lack of confidence in public speaking or stage presentations\n\nSometimes spend extra time aiming for perfection in technical tasks	Exposure to internships, coding competitions, and technical events to improve practical skills\n\nAccess to career counselling and mentoring to identify growth areas\n\nExpanding job opportunities in the IT field, especially in software development and problem-solving roles	Exposure to internships, coding competitions, and technical events to improve practical skills\n\nAccess to career counselling and mentoring to identify growth areas
39	404	Leadership	.	.	.
40	439	Self-motivated, Time management, Decision-making , Patience ,Dedication to work/study	Lack of confidence sometimes, working on self improvement	Open to learning and growth opportunities	Focused on overcoming small challenges with consistent effort
43	702	Logical thinking, Continuous learning, Punctuality, Patience, Decipline	leadership, over thinking, emotional, communication skills	Academics, Certifications, Soft skills, Technical, Departments, Extra corricular, Sports cultural, Internships	Workload balance, High competition
44	381	strong mindset	lack of confidence	internship and placement councilling	proper moc interview and communication
32	318	belief in myself , my family,friends.	fear , communication.	college form, hackathons,events.	time management,balancing academics with other activities.
34	326	visual thinking \nhandling critical situation	logical thinking\nstage fear\noverthinking\nfrustration	academics\ndepartment\ninstitute\nextra curricular	data structure and algorithm\ncompetitive programming\ntime management\nbeing in discipline
37	353	Patience, discipline, academics	Social skills, lack of technical skills, confidence issue	Internship, events, academics	Lack of motivation to stay consistent
41	401	My Family	Stage fear	College and inter College level apportunities	Lack of confidence, Communication skills , stage fear
33	360	Programming - flutter, java , c \nAdaptability , good team work , EQ ,	Procrastination \nTime management	Google summer of code , GATE , Academic , department, certification, internship , competative programming,	Resources, \nGuidance ,
35	351	Dedicated , quick learner, grate grasping power	Logical thinking, grammatical issue	Academic \nDepartment \nInstitute \nExtra- curricular \nCertifications \nInternships	DSA , competitive programming
36	339	Quick Grasper\nCuriosity to learn new things\nStrong mindset towards goal	Communication\nSocial Anxiety\nIntrovert\nless confidence in problem solving	Looking for more knowledge	Time management\nNeed for real-world experience in Web Development
47	675	Good communication skills , creativity, adaptability and teamwork	Taking on too much responsibility, impatient, time management pressure	Emerging tech skills , networking with mentors	High competition, managing academics along with extra curricular activities, self doubt
45	386	Creative Thinking, Quick Learner, Communication Skills, Problem-solving	Overthinking, Lack of confidence	Networking Platforms, Certification Courses, Career Flexibility	Interview Pressure, Time Management,
46	669	Patience\nCommunication Skills\nTeamwork\nGood listener	Anti social\nOverwhelmed easily	College hackathons\nProjects	Time\nCompetition
50	672	Hardworking	Distraction	Skill based learning	Limited experience
48	698	academically good,can grasp easily,curious,well communication skill	stage fear,english proficiency,procastinator	academics,extra curricular,technical,certification	time management,consistency,communication
49	442	Strong problem-solving and logical thinking.\n\nProficiency in Python, Java, Android development, Django, and API development.\n\nPassion for AI and ML with hands-on project experience.\n\nQuick learner, adaptable, and open to exploring new technologies.\n\nAbility to design applications with a focus on usability and user experience.	Sometimes spend too much time perfecting details, which can delay progress.\n\nCan get deeply focused on technical aspects and overlook minor non-technical factors.\n\nStill improving in areas like advanced cloud deployment and large-scale collaboration.	Growing demand in AI, ML, Android apps, and Django-based web/API solutions.\n\nOpportunities to apply skills in impactful projects such as healthcare AI and smart farming.\n\nIncreasing internship and project collaboration opportunities.\n\nExpanding tech ecosystem that provides continuous learning.	Balancing multiple interests (AI, ML, app development, Django) and prioritizing focus areas.\n\nLimited real-world industry exposure compared to personal/college projects.\n\nKeeping up with fast-changing technologies and frameworks.\n\nManaging time effectively between academics and building projects.
51	325	Open to feedbacks, Curious, helping nature, self motivation.	Lack of breaks, Time management, perfectionism, overthinking	Academics, inter college, Extra curricular, certificates, department, internship	Staying consistent, Managing time efficiently
52	707	Leadership, Communication, Confident, Social , adaptable , responsible, dedicated towards work.	Sometimes Procrastinate under pressure, occassionally hesitant to take risk.	Academics, Extracurricular, Department level, Institute level, Inter College, Internship, Networking, Participation in various activities and competition.	Continuous upskilling, balancing academics with personal growth, High competition.
53	369	Teamwork, dedicated to things i love	Loses interest if i don't like something	Wanna be good at coding and lead a club	Don't have problem facilities to learn coding by myself
54	705	Organized, Good at managing tasks	Lack of stage confidence , Limited communication skills	Academics improvement, Extracurricular activities, Department-level activities, Institute-level opportunities, Inter-college competitions, Technical events/workshops, Certifications, Soft skills training ,Internships	Difficulty in English speaking and fluency, Time management between academics and activities
55	356	Adaptive	Social anxiety	.	Frustration
57	712	fast learner,patient	low confidence,anxiety	internship	improve myself
58	683	Learn quickly	Communication	Score good	Learn new things
59	668	Hardworking,  honest, friendly	Time management problem	Learning new skills or technology	Difficulty in managing time efficiently
60	324	Quick Learner, Quick Grasping, Visual Thinking, Understanding, Focused, Logical Thinking	Lazyness, Communication Skills, Confidence, Soft Skills	Academics, Department Activities, Certifications, , Internships, Extra-curricular Activities	Competitions
61	382	Smart learning	Time management	Counciling	Departmental support
62	664	Learning, practical	Theory/Studying for long	No	Attention span
63	344	I am good at giving a presentation	I am unable say no to any work assigned to me	To participate in more technical events, workshops, seminars	Adapting to new teaching methods and academic pressure
64	399	Curiosity, persistance	Consistency, Trying to focus on many fields at once	Game Development and AI	Consistency and lack of depth in one area
65	687	Confident \nFlexible \nAdaptable\nEasily Socialise \nEmotionally intelligence \nLogical and Practical \nLanguage \nOptimistic	Procrastination \nLazy\nInconsistent \nSlow grasper \nCommunication skill	Academics \nExtra Curricular \nDepartment\nInstitute \nInter college \nTechnical \nCertifications \nSoft skills \nInternships	Not consistent \nLaziness\nTime management \nVocabulary
66	692	Strength is that it don't take more time to understand new things	Weakness is I get nervous if I am not getting things	Yet I didn't get any opportunities	Challanges are I am not consistent
67	322	Academic: programming, drawing \nNon Academic: time management, family	Academic: communication skills, english speaking	Academic, department, institute,extra curricular, certification, soft skills, internships	Job
68	654	multitasking , hardworking,punctual	procrastination	workshop	time managment
69	421	Good foundation in HTML, CSS, JavaScript, and C/C++.\nCurrently learning Data Structures & Algorithms in C/C++.\nExploring  Java to strengthen programming skills.\nTeam collaboration and problem-solving mindset.	Still developing backend and database knowledge.\nNeed to improve confidence in advanced DSA problem-solving.\nCommunication and presentation skills can be enhanced further.	Strong scope in web development and Java-based applications.\nDSA practice will help in placements and competitive coding.\nExposure to internships and real-world projects to gain experience.\nGrowing IT industry offers multiple career paths.	Balancing academics, DSA practice, and learning new technologies.\nStaying consistent with coding practice and problem-solving speed.\nCompeting with peers having advanced full-stack .\nAdapting to rapid changes in technology trends.
70	693	Punctual, good listener	Weak comunication skills	Technical opportunities	To develop comunication skills, extreme technical skills
71	695	logic buiding, problem solving skills	communication	no	yes
72	679	Leadership\nAdaptability\nCommunication\nTeam Collaboration	Perfectionism\nDelegation	Skill Development\nMentorship & Learning	Tight Deadlines\nWork-Life Balance\nHigh Competition
73	680	dedicated in given task, team leader, confident,  willing to learn new things and do projects	improving soft skills, overthinking, have to improve technically	ready to explore new things and seek opportunities in different domains and do projects in domains like cybersecurity	no proper roadmap, difficulty in prioritizing tasks
74	384	1. Fast learner\n2. Adaptability \n3. Time management \n4. Problem solving	1. Self-criticism\n2. Public speaking \n3. Difficulty saying no	1. personal growth \n2. Skill development	1. Distractions\n2. Social integration \n3. Managing academic pressure
77	665	self-regulation, resilience, patience, passion	Lack of specific technical skills, poor planning, narrow-mindedness	to improve technical skills	lack of confidence
176	441	Hardworking	None	Internship	None
75	686	As a student, you're in a phase of life where learning is your main focus, and you're actively developing skills and knowledge.	Poor Time Management\n\nStruggling to prioritize tasks, meet deadlines, or balance study with other responsibilities.\n\nProcrastination\n\nDelaying studying or assignments, often leading to last-minute stress and lower performance.	As a student, you’re in a good position to experiment with new tools (AI, apps, digital creation) and even start your own projects or businesses.	Anxiety, depression, loneliness, or lack of motivation are increasingly common and can affect both academic and personal life
78	706	Problem solving skills.\nProgramming language.\nData structure & algorithm.	Sometime take longer to optimize solutions.\nIncomplete knowledge of advance tool.	Internship.\nReal world problem.\nHackathon and coding contest.	Lack of soft skill.\nAnxiety.\nDifficult to imagine theoretical knowledge.
82	415	Positive Learning Attitude with good Adaptability,\nDedicated and Hardworking,\nCreative Mindset,\nInterest in Iot, Designing & Development,\nActive Participation and Collaboration Skills	Procrastination & Lack of interest leading to delays in completing tasks.\nNeed for improvement in Communication.\nDifficulty Maintaining Focus for long time.	Availability of workshops, seminars, and online learning platforms.\nNetworking with peers, faculty, and alumni to enhance career prospects.\nOpportunities to develop new skills (technical + soft skills) that match industry needs.	Challenge of upgrading skills to meet current market expectations.\nRisk of missing opportunities due to lack of interest or delayed actions.\nPressure to balance academic performance with personal development.
83	329	Critical Thinker\nAdaptive\nHigh EQ	Procrastination\nEasily distracted	Academics\nInternships	Consistency\nDiscipline
76	694	Consistent, hardworking, adaptable to new environments	Sometimes overthinking before taking decisions, need to improve communication skills	Chances to enhance skills through workshop and training, Growing career opportunities in my field of interest	Rapidly changing technology requiring continuous upskilling,high competition in academic and career field
80	709	Dedicated ,  consistent, Hardworker, ready to give my best	Not a quick learner	Internship, serving as a CDC cordinator	Maintain CGPA
79	677	Eager learner, organized approach, diligent, analytical mindset.	Over reliance,	Expand programming skills, deepen microcontroller expertise, build personal projects.	Problem solving skills
81	671	Teamwork and collaboration\nProblem-solving mindset\nAdaptability\nOverthinking (working on faster decisions)\nCreativity and innovation\nTime management & organization\nEmpathy and active listening\nDecision-making ability\nSelf-motivation and discipline	Public speaking (improving)\nOverthinking (working on faster decision)	Opportunity to learn new skills\nOpportunity to gain practical experience\nOpportunity to work on real projects\nOpportunity to explore career interests\nOpportunity to build professional networkss)	Balancing studies with skill development\nLimited practical exposure\nLack of industry experience\nManaging time effectively\nAdapting to new learning environments
84	650	Quick Learner – You grasp new concepts and skills fast.\n\nAdaptable – Comfortable adjusting to new situations and challenges.\n\nHardworking & Dedicated – You stay committed to your goals.\n\nTeam Player – You collaborate well and contribute positively in groups.\n\nCreative Thinker – You come up with fresh ideas and solutions.\n\nGood Communicator – You express your thoughts clearly and effectively.\n\nLeadership Qualities – You take initiative and guide others when needed.\n\nProblem-Solving Skills – You analyze situations and find practical solutions.\n\nOrganized & Focused – You manage time and tasks efficiently.\n\nPositive Attitude – You stay motivated and encourage others.	Overthinking – Sometimes spend extra time analyzing instead of acting quickly.\n\nPerfectionism – Wanting everything flawless can delay tasks.\n\nTaking on Too Much – Struggle to say “no,” leading to overload.\n\nPublic Speaking Anxiety – Feel nervous before presenting or speaking to large groups.\n\nImpatience – Wanting fast results can make you restless.\n\nDelegation Issues – Prefer doing things yourself rather than relying on others.\n\nEasily Distracted – Sometimes lose focus with multiple tasks.\n\nSelf-Critical – Being too hard on yourself even after good work.	Hackathons & Competitions – Platforms like e-Yantra,, and coding challenges give you exposure, learning, and recognition.\n\nLeadership Roles – part of E-Cell/coding clubs ascend helps you build management and networking skills.\n\nSkill Development – Chance to improve coding (Python, Io), public speaking, and project management.\n\nNetworking – Interactions with alumni, mentors, and industry experts open doors for internships and collaborations.\n\nFitness & Discipline – Preparing for your fitness test improves your health, stamina, and confidence.\n\nEmerging Tech – Exploring AI, IoT, and blockchain gives you an edge in future career paths.\n\nPresentation & Communication Platforms – Events, seminars, and projects give you opportunities to polish communication skills.	High Competition – Many talented peers in hackathons, techfests, and exams.\n\nTime Management – Balancing academics, projects, events, and fitness prep.\n\nResource Limitations – Limited funding, tools, or mentorship for innovative projects.\n\nTeam Coordination – Managing different opinions, commitment levels, or conflicts in group projects.\n\nStage Fear / Pressure – Nervousness during public speaking, presentations, or pitching ideas.\n\nKeeping Consistency – Maintaining focus and discipline in studies, fitness,
85	689	Fast learner	Last minute stress	Intership	Time management
86	648	Fast learner \nUnderstanding	Communication \nConfidence	Academic \nInter College \nHackathon	Talking with people and lanking of expression of my feelings in english
87	1362	Punctuality	Too much dedication	NA	NA
88	1364	N/A	N/A	N/A	N/A
89	1322	My strengths are my technical skills and my problem solving techniques.	I have weakness of public speaking but I am currently working on it.	I have received different opportunities where I have showcase my skills and practiced and improved more.	Different challenges I have faced during the hackathons that build me more stronger.
90	1325	Curious learner, organized mindset, hardworking, creative problem solver	Overthinking, difficulty in prioritising,career confusion	Opportunities iam looking is to contribute in gsoc and other summer internship	Time management is the biggest challenge iam facing
91	1323	Consistent learner with keen interest in AI, web development, and research.Good communication, presentation, and teaching skills.	Working towards enhancing English fluency and time management.\n\nAiming to develop greater self-confidence and independent problem-solving.	Wide scope in AI/ML, software development, and higher studies.\n\nOpportunities to participate in projects, seminars, and global platforms	Balancing academics, projects, and professional responsibilities.\n\nAdapting to rapidly evolving technologies and continuous learning.
92	1354	Curiosity to learn new things	Low confidence infront of large audience	Rise in ai and data analytics and research	Fast changing techniques and technologies
93	1321	Curious learner with interest in Cloud, AI, and Data Analytics.\n\nStrong focus on practical projects and applications.\n\nGood at planning, organizing, and communication.\n\nActively pursuing future-ready skills like AWS and networking.	Sometimes spend too much time on theory.\n\nDepend a bit on external guidance for tough topics.\n\nStill building coding depth and confidence.\n\nStruggle with time management across projects and studies.	Gain AWS certifications to boost career chances.\n\nBuild strong projects to showcase on GitHub/LinkedIn.\n\nUse EI club for leadership and teamwork experience.\n\nImprove communication for better confidence in interviews.\n\nExplore internships in cloud computing and related fields.	Need to stay consistent in completing projects.\n\nBalancing studies, club work, and self-learning.\n\nKeeping up with fast-changing cloud technologies.\n\nBuilding advanced coding and problem-solving skills.\n\nStanding out among many skilled peers in tech.
94	1372	My strengths are that I am a curious learner, hardworking, consistent in studies and I don’t give up until I understand things clearly.	I get a bit nervous while speaking in front of others. But I am improving on these points.	My opportunities are learning new technologies in BTech, improving communication skills, and building a good career in software.	Time management because of college.
95	370	Technical Skillset: You know Web Development (React, Node.js, Spring Boot), Java (OOP, DSA), and are learning AI/ML – a rare combo of software engineering + AI.\nCuriosity & Learning Drive: You constantly explore projects (data analysis, AI, smart systems, etc.) → strong self-learning habit.\nCreativity: You think of unique projects (YouTube tutorials, Smart Tourist Safety System, etc.) and innovative applications.\nCommunication: You can explain concepts simply (you asked for YouTube teaching channel ideas, so you can simplify topics for others).	Too Many Focus Areas at Once: You are exploring AI/ML, data analysis, hardware ideas, ethics, etc. → risk of not going deep enough in one field.\nExperience Gap: You’re still a student, so real-world project/internship experience may be limited compared to industry expectations.\nConsistency in Execution: You generate great ideas but may find it harder to finish and polish them into deployable projects.\nNetworking/Branding: You asked about LinkedIn certifications, which shows you’re still building your professional identity.	Internships & Early Career Projects: You can leverage your multi-skill profile (web + AI/ML) for internships, freelancing, and hackathons.\nYouTube/Content Creation: Teaching AI/ML/web dev → boosts personal brand + deepens your knowledge.\nSIH / Hackathons: You have interest in SIH 2025 hardware/software problems → great exposure to teamwork & innovation.\nAI + Web Fusion: With AI models now being embedded into web apps, you can stand out by combining backend + AI APIs.\nGlobal Demand: AI, full-stack, and data skills are highly in demand → strong job opportunities in India & abroad.	High Competition: Many students are learning AI/ML and web dev, so you’ll need to show projects + problem-solving skills to stand out.\nFast-Changing Tech: AI/web frameworks evolve quickly, so continuous upskilling is a must.\nBalancing Depth vs. Breadth: You need to decide whether to go deep into AI/ML research, or become a full-stack AI engineer, instead of spreading too thin.\nSoft Skills & Professionalism: Transitioning from student projects → industry projects requires teamwork, deadlines, and client-oriented thinking.
96	690	Quick learner	Patience	Hackathons	Opportunity
99	697	Focus on one thing	Multitasking	Internship	Procrastination
208	423	Teamwork\nCommunication	Underconfident in some areas	NIL	NIL
97	1332	Strong teamwork and collaboration abilities.	Sometimes overthink situations, which delays decision-making.	Growing demand for skilled professionals in technology	High competition in both academics and job markets.
104	378	Fast learner ,Resilient ,Punctual , Compassionate	Self Doubt, Hesitant to start a conversation ,Over thinker	Learning and applying new technologies or tools in the field of interest	Building good projects and securing a relevant internship
106	405	Teamwork, Focused	Gets stucked in one thing till not get completed	-	-
98	313	1. Problem-solving ability\n2. Good communication skills\n3. Teamwork and collaboration\n4. Creative thinking	1. Procrastination (delaying tasks)\n2. Public speaking nervousness\n3. Difficulty in saying “no”\n4. Time management issues	1. Growing demand for technology and IT skills\n2. Availability of online learning platforms and courses\n3. Internship and campus placement opportunities\n4. Networking with professionals through seminars and workshops	1. High competition in the job market\n2. Rapidly changing technology and need for continuous learning\n3. Balancing academic, personal, and career goals\n4. Limited practical experience compared to industry requirements
100	336	Ability to learn, adapt, and improve over time.\nProblem Solving Mindset.\nMental Resilience.	Time management challenges when balancing projects, studies, and events.\nLimited industry-level exposure and practical experience (still in learning phase).\nLack of strong networking or professional connections at early stage.\nHealth concerns sometimes affect consistency and performance.	Internships, hackathons, and technical events to build skills and portfolio.\nAccess to online resources, certifications, and global learning platforms.	Competition in academic, career, or personal life.\nUncertainty due to changing environment and trends.\nPressure from expectations of society, family, or self.\nHealth risks and lifestyle challenges.
103	684	Confident,Eager to learn new things	Overthinking	Internship	Have to get good placement
101	1360	My strengths are my communication skills  , situation handling , management,  presentation skills	.	.	.
102	422	Ability to quickly pick up new technologies,team work,time management.	Lack real-world project experience or understanding of industry practices.\nCommunication and  leadership qualities need improvement	Chance to learn in-demand skills like  programming languages,Machine learning from platforms like Coursera.	Challenge to build a decent  resume, secure internships, and keep up with peers.
105	1318	Research intern at IIITH Speech Lab with experience in speech technologies. Won 1st in Geospatial AI Challenge 2nd in YCCE Coding Relay Top 3 in Bharatiya Antariksh Hackathon. Skilled in C Cpp Python Java CV DL. Led Abhyudhya 24.0 and Antariksh Maha Yatra.	I am a self-aware person who actively works on overcoming weaknesses. I have improved several earlier limitations and am confident I will continue addressing and overcoming new challenges in the future.	IIITH internship enables AI ML research in speech and CV. Hackathon wins with ISRO VNIT offer space tech networks. GitHub GitTogether and Microsoft events connect to AI communities. Opportunities in AI ML Data Science and AI for Good projects.	Limited institutional support for external events internships and competitions. These challenges built my resourcefulness independence and determination strengthening my ability to pursue opportunities.
107	380	Research intern at IIITH Speech Lab with experience in speech technologies. Won 1st in Geospatial AI Challenge 2nd in YCCE Coding Relay Top 3 in Bharatiya Antariksh Hackathon. Skilled in C Cpp Python Java CV DL. Led Abhyudhya 24.0 and Antariksh Maha Yatra.	I am a self-aware person who actively works on overcoming weaknesses. I have improved several earlier limitations and am confident I will continue addressing and overcoming new challenges in the future.	IIITH internship enables AI ML research in speech and CV. Hackathon wins with ISRO VNIT offer space tech networks. GitHub GitTogether and Microsoft events connect to AI communities. Opportunities in AI ML Data Science and AI for Good projects.	Limited institutional support for external events internships and competitions. These challenges built my resourcefulness independence and determination strengthening my ability to pursue opportunities.
108	700	Hardworking, good listener, problem solving, positive attitude,discipline.	Improve my communication, time mangement, overthinking.	Intership,job etc.	Public speaking, balance subject, distraction, asking questions, pressure
109	1394	Good Listener , Hard worker , Quick Learner	Impatient , Tend to lose control , Slack off sometimes	Exploring Opportunities	Fluency in communication , More vocabulary , Coding & Implementation
110	1422	Good communication and interpersonal skills,\nPositive attitude and willingness to learn, Responsible, punctual, and committed to tasks, Ability to adapt to new environments quickly ,Team player with leadership qualities when needed, Creative and open-minded in approaching problems.	Sometimes I tend to overthink situations, which can slow down decision-making, but I am working on improving my confidence in making quicker choices. I also focus too much on perfection at times, which may delay tasks, yet it helps me maintain quality in my work.	This internship provides me with the opportunity to gain practical exposure to professional work culture, improve my communication and teamwork skills, and build confidence in handling responsibilities. Along with this, my certification in Digital Marketing from IIT Bombay gives me the opportunity to apply my knowledge in real-world scenarios, explore marketing strategies using AI-driven insights, and strengthen my career foundation with both technical and professional growth.	During the internship, one of the main challenges is adapting to a new professional environment and understanding organizational expectations. Balancing multiple tasks within deadlines can also be demanding, especially while ensuring quality in every assignment. Another challenge is applying theoretical knowledge in practical situations, which requires continuous learning and adjustment. However, these challenges provide valuable opportunities for growth and skill development.
111	1344	Honest and responsible , Quick learner	Less Confidence in Communication ,confused about what to do	to improve my communication skills and gain more confidence , Chance to learn new technologies and build projects	time management because of the college hours
22	355	Accurate, Supportive,  Patient, Logical, Creative ,Adaptive, Helpful, Consistent	Overthinking, Working on perfectness,\nweak Communication skills, lack in goal setting	Internship, Hackathon, certifications, Competitions.	Workload, Deadlines, Pressure, Competitions, Stress, Time-management, Distractions, Expectations.
112	331	Team player, can adapt things quickly	Get nervous while speaking	Internships	Scoring cgpa above 7.5, soft skills,coding
113	1438	Leadership skills ,team work	Fluency in English	Nill	Nil
114	332	Hardworking\nQuick learner\nTeamwork\nCommunication\nProblem-solving\nDedication\nConfidence	Procrastination\nTime management\nHesitation\nDistraction\nOverthinking\nSometimes Introvert	Skill development\nNetworking\nCareer growth\nTechnology\nLearning resources	Competition\nStress\nRapid change\nLimited resources\nBalancing tasks
115	673	God	Insecure	To grow and improve myself	Adapting to new thing's
116	359	Deep thinker, Quick learner, Good listener, Hardworker, Ambivert, Emotionally intelligent	Confidence, Over thinker, Procrastinator, Getting overwhelmed with strangers, Doubtful, Soft skills	Academics, Department, Institute, Extra-Curricular, (Sports/Cultural), Certifications, Soft skills, Internships	Recognition, Awareness, Networking
117	368	Persistence\nCreativity\nAdaptability\nCuriosity\nQuick Learner\nCommunication	Perfectionism\nTime mangement\nSocial Awkwardness	Leadership\nContinuous Learning\nSkill Building\nInternship	Overexpectation\nProper road map
118	365	Hardworking \nGrasping power\nleadership	Stage fear\nfluency in speaking	academics\nextra curricular activities	technologies
119	1407	My strengths are being a quick learner and highly adaptable, with strong problem-solving and communication skills. I work well in teams, stay calm under pressure, and am hardworking and dedicated to completing tasks efficiently.	Sometimes I focus too much on details, which can slow me down, but I am learning to balance accuracy with efficiency. I also feel a bit nervous in public speaking, though I am improving through group discussions and mentoring activities.	I gained practical experience through projects and analytics work, while roles in the Career Development Cell and Achiever’s club helped me build leadership, time management, and communication skills.	One challenge I faced was improving the accuracy of my face recognition project, which taught me the importance of fine-tuning and better datasets. Another was balancing academics with multiple certifications, which strengthened my time management and adaptability, making me more resilient and focused.
120	656	Problem solving, technical aptitude ,work ethic and dedication	Over thinking, limited pratical experience	Skills development platform, growing tech industry	High compitition,fast changing technology , resource constraints
121	651	...	..	Academics, Inter College, Department, Technical.	Languages difficulty sometime unable to grab what he/she talking. Poor in logic and programming.
122	435	Problem solving, Teamwork, Time Management	Lack of Confidence, Stage Fear, Lack of Real World Experience	Opportunities to gain practical experience through internship, to explore and develop skills in emerging areas.	Balancing academic workload with extracurricular activities and personal projects can be stressful.
139	1334	Good Speaking Skills, Team collaborative, language proficiency in English, Confident	Shy, fear of being judged	Training, Guidance in career choosing	Lack of correct teaching, problem in selecting a domain of interest
151	681	Strong academic foundation (consistent performance, meritorious student).\n\nLeadership qualities (Scouts & Guides leader, club roles, NCC, event management).\n\nConfidence and good communication (debates, speeches, presentations).\n\nActive participation in extracurriculars (sports, clubs, hackathons).\n\nCreativity + technical innovation (IoT, AI/ML, research projects).\n\nDiscipline & time management (balancing studies, projects, sports).	Over-involvement in multiple activities (can lead to stress or divided focus).\n\nSometimes perfectionist (may spend extra time polishing work).\n\nLimited preference in diet (not liking green vegetables → nutrition gap).\n\nStill building deep expertise in advanced coding (C++, AI, microcontrollers).\n\nCan feel pressure to meet very high personal expectations.	Active hackathon participation → chance for patents, research papers, networking.\n\nCollege clubs (Engineering India, ACM, Zenith) → leadership, visibility, recognition.\n\nEmerging tech (AI/ML, IIoT, Embedded Systems) → scope for specialization.\n\nMBA option (IIMs) as Plan B → career flexibility.\n\nSports & fitness → chance to represent college/university.	Balancing multiple goals (AFCAT prep, MBA, academics, coding, projects).\n\nCompetitive landscape (hackathons, exams, defense selection).\n\nMaintaining consistency in long-term preparation while managing college workload.\n\nAdapting to fast-evolving tech (keeping up with AI/ML, IoT trends).\n\nHigh expectations from self & others can create pressure.
152	1378	Teamwork , Hardworking	sometimes perfectionist, easily  trust others\ns	internships, projects , placements	lack of technical knowledge
157	1353	Consistency, Discipline, Time Management, Reliability, Adaptability	Limited Experience, Self-Doubt	Networking,Diverse Projects	Competition, Rapidly Changing Technology, Job Security, Continuous Learning
123	346	Dedicated, time management, theoretical knowledge, general\nknowledge, team management	Overthinking, communication skills	Institute level, national level, academics, co-curriculum	Aptitude, technical skills, soft skills
135	1417	I am a quick learner and can easily adapt to new tools and tasks. I am hardworking and dedicated, and I always make sure to complete my responsibilities on time. I work well as a team player and contribute positively to group efforts. I maintain a positive attitude and keep myself and others motivated. I am good with numbers and can handle calculations or data with accuracy. I have good problem-solving skills and try to find practical solutions instead of focusing only on problems.	Sometimes I become a perfectionist and spend extra time making things flawless, but I am learning to balance speed and quality. I take on too much responsibility at times, though I am improving by delegating when needed. I feel nervous in public speaking situations, but I am working on building my confidence. I tend to overthink before making decisions, but I am learning to be more decisive.	I got the opportunity to be involved in ACM and NSS, which helped me grow both technically and socially. I was part of the documentation team at different events, which improved my writing and organizational skills. I also had the chance to participate in sports, where I not only played but also led the handball team as a university player, which developed my leadership and teamwork abilities. Additionally, I completed two internships that gave me practical industry exposure. One of my biggest opportunities was getting selected to present an idea in SIH, which boosted my confidence in innovation and presentation.	I faced the challenge of balancing academics with extracurricular activities like ACM, NSS, and sports, which taught me time management. Leading the handball team was also a challenge, as I had to manage both performance and responsibility towards my teammates. During my internships, I faced difficulties in adapting to a professional environment at first, but I gradually learned to handle tasks independently. While working in the documentation team at events, I sometimes had to meet strict deadlines, which tested my patience and focus.
136	1561	Good teamwork and leadership abilities, proven through academics and extracurriculars.	Sometimes take on multiple tasks at once, which may cause stress.	Scope to build a strong professional network through internships, projects, and events.	Balancing academics, projects, and extracurricular activities effectively.
147	312	Confident, Quick decision maker	Poor communication	Internships, Job	Lack of guidance
183	385	leadership skills from organizing events in school, college, and society.\nAbility to work well in a team and coordinate with different people.	Need to improve time management under pressure.	Exposure to new technologies and tools in Computer Engineering.\n\nParticipation in college programs and events to gain practical experience.	Handling stress during deadlines or multiple commitments.
162	1357	strengths lie in its vast knowledge base, multilingual ability, and 24/7 availability, making it highly effective for quick answers, structured writing, coding, and brainstorming, while also being safe by design.	weaknesses such as limited real-time awareness, lack of personal experience, and the possibility of occasional inaccuracies.	opportunities include assisting in education, boosting productivity, driving innovation, and breaking language barriers to help people globally	it faces challenges like the risk of misinformation, overdependence by users, ethical concerns, and competition from other AI tools.
133	1383	Problem solving approach	Low Confidence, inconsistency	Availability of online course	Finding a correct path to achieve the goals
124	703	management skills	emotionally Weak	anything that can make me grow as an individual is an opportunity for me	things that make me question my willpower are the one i may call challanges
125	320	Eager to learn student, good at teamwork, considering it as an opportunity to learn something new from peers, presentations, and adaptability.	Still exploring directions in domains	National platforms, higher studies, emerging tech fields	balancing academics and career building, standing out from others, and high competition
127	1429	My strengths include being a fast and adaptable learner, allowing me to quickly acquire new skills and adjust to different situations. I am also highly motivated and detail-oriented, which helps me to produce high-quality work and effectively solve problems. My strong interpersonal and communication skills enable me to work well in a team and collaborate with others.	I sometimes struggle with taking on too many tasks at once, which can lead to a risk of burnout if not managed carefully. I'm actively working on improving my time management and prioritizing skills to become more efficient. Another area I'm focusing on is becoming more comfortable with public speaking to enhance my professional communication abilities	The rapid growth in the tech industry presents a significant opportunity for professional growth and skill development. By taking online courses and earning new certifications, I can stay ahead of industry trends and increase my value. There is also potential to build a professional network by attending conferences and connecting with experts in my field, which could lead to new career avenues.	A key challenge is the highly competitive nature of the job market, which requires continuous self-improvement and a unique skill set to stand out. Additionally, the fast pace of technological advancements means I must dedicate time to consistently learn and adapt to new tools and platforms to remain relevant. Navigating this constant change can be demanding.
129	407	Good at problem-solving and logical thinking.\nStrong interest in learning and improving skills.\nPunctual and disciplined in academic work.\nComfortable with technology and new tools.	Need to improve public speaking / presentation skills.\nLimited real-world industry exposure so far.\nSometimes take on too many tasks at once.	Internships and online courses to upskill.\nAccess to department resources, labs, and mentors.\nNetworking with alumni and professionals.	High competition for jobs and internships.\nRapidly changing technology requiring continuous learning.\nBalancing academics with extracurricular/side projects.
137	340	I have strong foundation in programming basics like in C , Python and also in web development languages like html , css and javascript . I am curious and motivated to explore new technologies .	Limited exposure to real-world projects and internships. I am still developing problem-solving and competitive programming skills. I have lack of clarity in specialization in AI , WEB dev and cybersecurity .	Participation in hackathons , coding contents , and innovation challenges. I did courses on NPTEL with certification .	High competition among CSE student across the country . Keeping up with rapidly changing tools, frameworks, and technologies . Facing difficulties in balancing academics with practical skill-building . I have faced pressure of not being able to study day before the exam .
138	1382	leadership qualities, communication skills	inconsistency, eye contact	presenting myself	inconsistent
141	1343	Communication \nAdaptation \nUnderstanding	Quick response	.	.
143	699	Hardworking and eager to learn\n\nPositive attitude and adaptability	Need to improve communication and confidence	Internships and projects to gain practical knowledge\n\nCollege activities to build teamwork and leadership	Overcoming hesitation while speaking in public\n\nBuilding confidence consistently
149	1371	Communication, Leadership, Eager to learn new things	Coding, technical	Availability of online courses and resources	Keeping up with rapidly growing technology, Balancing academics and projects together
153	1336	Problem solving and logical thinking	Time management between academic, projects and personal growth	Chance to build projects that stand out for placement/higher studies	Balancing academic pressure with skill development
155	1363	Good in coding, web development	Communication, collaboration	Not any till now	Communication with peers
154	1370	Strong foundation in programming (C, Python, Java,  SQL, Spring Boot).\n\nHands-on experience with real projects (apps, website).\n\nPractical learner – you prefer building projects to understand concepts.\n\nCompetitive exposure – Code Arena, hackathons, SIH prep.\n\nLeadership and teamwork skills (leading app dev team, club management).\n\nActive in both academics and extracurriculars (football, athletics, club events).\n\nRanked 1st in your college year, showing strong academic ability.	Sometimes spread across many domains at once, which may dilute deep expertise.\n\nProjects are strong but some need polished deployment (UI/UX, documentation, hosting).\n\nLimited exposure to industry-standard frameworks/tools beyond what you’ve explored (e.g., advanced DevOps, cloud).	.Huge scope in SIH, hackathons, ACM, and internships to gain recognition.\n\nCan expand GoPixel into a real-world startup solution.\n\nLearn React, React Native, and Spring Boot for full-stack + mobile dev mastery.\n\nBuild a strong GitHub/portfolio from your projects for internships and placements.\n\nNetworking through clubs, events, and competitions.	.Tech field is highly competitive; falling behind in new technologies can be risky.\n\nIf project ideas stay at prototype stage without scaling, impact may remain limited.\n\nBalancing academics, projects, and extracurriculars might cause burnout.\n\nDependence on self-learning only without mentorship could slow down growth
126	708	Time Management\nPatient	Public Speaking \nProcrastination	Hackathons\nProjects\nGood Exposure	Social Media Distraction
130	649	Teamwork \nUnderstanding \nGood learner	Overthinking \nProcrastination \nLess confident	Technology and innovation \nSkill growth \nPersonal growth	High competition \nLimited networking
184	379	Problem solving ability \nQuick learner and adaptive\nWeb Development knowledge	Limited industry exposure \nTime management issues\nSoft skills improvement	Skill expansion \nOpen source contribution \nGrowing tech industry	Balancing academic with skill building
140	1535	Patience in problem-solving and learning.\n\nPunctual and disciplined in completing tasks.\n\nQuick to adapt and eager to learn new skills.	Sometimes overly detail-oriented, which may slow progress.\n\nNeed to improve handling of technical challenges under time pressure.	Exposure to AI, NLP, and OCR technologies in real-world applications.\n\nScope to develop expertise in vessel tracking and maritime surveillance.\n\nOpportunities for presentations, publications, and research recognition.	Adapting and upgrading to new technologies quickly.\n\nLearning and implementing new concepts under project deadlines.
142	416	Quick learner and adaptable to new technologies.\nGood communication and leadership skills.\nStrong problem-solving ability.\nAbility to work well in a team as well as independently	Sometimes overthink and take extra time in decision-making\nTendency to multitask too much, which can reduce focus.	Wide scope to learn new technologies in my field.\nCollege projects, internships, and clubs provide hands-on experience.\nNetworking opportunities with peers and professionals.\nAvailability of online resources and certifications to improve skills.	Staying consistent with time management due to busy schedules.\nFacing competition in academics and career opportunities.\nBalancing academics with extracurricular and personal growth activities
150	432	Communication and confidence	Laziness	.	.
156	1347	Optimism,discipline	Time management,communication skills	Internships, certifications, soft skills	High competition,automation in industry, rapid technology changes
159	434	Confidence	Laziness	.	.
160	1384	Communication skills \nTeam work \nAmiable \nEvent manager\nCritical thinking	Procrastination (rarely) \nOverthinking	To grab technical skills which will boost my career	To update my knowledge in coding and tech industry
161	1345	C Programming, Python Basics, Database Management, Circuit Design	Soft skills, stage daring, project management	Hackathon Participation, Internship Experience, Research Projects, Skill Certification	Time Management, Rapid Technology,\nCompetitive Exams
128	387	Team player.\nConsistent and disciplined in work.	Sometimes take extra time to build confidence in public speaking.\ncurrently working on improving my problem-solving skills and coding efficiency	High demand for full-stack developers in the tech industry.\nMore chances to join hackathons, internships, and open-source projects to gain experience.	Balancing academics, projects, and skill development
131	428	My strength is my determination over my goals and excitement over learning a new skill. My problem solving skills and my competitive nature together makes me ahead of what I was yesterday.	I'm a slow learner, it takes me time to learn new skills.	I'm ready to grab any opportunities I get. I've participated in Institute level hackathons. One in IIIT nagpur that was Women's hacakthon , other one was in reshimbagh.	As a team we've faced many challenges like learning new technology on time that we were not prepared of. Other one was to make it on time.
134	1386	Consistent, punctual, and reliable Strong management and organizational skills Quick learner with diverse technical expertise (AI, Data Science, IoT, Blockchain, etc.) Good teamwork, leadership, and communication skills	I can be a perfectionist, which slows me down, though it helps me deliver quality work. I used to hesitate in delegating, but I’m learning to trust and empower teammates more. I sometimes get deeply focused on details, but I’m working on balancing detail with efficiency. I’ve explored many areas of technology, and now I’m working on specializing more deeply. I can be a little self-critical, but I use that to push myself to grow and improve.	Hackathons, internships, and forums give you strong platforms for learning and networking. Certifications and continuous learning open doors to higher roles and specialization. Leadership roles in forums and clubs help build professional visibility and teamwork experience.	Managing time effectively while balancing academics, projects, and extracurriculars. Choosing one core technical domain to specialize in for long-term career growth. Avoiding overcommitment by learning to say “no” and focusing on priorities. Handling pressure during multiple deadlines without compromising work quality.
145	363	Can code. Working on personal projects for a better approach to problem solving, logically strong.	Very much perfection-centric, often lose interest in some unrelated stuff.	I have done anchoring in some college events, has made a fully functioning website for mindroid magazine, proved myself in many micro competitions (in debate, presentation, pitching).	Lack of time, can learn anything but scared it they lose their trend.
146	1381	My strengths lie in being adaptable and eager to learn, which helps me grasp new concepts quickly. I have a good foundation in programming through C and Java, and I am currently expanding my skills in C++, SQL, and backend development. I maintain consistency in academics while preparing for GATE, and I also enjoy working on projects such as an Online Fitness Trainer Booking System and a Carbon Footprint Tracker. Along with this, my patience and dedication, especially while teaching younger students, give me an added edge.	At the same time, I am aware of my weaknesses. I often face stage fear, which makes me hesitant during presentations, and I sometimes struggle with vocabulary and pronunciation in English communication. Self-doubt occasionally holds me back from performing at my full potential, and I find time management challenging due to long college hours. Additionally, I am still in the process of strengthening my competitive programming and problem-solving skills.	I see several opportunities ahead. With the growing demand for data analysts and backend developers in India, I have the chance to build a strong career in these fields. The upcoming semesters will open doors for internships and placements, and my early GATE 2026 preparation gives me an advantage for higher studies or PSU jobs. Networking through LinkedIn, hackathons, and technical clubs, along with contributing to live projects on GitHub, can help me gain more exposure. My college also provides opportunities through seminars and project presentations, which I can use to improve my confidence and visibility.	There is intense competition in both GATE and campus placements, which requires consistent effort. Balancing academics, GATE preparation, and personal projects with limited time is demanding, especially as technology trends keep changing rapidly. Overcoming personal barriers like stage fear, self-doubt, and communication gaps is another challenge I need to work on. Lastly, managing stress and maintaining my health during this phase of preparation will also be crucial.
148	1365	Decision making	English communication	Event organising	Interview
163	1445	Eager to learn practical things	Nothing	..	..
164	1376	NA	NA	Na	Na
165	349	Hardwork	Academic	Hackathon	Difficulty in studying
166	1339	Persistence & Ambition	Less confidence in communication	I go to intership (haydrabad)	Travelling
167	337	Listening skill	Consistency	Internship	Consistency
168	321	Listening carefully	Communication skills \nStage fear	No opportunities	No challenges
169	1359	Good at designing, critical thinking, hardworking	Can't say no to people, less interactive	Participating in events, hackathons and doing some projects	Lack of experience and poor communication skills
170	652	Communication, Public Speaking, Grasping new concepts easily, Analysing, Writing Skills	Confidence, Fear, Anxiety, Motivation, Distraction	Competitive Examinations, College Examinations	Anger Issues, Depression, Screen Time
171	335	Strengths: Problem-Solving, Technical Skills (HTML, CSS, JavaScript, Python, C/C++, Java, SQL, Power BI), Arduino & Tinkercad, Canva & AI Tools, Project Management, Adaptability & Quick Learning, Teamwork & Communication	Weaknesses: Limited exposure to large-scale projects, Public Speaking / Presentation skills, Overthinking during problem-solving	Opportunities: Learning advanced AI/ML technologies, Gaining experience in full-stack web development, Participating in hackathons and tech competitions, Networking with industry professionals and mentors, Data Science projects, Exploring IoT and Embedded Systems projects	Challenges: Keeping up with rapidly evolving technologies, Managing multiple projects simultaneously, Gaining practical exposure in large-scale industry projects, Balancing academic learning with hands-on practice
172	1346	Positive attitude towards challenges\n\nQuick learner and adaptable\n\nGood problem-solving skills	Sometimes inconsistent in following a fixed routine	Growing career opportunities in Java Development & Web Development\n\nChance to improve skills through online platforms and college workshops	Balancing time between DSA practice, and Web Development\n\nMaintaining consistency in daily routine
173	1329	I am a quick learner with good problem-solving skills, strong communication abilities, and the ability to work both independently and in a team.	I sometimes overthink decisions and tend to take on multiple tasks at once, which can affect focus.	I have opportunities to grow by learning new technologies, gaining certifications.	Managing multiple tasks at once, adapting to new situations quickly, and keeping up with fast-changing technology.
174	663	Communication	Focus	Project building	Maintaining focus
175	1352	Quick learner and highly adaptable.\nStrong coding and problem-solving skills.	Can overthink small details sometimes.\nNeed to improve time management under pressure.	Research projects in backend & ML.\nNetworking with professionals and open-source contributions.	Keeping up with fast-changing tech trends.\nBalancing learning, projects, and competitions effectively.
158	433	Positivity	Emotions	.	.
144	438	Curiosity, Adaptability	Self-Doubt	Skill Development	Maintaining Consistency
177	427	Dedicated and Motivated to solve new problems and learn new things.	Procrastination	Internship Opportunities	-
178	413	Problem solving, programming knowledge,quick learner	Need to improve communication, limited real world project experience	Growing demand ,online resources ,open source and freelancing	Competition, keeping up with new tech
182	400	Positive attitude, time management, creativity.	Public speaking nervousness, procrastination	College level and inter college level opportunities	Hesitation  in approaching new people, Public speaking.
190	425	Curious learner,goal oriented, analytical thinker	Overthinking,time management risk,delegation difficulty	Interdisciplinary career path, higher studies and research, hackathons and competitions	High competition,time management, balancing multiple interests
196	375	Hardworking, Teamwork	Procrastination	Not sure	Procrastination
202	1416	One of my strengths is logical thinking. I'm naturally good at recognising patterns and breaking down complex problems into smaller manageable steps. Infact I enjoy applying this skills outside my academics as well, like i enjoy playing sudoku.	Talking about weakness, I would say Perfectionism is one, I spent extra time to put things out there until I feel like it's 100% perfect. But I have realised that in today's fast growing and dynamically changing world efficiency is...if not less but equally more important, so I'm learning to balance both. But to overcome this, one thing that I have learnt is prioritising tasks and keeping it simple.	This challenge provides the opportunity to enhance time management, prioritize tasks effectively, and deliver high-quality results within deadlines.	Adapting to a fast-paced environment while balancing perfectionism with efficiency has been a key challenge.
213	393	Excellent football skills; strong teamwork, discipline, and physical fitness.\n\t•\tTalented musician (guitar, piano, drums) – creativity, stage presence, and ability to engage people.\n\t•\tStrong interpersonal and social skills (likely to bond well with peers due to football/music).	Limited technical/academic skills compared to peers in a CSE/engineering environment.\n\t•\tMay struggle with coding, projects, or placement opportunities requiring tech expertise.	Can pursue careers or side hustles in sports (coaching, leagues, fitness training) or music (bands, teaching, production).\nScope for building technical skills gradually while leveraging extracurricular strengths.	Competitive job market may undervalue non-technical skills if technical base remains weak.\nRisk of being overshadowed academically by peers\n\nPressure to balance passion and academic requirements simultaneously
179	1341	Communication skills, soft skills, management skills	Technical skills	Upcoming mangement internships and Cat exam for MBA	Gearing up with Academics , higher studies and internship simultaneously
180	391	Open mindedness, willingness to learn, empathy and good listening skills.	Public speaking nervousness, procrastination at times.	College level and inter college level opportunities	Procrastination or delays under low motivation
181	1426	My strengths are my technical skills and quick adaptability. I have hands-on experience in Python, AI/ML, and Web Development, and I have successfully completed projects like an AI Proctoring System and an Excel Analytics Platform. I am a fast learner, self-motivated, and I like to stay organized, whether it’s through tracking my progress, planning my schedule, or preparing detailed presentations. I also have good communication skills, which help me explain technical concepts clearly.	One weakness I’m working on is that I sometimes take on too many tasks at once, which affects my focus and time management. I also feel I need more real-world industry exposure since most of my projects have been academic or self-driven. At times, I tend to be a little less confident in interviews, but I am actively improving this through practice and experience.	Right now, I see strong opportunities for myself because AI/ML and Web Development are in high demand in the industry. Being in my sixth semester, I am well-positioned to apply for internships and prepare for placements. Hackathons, certifications, and networking through GitHub and LinkedIn also provide me with platforms to showcase my work and build connections. In the long run, I also see opportunities in pursuing higher studies or certifications to strengthen my career path.	The main challenges for me are the high level of competition in the industry and the need to maintain consistency while balancing different areas like coding, projects, and preparation for exams. Another challenge is finding the right balance between exploring multiple domains, like AI and web development, while still going deeper in each. However, I view these challenges as areas that push me to grow further, and I’m confident I can overcome them with consistent effort.
186	1366	I am a quick learner with strong problem-solving skills, good knowledge of C, C++, Java, and web technologies, and the ability to adapt and work well in a team.	Sometimes lack confidence while speaking in front of new people, but improving through practice and presentations.\n\nCan be too focused on details, but learning to balance with deadlines.\n\nTake time to adapt in unfamiliar situations, but once comfortable, I perform strongly.	My college provides me the opportunity to enhance my technical skills, explore projects in programming and web development, and grow through seminars, workshops, and teamwork.	A major challenge for me is building more confidence in public speaking and handling pressure, but I am working on it through practice, teamwork, and active participation in college activities.
188	419	Problem solving ability,teamwork and collaboration,adjustability,creativity and innovation,curiosity and eagerness to learn	Limited experience, communication, overthinking	Attending workshops,online learning,leadership roles in clubs/events,higher studies and certifications	High competition,limited resources and exposure,balancing academics with hackathons and internships
189	1373	Strong knowledge of C and C++ programming.\nHands-on experience with web development (Node.js, Express, PostgreSQL, UI/UX design).\nExperience in hackathons & projects \nGood problem-solving and analytical skills.\nActive participation in events and teamwork spirit.\nAbility to adapt and learn new technologies quickly.	Limited industry internship/work experience so far.\nStill exploring a specific domain specialization (AI, Web Dev, etc.).\nNeed improvement in advanced frameworks/libraries (React, Django, ML frameworks).\nSometimes face time management issues while handling multiple projects.\nPublic speaking/presentation skills can be further polished.	Increasing demand for AI, IoT, and full-stack developers.\nHackathon participation can lead to networking and internships.\nInternship opportunities during semester breaks.\nPossibility of contributing to open source projects to build portfolio.\nScope to pursue higher studies, certifications, or research	High competition in the tech industry.\nRapid technological changes requiring constant upskilling.\nBalancing academics, projects, and personal growth.\nDifficulty in standing out without strong internship experience.\nUncertainty in choosing the best career path/domain.
194	1355	Curious learner: You actively explore multiple fields (C++, PostgreSQL, React, data analytics, web dev, cloud computing).\n\nStructured approach: You like organizing projects (e.g., folder structure in React, study notes).\n\nEntrepreneurial mindset: You think beyond coding—like your smart ticketing assistant for museums.\n\nConsistency in self-improvement: Practicing coding on CodeChef, studying SEPM, VEC-II, and entrepreneurship notes shows dedication.\n\nClear vision: You connect your skills (web dev + cloud + data analytics) with your career goals.	Scattered focus: Sometimes unsure about where to put more energy (web dev vs. cloud vs. analytics).\n\nEarly stage in coding: Still at beginner/1-star level on platforms like CodeChef.\n\nDependence on structured material: You prefer verified, PDF-based answers, which might limit independent exploration.\n\nLimited practical exposure: More focus on theory/projects than real-world deployment or contests.	..	Balancing multiple skills: Risk of spreading too thin instead of mastering one core area first.\n\nCompetition: Data analytics, web dev, and cloud are crowded fields. Standing out requires specialization + strong projects.\n\nTime management: Balancing studies, coding practice, and entrepreneurial projects can get overwhelming.\n\nTransitioning from learner to implementer: Applying theory to real-world problems will be the big step.
195	323	Honestly,self-awareness,patience	Procrastination,time management	Skill development workshop,technical events	Time management,academics
197	1351	Critical thinking and problem solving	puntuality	na	na
201	345	patience \ndedication \nambivert	overthinking \nfear \nanxiety\nangry	skill development workshop technical events certification softskills internship	time management
204	395	Structured Learning Approach \nEngages in both technical (coding, AI, software projects) and creative (music, filmmaking, storytelling)	Lack of Focused Depth,Stress & Self-Doubt in Academic/Peer Contexts	competitive exams, research, and higher studies	Balancing Academics with Extracurricular Pursuits
205	1444	Teamwork, Adaptability and Time Management	Sometime Focusing too much on one thing	Java Development, Software Development	To understand deep down technologies.
185	377	Good at explaining things with Real life examples.	Not a good public Speaker	Opportunity to grow	Hard to Networking
187	388	creative, curious, dedicated, detail-oriented, adaptable, analytical, innovative, organized, persistent, tech-savvy, artistic, eager to learn and grow.	poor attention span, getting easily distracted, procrastination, time management issues, inconsistency, and losing motivation mid-project.	UI/UX design, graphic design, frontend development, motion graphics, AI-powered apps, leadership, and building a strong personal brand.	staying focused, managing time effectively, balancing multiple interests, avoiding burnout, and staying consistent while learning and building projects.
192	1437	hardworking	nothing	..	///
193	1395	Adaptability, flexibility, Communication	Time Management	ACM Event Member	Multi Tasking
199	389	-Strong English and communication skills.\n-Solid academic standing\n-Competitive Programming enthusiast\n-Quick learner	-No internships yet.\n-Academic dip after 10th	-Can pivot to higher studies abroad\n-Planning on pursuing an MBA program	-Competing with students from top tier institutes \n-Financial hurdles if pursuing MS abroad
200	392	Good Communication Skills \nTeam work	Nil	Nil	Nil
206	1406	Problem solver\nQuick learner\nGood listener	Low confidence \nDelegation	Blockchain devlopment, software development	To deep down in new technologies.
209	1403	Time Management\nadaptability\nproject management	Over Analyze the problem\nMulti Tasking	1. Adobe Hackathon\n2. Juspay Round 2	1. General Tech Career Objective\n3. Placement / Company-Oriented\n4. Balanced & Practical
211	1391	Eagerness to Learn, Consitency, Hard Working,	Slow Start , Perfectionism Trap	Building a Strong Foundations for Future Jobs	Low Confidence , Inconsistent Study Habits
207	1411	I’m creative, quick to learn, and sharp-minded with strong technical skills in DSA (C++), Python, AI/ML, and web development. I bring enthusiasm and fresh ideas, adapting well to new challenges.	I tend to overthink and sometimes delay decisions. I also find it hard to delegate and want to improve my public speaking to communicate technical ideas more clearly.	I’m eager to deepen my skills in AI/ML and advanced algorithms, take on leadership roles, and improve communication to work better with diverse teams.	Balancing detailed analysis with timely decisions and keeping up with fast-changing tech are ongoing challenges. Explaining complex tech to non-experts also pushes me to grow.
214	1390	I am analytical, detail-oriented, and a quick learner	I tend to over-focus on perfection, which slows me down	I get opportunities to showcase myself in various hackathons like SIH, Also worked at Edunet Foundation as a data analyst.	The main challenge I faced which to to get update with lerarn new tech stack like in project integrating APIs, debugging errors, or coordinating with teammates. I overcame it by researching, discussing with peers, and applying problem-solving strategies.
217	1414	Problem-solving , Programming skills (Java, Spring Boot, DSA, OOP) ,Backend development ,Quick learner ,Enthusiastic & motivated ,Adaptability,Teamwork & collaboration	Less Industrial Experince	IT demand, AI/ML growth, Internships, Certifications, Global roles	Competition, Fast tech changes, Market fluctuations
219	1387	Strong foundation in Blockchain Development\n\nSmart Contracts, DApps, Ethereum, ERC20/ERC721 Standards, Web3 Integration\n\nDeFi concepts like P2P protocols, liquidity pools, and wallet interaction\n\nMachine Learning & Deep Learning Expertise\n\nCNNs, RNNs, Transfer Learning, Computer Vision\n\nModel Optimization & Deployment\n\nHands-on with TensorFlow, Keras, PyTorch, Scikit-learn, OpenCV\n\nData Mining & Analytics\n\nData preprocessing, feature engineering, visualization (Matplotlib, Seaborn, Plotly)\n\nStrong ability to turn raw data into actionable insights\n\nProgramming Skills\n\nProficient in Python, C/C++, R, Solidity\n\nExperience with frameworks like HardHat & Truffle\n\nBackend & database management (SQL, PostgreSQL, NoSQL)\n\nSystem Design Knowledge\n\nUnderstanding of load balancing, caching, API gateways, database sharding, scalability patterns\n\n\nHighly adaptive & committed to continuous learning\n\nProblem-solving mindset with a passion for real-world applications of technology\n\nAutomotive enthusiast & financial literacy advocate – showcasing curiosity beyond academics\n\nStrong communication and presentation skills (evident from workshops and event coordination)	Limited Industry Experience\n\nSince you’re still in college and most of your work is academic or project-based, you can say:\n“I have limited professional experience, but I’m eager to apply my academic knowledge and projects in real-world scenarios.”\n\nOvercommitting to Projects\n\nYou’ve done a lot (blockchain, ML, IoT, robotics, leadership). You can frame it as:\n“Sometimes I overcommit to multiple projects at once, but I’m learning to prioritize and manage time better.”\n\nDetail-Oriented to a Fault\n\nExample:\n“I tend to spend extra time perfecting details, but I’m working on balancing perfection with efficiency.”\n\nPresentation Anxiety (if true)\n\n“I used to feel nervous presenting technical work, but after leading workshops/events, I’m improving my confidence.”\n\nStill Developing Low-Level System Design Skills\n\nYou mentioned HLD knowledge but still expanding into LLD. This can be framed as:\n“I have strong knowledge of high-level system design, and I’m actively working on strengthening my low-level design expertise.”	Growing Demand in Blockchain & Web3\n\nWith rising adoption of DeFi, NFTs, and smart contracts, your blockchain expertise puts you in a great position to contribute to real-world applications and startups.\n\nAI & Machine Learning Expansion\n\nRapid growth in computer vision, deep learning, and NLP means more chances to work on cutting-edge problems (e.g., surveillance, healthcare AI, predictive analytics).\n\nStartups and Innovation Ecosystems\n\nHackathons, research incubators, and startup accelerators (like ETHIndia, Devfolio, or university-based labs) are perfect opportunities to showcase your projects and even get funding/collaborations.\n\nAcademic to Industry Transition\n\nSince you’re still pursuing your B.Tech, internships, workshops, and industry collaborations offer opportunities to apply classroom knowledge in practical environments.\n\nNetworking & Leadership Platforms\n\nYour past leadership roles (Rotary Club, ACM workshop coordinator) give you opportunities to expand your network, mentor juniors, and connect with professionals.\n\nOpen-Source Contributions\n\nMany blockchain, ML, and IoT projects are open-source. Contributing could help you build visibility in the developer community.\n\nEmerging Tech Synergy\n\nCombining your skills (Blockchain + AI + IoT) could create unique solutions (e.g., decentralized AI systems, blockchain-secured IoT devices) — a space with high growth potential.	Transitioning from Academic Projects to Industry Scale\n\nMost of your work so far is in the form of academic or prototype projects. Scaling them to industry-grade, production-ready systems could be challenging at first.\n\nRapidly Evolving Tech Landscape\n\nFields like blockchain, AI, and DeFi evolve extremely fast. Keeping your skills updated and avoiding obsolescence is an ongoing challenge.\n\nHigh Competition for Entry-Level Roles\n\nMany engineers are entering AI/blockchain, so standing out requires strong portfolios, open-source contributions, and networking.\n\nBalancing Breadth vs. Depth\n\nYou have explored many domains (Blockchain, ML, IoT, Robotics, System Design). The challenge is deciding whether to specialize deeply in one area or remain a versatile generalist.\n\nResource Constraints for Innovation\n\nSome of your interests (like deep learning and blockchain deployments) may require high computing resources, funding, or industry-grade datasets, which can be difficult to access as a student.\n\nSoft Skills in Industry Collaboration\n\nWhile you have leadership experience, adapting to cross-functional teams in corporate settings (product managers, designers, business stakeholders) might be new and challenging.
221	1581	Ready to learn, Hardworking, Good behaviour,polite,good communication, empathy	Overthinking, introvert,	I got an opportunity to participate in blood donation camp and I also won a competition in college.	I have a year gap and completed engineering in 5 years .
225	430	Skilled in programming fundamentals, developing AI concepts, and building innovative IoT projects, combined with strong teamwork and leadership abilities	Working to improve professional self-presentation skills and confidence for communication challenges	Ongoing academic projects and event participation offer chances to develop problem-solving ability and technical leadership	Mastering SRS preparation and handling technical documentation for systems such as online doctor appointment platforms
226	394	learning fast	time management	anything	every challenge
227	390	1. Personal strengths:empathy, or optimism.\n2. Skill-based strengths: Abilities like problem-solving, communication, or leadership.\n3. Physical strengths:endurance, agility,  strengths can lead to personal growth, success.	1. Personal weaknesses: self-doubt, procrastination, or impulsiveness.\n2. Skill-based weaknesses: Areas where someone may lack knowlege or expertise.\n3. Physical weaknesses:physical abilities or health.	1. Career opportunities: Advancements, new roles, or professional growth.\n2. Personal opportunities: Chances to learn, develop skills, or build relationships.\n3. Financial opportunities: Investments, business ventures, or financial growth.	1.Personal challenges: Overcoming fears, building resilience, or achieving personal goals.\n2. Professional challenges: Meeting deadlines, solving complex problems, or adapting to new roles.\n3.Physical challenges: Pushing physical limits, overcoming health issues, or achieving fitness goals.\n\nEmbracing challenges can lead to growth, learning, and development.
229	362	Presentation, public speaking, confidence, vigilance, leadership.	Procrastination, laziness,self doubt,focus, perseverance.	Academics,knowing dept, institute, general knowledge,extra curricular.	Hackathons, competitions.
232	1388	Hardworking person	Lazyness	in Webdevelopment in java	addressing the ethical implications of new technologies like AI.
198	412	Time Management , Teamwork	Public speaking	.	To adapt the new working enviorment quickly
191	410	Quick learning,	Communication skill	.	To grab placement
203	1583	•Curious about new technology\n•Teamwork and adaptability\n• Hardworking and consistent	Over-dependence on guidance\nTime management	•To improve communication skills\n•Explore latest tech fields like AI, IoT, and Cloud	Reducing dependency and becoming more confident in independent problem-solving
210	396	strong leadership & teamwork, strong Communication skill,creativity & innovation,	perfectionism , overcommitment	networking opportunities, leadership roles ,digital and online Platform	Time Management Pressure , high compitition in nboth professional and creative field
212	1361	Curiosity & Drive: You don’t settle — you dig deeper, ask “why,” and explore beyond the surface. That makes you a natural learner in tech.\n\nProductivity-Oriented: You value efficiency, avoid unnecessary loops (in life and in code). That keeps you focused.\n\nAdaptability in Tech: Comfortable experimenting with different OS, tools, and coding approaches.\n\nCommunication Edge: You like expressive, structured answers and can translate complex things into understandable language — useful for teamwork and leadership.	Impatience with Repetition: While it pushes you toward efficiency, it might trip you up when a concept needs brute-force practice.\n\nOverthinking: That curiosity can sometimes spiral into analysis-paralysis.\n\nPerfectionism in Output: You might delay progress because you want things “just right.”\n\nLimited Real-World Exposure (for now): Like many students, most learning is academic — applying it in messy, real-life projects can feel like a challenge.	-	Fast-Changing Tech: CS fields evolve at lightning speed. Keeping up can feel overwhelming.\n\nDistraction & Burnout: Curiosity can scatter focus across too many tools/fields if not managed.\n\nCompetition: The field is crowded, so standing out requires consistency and unique projects.\n\nBalancing Depth & Breadth: Choosing between being a specialist (deep in one area) or generalist (across many) is always tough.
215	1435	Team Work, Supportive, Disciplined	Stage Fear	NIL	NIL
218	445	Critical thinking, analysis, etc	No.	Startup cofounder.	Everyday is a challenge.
222	420	Hands on learning and skills development through IoT/AI-ML projects, leadership and teamwork, active participation in competitions	Limited advanced coding expertise, occasional time management	Growing demand in AI/ML, MBA and placement prospects, networking through clubs/competitions	High competition in exams and jobs, need for continuous upskilling, balancing academics with career goals
224	1330	Curious Learner – You always want to know why and how things work, not just accept them as they are. That curiosity helps you grow faster than most people.\n\nDetermined & Persistent – When something doesn’t work out, you don’t give up easily. You try again, look for different angles, and keep going until you figure it out.\n\nOrganized Thinker – You like to put things in order, break them into steps, and understand them clearly before acting. This helps you avoid confusion and make steady progress.\n\nForward-Looking – You don’t just live in the moment—you prepare for what’s ahead. You think about your future and work towards it in advance.\n\nAdaptable – You’re comfortable stepping into new areas, even if they’re unfamiliar. You adjust quickly and are open to learning something new.\n\nDetail-Oriented – You care about the little things, not just the big picture. That makes you more thoughtful and thorough in whatever you do.	Overthinking – Since you like details and clarity, you might sometimes spend too much time analyzing instead of just acting.\n\nImpatience with Slow Progress – Because you’re eager to grow and learn, you might get frustrated if things take longer than expected.\n\nTaking on Too Much – You explore many areas at once (which is a strength), but it can also stretch your focus and make it harder to go deep in one area at a time.\n\nSelf-Critical – You seem to want things to be “just right.” That’s good for quality, but sometimes it may make you hard on yourself.\n\nEasily Drained by Repetition – You seem to enjoy new challenges, so doing the same thing again and again might bore or frustrate you.\n\nReluctant to Ask for Help – Since you’re persistent, you might keep trying on your own for too long, even when asking for help could save time and stress.	Learning & Growth – Your curiosity gives you the chance to constantly expand your knowledge and skills. You can turn almost any situation into a learning opportunity.\n\nLeadership Potential – Because you’re organized and detail-oriented, you could naturally guide others, help them understand complex things, and be seen as reliable in teams.\n\nBuilding Strong Connections – Your adaptability means you can get along with different kinds of people, opening doors for friendships, teamwork, and networking.\n\nFuture Security – Since you’re forward-looking, you can prepare better than most for your career, personal goals, or even unexpected changes. That gives you a head start in life.\n\nCreative Problem-Solving – Your persistence mixed with curiosity creates the chance to solve problems in unique ways that others may miss.\n\nPersonal Balance – By being aware of your weaknesses (like overthinking or impatience), you have the opportunity to build emotional resilience, patience, and balance in life.	Balancing Depth and Breadth – Since you like exploring many things, the challenge is not spreading yourself too thin and missing the chance to master one area deeply.\n\nManaging Time & Energy – Your persistence can make you spend a lot of time on one problem. The challenge is knowing when to step back, rest, or ask for help.\n\nHandling Stress – Being self-critical or impatient with progress can sometimes create pressure or frustration, which may affect your confidence.\n\nStaying Consistent – Curiosity gives you a strong start, but the challenge is maintaining the same energy in the middle of long or repetitive tasks.
228	1425	Quick learner, hardworking, adaptable, and good at problem-solving.	Sometimes overthink and focus too much on details;	Scope to grow through continuous learning, skill development, and active participation in projects.	Managing time effectively and keeping pace with rapidly changing technology.
231	1317	I can handle any situation with calm mind and proper decision	No	I always take every opportunity and try my best to do it	I like to take challenges and complete it
216	418	Communication, mutual and emotional understanding, Determined, Persistent, Solution Focused, intrested in learning new things , dedicated attitude	Laziness, lack of time management,	Creative Field, educational and research , Networking solutions, problems solving roles	Being taken advantage, competitive environmental may undervalue efforts
220	1442	Strong technical foundation (C,C++,Web Dev,MERN)\nDiverse project experience\ncontinuous learner(GATE,DSA)	Limited industry exposure\nneed deeper specialization\ntime management between gate and projects\nsoft skills improvement	Internships and placements in fullstack\nhigher studies\nportfolio and github showcase\nhackathons and networking	high competition \nfast changing tech trends \nbalancing academics and career goals\nimproving teamwork and communication
223	1443	communication	Time management	Internships	Multi Tasking
230	1584	Hardworking, quick learner, good problem-solving skills, team player, adaptable, public speaking.	Impatient when work is delayed	Growing tech industry, chance to work on real-world projects, continuous learning resources available.	High competition, staying updated with fast-changing technology, managing time effectively.
233	696	Time management \nCommunication	Procrastination \nLacks clarity\nWrong decisions	Academics,extra curricular(sports,cultural),departmental,institute,inter clg,technical, soft skills,internships,certification	Not consistent \nLazy\nNot a multi-tasker
234	1380	Ability to work in a team with cooperation, Creative mindset with interest in design and technology, Quick learner and adaptable to new tools/technologies, Passionate about problem-solving and participation in events	Depend more on digital tools instead of manual approach, Limited industry exposure (still a student phase), Sometimes overthink before making decisions, Hesitation in public speaking at large gatherings	Got the chance to be a Media Team Member in Hackathon (Techniques, College Event), where I learned teamwork, event handling, and coordination skills. Exposure to a real hackathon environment, networking with participants, and understanding problem-solving approaches.	1. Managing multiple responsibilities during the hackathon as part of the media team\n2. Handling pressure of covering live updates, photos, and event highlights on time\n3. Coordinating with participants and faculty under strict deadlines\n4. Adapting quickly to unexpected changes during the event schedule\n5. Balancing academics and event work simultaneously
235	1396	Coding, communication, hardworking,	0	ACM, UBA	No challenges
236	1328	“My strengths are strong problem-solving ability, adaptability to new technologies, and a logical mindset that helps me learn quickly and apply concepts effectively.”	“Sometimes I focus too much on perfecting details, which can slow me down, but I’m learning to balance accuracy with efficiency.I used to hesitate in asking for help, but now I’m improving by collaborating more with peers.Public speaking makes me a little nervous, but I’m working on improving my communication skills.”	I have opportunities to explore areas like AI, data science, cybersecurity, and software development. The industry is rapidly growing, offering chances to work on innovative projects, internships, and research that can shape my future career.	One challenge I face in CSE is keeping up with the fast-changing technologies, but I take it positively as it motivates me to keep learning and upgrading my skills.
237	1385	Hardworking, Communication, teamwork, communication, creativity, adaptability, discipline, patience, integrity.	public speaking, self criticism	Web Development, Research, Robotics, IOT, Computer Vision	Attendence
238	402	Determination, Leadership skills, Communication skills	Inability to muktitask	None	.
239	354	•\tStrong technical knowledge and problem-solving skills.\n\t•\tAbility to adapt quickly to new tools and technologies.	•\tLimited practical exposure to real-world projects.\n\t•\tTime management and communication skills need improvement.	•\tGrowing demand in IT industry with global career options.\n\t•\tScope for higher studies, research, and entrepreneurship.	•\tRapid technological changes requiring continuous learning.\n\t•\tHigh competition and risk of job automation.
240	1392	none	none	none	none
241	1432	Quick learner with adaptability to new tools and technologies\nGood problem-solving and debugging abilities\nAbility to work independently as well as in a team	Tendency to overanalyze before execution\nLimited industry-level work experience (still in college phase)	Expanding tech industry with demand for software/web developers\nGrowing startup ecosystem in India providing real-world exposure	High competition in the software development job market\nKeeping pace with rapidly changing technologies
242	1421	Strong foundation in programming (Python, C/C++, JavaScript) and advanced concepts in AI, ML, and federated learning\n\nHigh academic performance (CGPA: 8.87) with excellent project and research experience, including internships and paper presentations\n\nProactive in professional development through MOOCs/NPTEL, technical competitions (Codevita, hackathons), and open-source contributions\n\nEffective at self-learning, time management, and collaborating within research and development teams	Limited real-world industry exposure compared to peers from top-tier institutes\n\nSometimes overly focused on technical detail, which can delay completion of certain tasks	Access to a rapidly growing AI/ML job market for 2026 graduates, especially with strong project/research background\n\nPotential to publish research in national/international conferences and journals\n\nIncreasing industry demand for deep learning and zero knowledge proof skills, with opportunities to contribute to emerging tech domains\n\nAvailability of online courses, certifications, and international fellowships to enhance skills and profile	High competition for top roles in the AI/ML domain, especially for candidates from non-IITs/NITs\n\nNeed to stay updated with fast-evolving technologies, algorithms, and industry trends\n\nSecuring industry internships with significant impact and recognition given limited geographic/network reach\n\nJuggling academic, research, and job search demands, while preparing for interviews and technical tests
243	1350	Time management,I get along well with others.	I feel shy speaking in front of many people, but I’m improving.,\nSometimes I take extra time to make things perfect.	To learn new skills and grow in my career.	Balancing tasks when there is a lot of work.
244	383	Leadership qualities	Stage confidence	Competition	Time management
245	1377	Confident	Distraction	Get a job	Work hard
246	1420	flexiblity and quick learning ability	restlesness	to develop ourself for placement	to develop ourself for placement
247	1327	I am very adaptable, resilience and hard working in any situation	Nil	I wish to get a good job at reputated organization that I am able to some contribution from my side	Sometimes comes problem suddenly that can be manage it difficult but certainly it's happened resolve
250	1358	Problem solving, logical reasoning, general aptitude, analysis skills	Communication skills, memorization problem, procrastination	NA	Social skills
248	1349	Organized and proactive in team leadership roles (ACM, workshops).\nCurious and detail-oriented learner; you prefer step-by-step understanding.\nGood at research and building innovative projects.\nStrong communication skills for team coordination and presentations.	Tends to focus deeply on details, sometimes slowing overall progress.\nLimited hands-on experience in some advanced areas initially, requiring guided learning.	Leadership in technical clubs and workshops can strengthen your profile.\nLearning web development and cybersecurity can expand your versatility.\nPreparing for GATE 2026 can open avenues in research, higher studies, or top tech jobs.	Balancing college, project work, GATE prep, and extra-curriculars efficiently.\nStaying updated with rapidly evolving technologies in AI/ML and coding.\nManaging time and prioritizing tasks under pressure during exams or deadlines.
249	437	My strengths include a good grasp of technical concepts, logical thinking, and analytical skills. I am consistent in my efforts and adaptable to learning new tools and technologies. I also have a basic knowledge and growing interest in Java, which motivates me to explore programming and development further. Along with this, I maintain discipline in my studies and possess effective communication and teamwork abilities.	On the other hand, my weaknesses lie in limited practical exposure compared to theoretical knowledge and sometimes taking extra time in decision-making. I also need to work on improving my confidence in public speaking and time management, especially when handling multiple tasks.	There are several opportunities available for me as the IT field continues to grow rapidly. The increasing demand for skilled developers, especially in areas like software development and database management, provides strong career prospects. With continuous learning through courses, projects, and internships, I can strengthen my skills and build a solid foundation for future roles.	The main challenges I face include high competition in the job market and the need to constantly update myself with the latest technologies. Balancing academics with skill development can also be demanding at times, and uncertainties in career opportunities add to the pressure. However, with proper planning and consistent effort, these challenges can be overcome.
251	1524	Quick Learner\nProject-Oriented\nTech & Business Blend\nPython and SQL	Need Experience	Emerging AI demands\nFinal year is the time for internships and jobs	Highly competitive job market for data science and AI roles.\nNeed to stay updated with fast-changing tools/technologies.
252	1413	Versatile technical skills, I have a strong, dual proficiency in both full stack development and Data Science AI. Hands on experience for building projects.	-	The tech industry has a string and growing demand for professionals with a combination of fullstack and data science skills.	Rapidly evolving technologies.
253	1554	1) Good academic record with strong analytical and problem solving skills\n2) Quick learner and adaptability \n3) Effective communication and teamwork ability\n4) Concentration and patience a thanks to my experience as a chess player	1) Limited real-world industry exposure or internships\n2) Hesitant in public speaking	1) Availability of online certificate, workshops etc\n2) Internship opportunities through online portals	1) High competition in academic and industry \n2) Balancing academics and playing chess\n3) Rapidly changing technology
256	1560	I am a quick learner with strong analytical and problem-solving skills, especially in Data Science and AI/ML. My creative approach helps transform complex data into actionable insights. Good communication and leadership abilities make me an effective team player and collaborator. I am also disciplined, focused, and open to continuous improvement.	sometimes overcommit to multiple tasks, which can stretch my time management. While my communication skills are good, I recognize the need for ongoing refinement to convey technical ideas to non-technical audiences more effectively.	The growing demand for AI and data-driven solutions offers immense scope to innovate and contribute to impactful projects. Advancements in machine learning, mental health tech, and AI-powered applications provide platforms to apply my skills in real-world scenarios. Networking with professionals and participating in interdisciplinary projects can further expand my expertise and career prospects.	Rapid technological changes require constant upskilling and adaptability. Competition in the AI/ML field is intense, demanding continuous learning and staying updated with emerging trends. Balancing academic, project, and personal commitments can also pose occasional challenges.
257	1348	team work, Adaptability and collaboration	public speaking	involve in more activities and programme	overcoming communication
259	1424	I have excellent self control which i think is valuable in any workspace enviorment.\nI am really really good at Convincing peoples.	I am quite talkative.	Want to work as Data scientist or Analyst	Less Technical knowledge
263	682	my strengths are my positive nature and hard working nature	my area of improvements are some times I trying to improve my multitasking and time management and building confidence	the college provides opportunities as well as my department also	lack of time and laziness
264	657	Strong logical thinking , Confident in proving my point and standing firm in discussions , Dedicated and consistent in completing tasks.	Overthinking situations, which may slow decision-making , to improve in accepting feedback calmly at times.	Scope to master programming, contribute to innovative projects, explore internships, and build a strong technical portfolio.	Staying ahead with the latest tech trends and managing performance under pressure during exams and team project
255	1441	I am a curious and persistent learner with strong interest in Web development ,AI and IOT Thinks. I focus on clarity, structured learning, and practical application. My strengths are adaptability, consistency, and the ability to learn across multiple fields.	Sometimes I focus too much on details, which slows me down. I often switch between multiple topics, making it hard to go deep in one area. I also tend to rely on guidance instead of trusting my own solutions first.	I have the opportunity to strengthen my expertise by focusing deeply on AI development ,AI and IOT Thinks. With more hands-on projects, industry exposure, and self-reliance, I can turn my curiosity and persistence into strong career growth and confidence.	My challenges include staying focused on one domain without getting distracted by many topics, managing time effectively, and reducing overdependence on guidance. Building confidence in independent problem-solving is key to overcoming these hurdles.
258	1410	Curiosity & Lifelong Learning – Always eager to explore new skills, technologies, and ideas. \nResilience & Discipline – Strong commitment to academics, projects, and extra activities, balancing them with focus.\nCreativity & Expression – Ability to think outside the box, shown through art, design, and innovative projects. \nTeam Spirit & Leadership – Collaborative mindset with the ability to guide and support others in group settings.\nAdaptability & Versatility – Comfortable taking on diverse roles, from research to sports to cultural activities.	Over-Involvement in Multiple Areas – Balancing academics, research, art, sports, and events may sometimes dilute focus. \nDependence on Guidance – In some research-heavy areas, you may need mentorship before working independently Lazy to start the work	NSS (National Service Scheme) Membership – Opportunity to engage in community service, build social responsibility, and develop leadership qualities.\nACM Student Chapter – Graphic Design Specialist – Exposure to technical communities, networking with peers, and enhancing design.\nCoordinator of “Strokes of Art” (INSIGHT’25) – Opportunity to demonstrate event management, leadership, and creativity at a college-wide level. \nResearch Internships (VNIT & DRDO-CAIR) – Chance to explore advanced technologies (AI, NLP, smart contracts, program analysis), strengthen research profile, and publish/innovate. \nSports Participation (University-level Kabaddi) – Opportunity to develop discipline, teamwork, and resilience while balancing sports with academics. \nSmart India Hackathon Participation – Exposure to national-level competition, innovation challenges, and networking with industry/academic experts. \nArt & Design Competitions – Opportunity to express creativity, win recognition, and showcase versatility beyond technical work. \nCoordinator Roles in Clubs/Events (Infinity, Artovert Club) – Opportunities to build leadership, teamwork, and organizational skills in diverse settings.	Keeping pace with new tools, frameworks, and research trends can be challenging without focused specialization. \nManaging academics, research, coding, design, art, and sports together could risk stretching yourself too thin.
260	1333	Strong at analyzing complex problems and finding efficient technical solutions.	Spending too much time trying to make code or designs perfect.	To get a placement	Working on complex projects
261	1368	.	.	.	.
262	655	Programming	Communication skills	Placement	Stage dering
14	311	Clear communication skills, Confident public speaking, Excellent time management, Strong teamwork skills, Innovative and creative thinker, Polished presentation skills, Excellent organizational skills, Self-disciplined and consistent, Proven multitasking ability	Poor note-taking habits, Occasional low motivation, overthinking/indecisiveness, fear of failure, limited practical experience and networking skills, poor physical health or fitness	Supportive family, Hackathons, competitions and project expos, Hostel networking & study groups	Overcrowded job market, Cultural or language barriers, Distractions (social media, entertainment), Limited access to networking opportunities, Health issues (physical)
265	341	Friendly and approachable\n\nConsiderate and thoughtful\n\nResilient in tough times\n\nCurious and eager to learn\n\nAmbitious with clear goals\n\nEmpathetic towards others	Shy and hesitant\n\nTends to overthink\n\nEmotionally sensitive\n\nSeeks approval from others\n\nStruggles with time and focus management	I can use my friendly nature to build strong connections.\n\nI have opportunities to grow in engineering, trading, and web development.\n\nMy curiosity can help me gain expertise in technology and finance.\n\nThe demand for skilled professionals gives me career opportunities.\n\nOvercoming hesitation and shyness can make me more confident.	I need to balance my studies, career goals, and personal interests.\n\nI must manage my emotions and avoid overthinking.\n\nStaying consistent in learning and time management is a challenge.\n\nI need to handle failures without losing confidence.\n\nCompeting in fast-changing fields is difficult but necessary.
266	333	Strong in communication, leadership, and teamwork. Experienced in coordinating events, guiding people, and working with media and cultural teams. Creative in music and digital projects while actively learning coding and technology to shape both technical and creative growth.	At times underconfident in new situations or before exams. Still gaining deeper technical knowledge and teaching confidence. Balancing academics, projects, and extracurricular commitments can be tough, which sometimes affects focus and consistency in performance.	I can grow as a strong technical and cultural leader by blending coding, event management, and creativity. Opportunities through LinkedIn networking, hackathons, and industry exposure can enhance skills, boost confidence, and open doors for future professional growth.	High competition in academics, placements, and events requires continuous effort. Needs consistent time management and technical upgrades. Balancing studies with cultural and media activities while maintaining discipline and steady progress remains a key challenge.
267	1548	Technical Skills – Strong in Python, C++, React Native, Flutter, Android (Kotlin), and experience with Machine Learning, Deep Learning, and OpenCV.\n\nProblem-Solving Mindset – Enjoys solving coding challenges and building practical solutions from scratch.\n\nTeam Player – Collaborated in hackathons and group projects (e.g., ISRO Hackathon finalist).	Perfectionism – May spend too much time refining solutions before deployment.\n\nLimited Industry Exposure – Most experience is academic/project-based, limited professional/industrial exposure.	Rising Demand for AI/ML Experts – Your focus on computer vision and ML projects aligns with industry trends.\n\nHackathons & Competitions – Opportunities to network and showcase skills (you’ve already proven yourself at ISRO Hackathon).	High Competition – Many candidates are skilled in ML/AI, so standing out requires strong projects and communication skills.\n\nRapidly Evolving Tech – Keeping up with new frameworks and tools (e.g., Generative AI, edge computing for ML).\n\nResource Constraints – Some advanced experiments may require better hardware or cloud resources.\n\nWork-Life Balance – Risk of burnout if focusing too much on projects without breaks.
268	1574	Good interpersonal skills\n\nMotivated\n\nGood teamworker\n\n\nLeadership skills	Try to do too much at once\n\nFind uncertainty quite difficult to manage\n\nCan be too single-minded	Good position at work\n\nCommitment to further study\n\nSupport from work for further training\n\nSupportive family	Nervousness and Anxiety. ...\nDifficult or Unexpected Questions. ...
273	1558	Tech-savvy, quick learner, strong problem-solving, team-work, communication, listening, communication	sometimes procrastinate, limiter patience with repetitive tasks	AI/ML, online courses, internship	High competitions, tech changes, stress
269	317	Learning Programming Language.	.	.	.
270	1545	I have a strong foundation in programming (Python, C, SQL, R) and hands-on experience in AI/ML, data analytics, and cloud-based projects. My academic projects such as the LLM + RAG chatbot, satellite-based cloud cluster detection, and robotics for agriculture demonstrate both technical depth and interdisciplinary application. I possess good communication and leadership qualities, shown through my role as Achiever Club co-coordinator and as a team leader in hackathons. My adaptability and ability to quickly learn emerging technologies allow me to contribute effectively to new domains.	At times, my enthusiasm leads me to take on multiple projects simultaneously, which can stretch my focus across domains. I am also perfection-driven, which occasionally slows my pace in completing milestones. While I have practical experience in implementing systems, I am still working on strengthening my deeper theoretical foundation to connect research insights with large-scale applications.	There are ample opportunities to grow through internships, research collaborations, and paper publications. Being shortlisted in national hackathons and publishing in IEEE has opened avenues for further research exposure. With increasing demand for AI/ML solutions in space, agriculture, and environment, I can expand my expertise and build impactful contributions.	The main challenges I face include high competition in securing national-level opportunities, balancing academic requirements with research, and keeping pace with the rapidly evolving AI ecosystem. Overcoming these will shape me into a stronger researcher and problem-solver.
271	1379	I am disciplined and consistent in my daily routine, which helps me stay focused.\n\nI have good presentation and communication skills, developed through academic projects and seminars.\n\nMy academic background (Diploma and Engineering in Computer Engineering, with exposure to medical studies) has given me versatility.\n\nI am hardworking and curious, always willing to learn in detail.\n\nI can adapt to different situations and balance multiple responsibilities.	At times, I tend to overthink or aim for perfection, which slows down my progress.\n\nI sometimes face self-doubt and hesitate to trust my own knowledge fully.\n\nMy practical exposure to industry projects is limited, though I am improving.\n\nI research a lot (health, academics, personal care) but occasionally feel unsure about applying it.	have opportunities to build a career in Computer Engineering and Artificial Intelligence.\n\nMy presentation and communication skills can help me in teaching, training, or content creation.\n\nNetworking through platforms like LinkedIn and events can open internships and career roles.\n\nMy fitness and disciplined lifestyle will help me maintain productivity and leadership qualities.\n\nMy unique academic background gives me an edge in competitive environments.	Balancing multiple interests (engineering, medical exposure, personal development) can be challenging.\n\nThe Computer Engineering and AI fields are highly competitive, so specialization is necessary.\n\nMaintaining consistency during stressful academic or career phases is crucial.\n\nBuilding more confidence in execution and decision-making is important.
272	1405	Good Reader	None	..	..
274	1398	I have good knowledge of my subjects and I am comfortable learning new concepts quickly. I work well in a team and can adapt to different situations. My enthusiasm, communication skills, and problem-solving approach are also strong points.	Since I am a fresher, I do not have much industry-level experience. I am still working on improving my confidence in interviews and polishing certain advanced technical skills. Time management under pressure is another area I am trying to get better at.	There are many opportunities for fresh graduates like me as companies are open to hiring young talent. Campus placements, training programs, and internships help in gaining practical exposure. Growing fields like data, AI, and software development also create chances for career growth.	The biggest challenge is the high level of competition in placements. Another challenge is the gap between classroom knowledge and real-world applications. Constantly updating skills to meet changing industry demands is also necessary.
275	1337	strong logical thinking, moderate problem-solving skills	take on too many learning areas at once	.	Laziness, not have passion for this field
277	676	Friendly and understanding	Coding	.	To clear my back subjects
276	1547	I have strong technical knowledge and enjoy working hands-on with different technologies. I pay close attention to detail and focus on delivering reliable, high-quality work. I’m a quick learner who enjoys solving problems and exploring new tools, and I work well with others, contributing ideas to make projects successful.	I tend to focus on details, but I’m learning to balance precision with efficiency. I view self-reflection as a strength, using it to keep improving and growing. My experience across diverse technology areas has given me a broad perspective and helps me approach challenges with flexibility and insight.	I want to keep growing my technical skills and explore new and emerging technologies. I’m excited about contributing to innovative projects and learning from experienced teams. I also look forward to developing my leadership skills by guiding and supporting others. Right now, I’m pursuing an internship where I’m working on real-life problems and gaining valuable, hands-on experience.	I enjoy picking up new tools and technologies quickly, especially in fast-paced environments. I’m eager to work on large, complex projects that challenge me and help me grow as a problem-solver. I also make it a priority to keep upgrading my technical knowledge so I can consistently deliver quality results.
278	1401	*	*	*	*
279	1549	•\tStrong foundation in IoT, embedded systems, and sensor-based technologies.\n\t•\tHands-on experience in developing innovative solutions like the IoT-Based Speed Breaker Energy Harvesting & Monitoring System.\n\t•\tEffective teamwork, collaboration, and technical documentation skills.\n\t•\tProblem-solving mindset with interest in sustainable technology solutions.	•\tLimited professional/industry exposure beyond academic projects.\n\t•\tNeed to strengthen time management for multitasking in high-pressure scenarios.\n\t•\tRequires broader knowledge in business and entrepreneurship aspects.	•\tExpanding career scope in IoT, renewable energy, and smart infrastructure domains.\n\t•\tPotential for research publications, patents, and participation in innovation competitions.\n\t•\tOpportunities to pursue certifications and advanced training in IoT, AI, and data analytics.\n\t•\tNetworking with professionals and industry experts for career growth.	•\tRapid technological advancements requiring continuous upskilling.\n\t•\tResource and funding limitations for scaling academic prototypes to industrial solutions.\n\t•\tBalancing academic, project, and professional commitments.
280	1419	Good problem-solving skills and logical thinking\nHardworking and consistent once committed.	Sometimes overthink or spend extra time perfecting tasks.\nCan be shy or reserved in large groups.	Internships and certifications that can strengthen profile.	High competition in academic and professional fields.
281	1440	Strong problem-solving skills, quick learner, adaptable to new challenges, effective team player with good leadership qualities, strong communication, time management, and organizational abilities, dedicated to achieving goals with consistency.	Tend to overthink at times, sometimes take on too many tasks at once	Opportunities to learn emerging technologies, enhance professional skills, gain industry experience, build strong networks, explore leadership roles, contribute to innovative projects, and grow in a dynamic career environment.	Faced challenges like adapting to new technologies, managing time between academics and projects, overcoming technical errors, coordinating with team members, and ensuring project deadlines while maintaining quality and accuracy.
282	1555	Quick learner, adaptable, good teamwork and communication	Sometimes overthink decisions, can be perfectionist, occasionally take on too many tasks	Expanding technical skills, gaining industry experience, networking with professionals	Managing time effectively under pressure, balancing multiple priorities, staying updated with fast-changing technology
283	1582	Eager to learn and explore, Work and coordinate well in teams, Can take part in solving situations and critical thinking.	Distracted at sometimes, Procrastinator, Fear of public speaking, Confidence issues, Not consistent.	Will take on any opportunity and will improve and grow as a person. Broaden my career paths and help in growth of the company as an employee.	Work place competition, Self doubts and weakness that may hinder in future.
284	1427	team sprit, punctual	coding	.	.
285	670	Good at communicating	May need to improve consistency	Scope to build  projects,  networking opportunities through coding communities, huge career growth in software development	Strong competition in tech jobs and research fields
286	1397	Teamworker, Leadership skill, Time management	Overconfidence	.	.
287	443	I am fast, good communication in general	Bad handwriting	..	..
288	1578	Quick learner and adaptable to new situations.\n\nStrong problem-solving and analytical skills.\n\nGood communication and interpersonal abilities.\n\nDetermined and consistent when working toward goals.	Overthinking situations and decisions.\n\nTendency to be self-critical.\n\nSometimes struggling with time management under pressure.\n\nCan get easily distracted when stressed.	Chance to upskill in technical areas and personal growth.\n\nNetworking with like-minded people for career/learning opportunities.\n\nExpanding into new fields of interest (tech, entrepreneurship, etc.).\n\nAbility to turn weaknesses (like overthinking) into strengths (critical analysis).	High competition in academics and career fields.\n\nBalancing personal and professional life.\n\nKeeping up with rapid changes in technology and trends.\n\nManaging stress and expectations effectively.
289	1389	consider my adaptability and willingness to learn as my strongest qualities. I am confident in my ability to take initiative, work in a team, and communicate effectively with others. My organizational skills and prior experience in coordinating events have helped me develop leadership qualities and a structured approach to work. I am also sincere and dedicated when it comes to completing tasks within deadlines.	One area I am working on is overthinking, especially when taking important decisions, which sometimes causes delays. I don’t like it when things are not organized, and it irritates me when situations don’t go according to the plan. While this pushes me to stay disciplined, it can sometimes affect my flexibility. Additionally, while I am comfortable speaking in English, I want to further polish my fluency and reduce nervousness in front of large audiences. I am conscious of these weaknesses and am actively working to improve them.	I see every academic and extracurricular activity as an opportunity to enhance my personal and professional skills. Being part of different clubs and events gives me exposure to teamwork, leadership, and communication. With access to workshops, online resources, and mentorship from seniors and faculty, I have opportunities to expand my technical knowledge and soft skills. These experiences not only prepare me for future placements but also help me grow as a confident individual.	The main challenge I face is balancing multiple responsibilities such as academics, event management, and personal growth simultaneously. Limited time and resources can sometimes make it difficult to give equal attention to all areas. Another challenge is stepping out of my comfort zone to face highly competitive environments where confidence and quick decision-making are essential. However, I consider these challenges as learning experiences that push me to improve and perform better.
290	1556	One of my strengths is problem-solving. For example, while building a sign language recognition system using Python and MediaPipe, I encountered a bug where the model recognized gestures only in a specific screen region. Instead of giving up, I debugged the pipeline and modified the detection logic so it worked across the entire frame. This problem-solving approach helped improve the accuracy of the project.\nAnother strength is adaptability — I recently started learning c# language alongside my existing knowledge of C++, Python, and SQL. This helps me stay flexible and quickly pick up new technologies when required.	I used to focus too much on perfecting small details in my code, which sometimes slowed me down. But now I balance quality with deadlines by using proper testing tools and setting personal time limits for each task	With AI and emerging technologies advancing rapidly, I see opportunities to keep learning and apply my coding skills to real-world solutions, like the sign language recognition project I worked on. Also, the rise of cloud computing and cybersecurity creates space for me to specialize and contribute meaningfully to any organization	One challenge I see is the fast pace of technological change. New frameworks and languages keep emerging, and it can be overwhelming to keep up. To overcome this, I’ve built a habit of continuous learning — recently I started learning c# along with my strong base in Python and C++, which helps me stay adaptable
291	1566	Work under pressure	Hesitation in putting point	For Job	Skills
56	342	gwag	wg2g	g2g2	g2g2
292	1399	My main strength is leadership. I naturally take charge in group settings, whether during Insight, departmental events, or team projects. I organize people, set direction, and keep tasks on track without letting conflicts slow progress. Clear communication supports this. Years of debating and public speaking trained me to explain ideas simply, argue logically, and adapt tone depending on the audience.\n\nAnother strength is resilience. I have gone through setbacks in academics and personal life, yet I always find a way to continue. Even when motivation drops, I do not quit entirely, and this persistence allows me to recover faster than most. Along with resilience, I value consistency under pressure. Stressful deadlines or chaotic situations usually bring out focus in me rather than panic.	A major weakness is inconsistency. I tend to procrastinate, waiting until deadlines force me to act. This has hurt my academics, especially attendance and exam performance, despite having the ability to do better.	I have multiple opportunities ahead. College events like Insight give me platforms to practice leadership, documentation, and coordination at scale. These experiences strengthen my ability to manage real-world teams and deadlines.\n\nMy projects—Entity Hunter, Amazon Ads automation, CLIP+FAISS—are opportunities to showcase technical creativity. If I refine them, publish code, and document results, they can stand out in a portfolio and attract recruiter attention.\n\nI also have strong communication skills. Public speaking and debating allow me to thrive in roles involving presentations, client interactions, or leadership. This strength opens doors to management-oriented positions, not just technical work.	The biggest challenge is fighting inconsistency. Opportunities exist, but without discipline, they are wasted. Procrastination, poor routines, and distractions make it difficult to sustain momentum.
294	1527	Creative Mindset – I have a strong passion for design, photography, and writing, which helps me think outside the box and bring fresh ideas into projects.\n\nLeadership & Teamwork – From leading juniors in ACM/Infinity to designing magazines and handling event media, I’ve shown the ability to guide, coordinate, and work collaboratively.\n\nAdaptability & Learning Attitude – Whether it’s UI/UX, Power BI dashboards, or building a chatbot with LLM, I'm eager to learn new skills and technologies quickly.\n\nCommunication Skills – I interact well with peers and juniors, making it easier to lead discussions, pitch ideas, and build teamwork.\n\nDetail-Oriented – As a designer and event media member, I pay attention to fine details, ensuring my work is visually appealing and impactful.	Perfectionism – Sometimes I spend too much time polishing small details, which can slow down progress.\n\nOvercommitting – Since I'm passionate about multiple things (design, tech, events, writing), I occasionally take on too much at once, leading to stress.\n\nDelegation – I tend to handle tasks on my own instead of fully trusting others with responsibilities, which can create extra workload.\n\nConfidence Under Pressure – In some situations, I may second-guess myself despite having strong skills.	Opportunity to learn from real-world projects, sharpen problem-solving, and enhance teamwork, while exploring my interests in design, tech, and innovation.	I tend to be a perfectionist, which slows me down at times. I’m learning to focus on deadlines and balance quality with efficiency.
296	1393	One of my strengths is teamwork. I enjoy collaborating with others and helping my team achieve shared goals. I am also good at communication, which allows me to express ideas clearly and understand others’ perspectives. Additionally, I manage my time effectively and plan tasks in advance to ensure that I meet deadlines without compromising on quality.	My weakness is that I sometimes take on too many tasks at once, which affects my efficiency, but I am learning to prioritize and delegate work to stay focused and meet deadlines.	I had the opportunity to serve as Treasurer and Vice Chair of ACM, participate in NSS activities, coordinate events as Promotion member and I&V Co-Coordinator, intern with the Ministry of Defense , and represent my college in volleyball competitions, where our team won first prize—experiences that helped me develop leadership, teamwork, and organizational skills.	One of the challenges I faced was balancing academics with extracurricular activities, which required me to improve my time management and planning. I also had to adapt quickly to new roles and responsibilities, which helped me develop problem-solving skills and stay motivated. These challenges made me more organized, confident, and better at working with others.
298	1579	leadership qualities, problem solving, quick learning ability,technical skills(python)	currently enhancing knowledge through courses and practical projects	I see opportunities in contributing to impactful products, improving development processes through automation and clean architecture, and continuously learning through hands-on experience and collaboration within high-performing teams.	Aiming to grow as a software engineer by taking on complex technical challenges such as building scalable systems, maintaining code quality in fast-paced environments, and adapting to rapidly evolving technologies
299	1428	Communication	-	-	-
301	1430	I have a foundation in programming languages like C, Java, along with good problem-solving skills. I adapt quickly to new technologies and enjoy working in teams.	Little bit in communication, and hands on experience of internship and projects	I see a great scope in fields like Artificial Intelligence, Machine Learning	Expressing technical ideas clearly to technical people, Balancing multiple tasks, deadlines, and priorities
380	1367	Good memory, Queerly analytical	Overthinking and procrastination	Assigning me a specific/job task with my creative freedom is most fruitful regardless of the nature of task	Micromanaging me , not enough space to accommodate my options
293	1540	I have strong technical knowledge and enjoy working hands-on with different technologies. I pay close attention to detail and focus on delivering reliable, high-quality work. I’m a quick learner who enjoys solving problems and exploring new tools, and I work well with others, contributing ideas to make projects successful.	I tend to focus on details, but I’m learning to balance precision with efficiency. I view self-reflection as a strength, using it to keep improving and growing. My experience across diverse technology areas has given me a broad perspective and helps me approach challenges with flexibility and insight.	I want to keep growing my technical skills and explore new and emerging technologies. I’m excited about contributing to innovative projects and learning from experienced teams. I also look forward to developing my leadership skills by guiding and supporting others. Right now, I’m pursuing an internship where I’m working on real-life problems and gaining valuable, hands-on experience.	I enjoy picking up new tools and technologies quickly, especially in fast-paced environments. I’m eager to work on large, complex projects that challenge me and help me grow as a problem-solver. I also make it a priority to keep upgrading my technical knowledge so I can consistently deliver quality results.
295	1439	Strong Problem-Solving Skills – Ability to analyze problems logically and design efficient solutions using algorithms and coding.\n\n\n2. Programming Knowledge – Proficiency in languages like Python, C, Java, or C++ to build software and solve real-world tasks.\n\n\n3. Analytical & Logical Thinking – Breaking down complex problems into smaller, manageable parts and implementing them step by step.	Over-Focus on Perfection – Spending extra time optimizing code or debugging, which sometimes delays project deadlines.\n\n\n2. Limited Practical Exposure – Strong in theory but still gaining more hands-on experience with real-world industry projects.\n\n\n3. Public Speaking / Presentation Skills – Good at technical work but still working on confidently presenting ideas to large audiences.	High Demand in IT Industry – Huge career opportunities in software development, AI, ML, data science, cybersecurity, and cloud computing.\n\n\n2. Emerging Technologies – Exposure to trending fields like Blockchain, IoT, AR/VR, and Quantum Computing.\n\n\n3. Research & Higher Studies – Chance to pursue M.Tech, MS, or PhD in specialized areas of computer science	Rapidly Changing Technology – New programming languages, frameworks, and tools keep emerging, so continuous learning is necessary.\n\n\n2. High Competition – Large number of CS graduates every year makes it harder to stand out without extra skills or projects.\n\n\n3. Bridging Theory & Practice – Applying classroom concepts (DSA, OS, DBMS) to real-world projects can be challenging at first.
297	1542	Strong foundation in C, C++, HTML, CSS, SQL with hands-on project experience.\n\nPractical exposure through Smart Traffic Management System (IoT-based project) showcasing problem-solving and real-world application.\n\nCertified in IoT, Selenium, Large Language Models, Project Management, and Power BI, highlighting both technical and analytical skills.\n\nLeadership and organizational skills demonstrated as Infinity’24 Coordinator, ACM Secretary, Technex’25 Requirement Head, and Class Representative.\n\nConsistently strong academic performance (CGPA 8.23, SSC 94.2%, HSC 85%).	Limited direct industry experience, mainly academic and internship-based exposure.\n\nTendency to manage multiple responsibilities at once, which may affect time prioritization.	Growing demand for IoT-based smart solutions provides scope to expand your major project into research or startups.\n\nCertifications in AI, project management, and data analytics open pathways in multiple fields (QA, AI/ML, Data Analysis, Project Management).\n\nLeadership roles in college events enhance your networking opportunities with faculty, industry guests, and peers.\n\nStrong GitHub and LinkedIn presence can help build a professional brand and attract recruiters.	High competition in tech roles, requiring continuous upskilling and specialization.\n\nTransition from academic to corporate environment may demand adapting to faster workflows and new tools.\n\nBalancing technical learning with career-building activities like internships, research publications, and certifications.\n\nRapidly evolving technologies mean a need for constant learning to stay relevant.
300	1563	Adaptability and Curiosity\nCreativity and Design Sense\nAdequate knowledge of C, C++, Python\nProactiveness and Initiative\nBalanced Personality	Scattered Focus\nConfidence Gap in Core Subjects	dual interest in technology and management positions you well for careers in product management, digital strategy, or AI-driven marketing analytics.\nLeveraging your design sense (UI/UX + storytelling) can set you apart in industries increasingly valuing user experience.	Bridging Technical Depth with Creative Interests\nHigh Competition\nConsistency in Long-Term Focus\nTime & Energy Management
302	1412	Quick learner, problem-solving, adaptable, creative, good communication	Overthinking, procrastination, perfectionism, limited practical exposure	Growing tech demand, online learning, internships, networking, leadership roles	High competition, fast-changing technology, time management, theory–practice gap, self-doubt.
303	1436	Strong Problem-Solving Skills – Ability to analyze problems logically and design efficient solutions using algorithms and coding.\n\n\n2. Programming Knowledge – Proficiency in languages like Python, C, Java, or C++ to build software and solve real-world tasks.\n\n\n3. Analytical & Logical Thinking – Breaking down complex problems into smaller, manageable parts and implementing them step by step.	Over-Focus on Perfection – Spending extra time optimizing code or debugging, which sometimes delays project deadlines.\n\n\n2. Limited Practical Exposure – Strong in theory but still gaining more hands-on experience with real-world industry projects.\n\n\n3. Public Speaking / Presentation Skills – Good at technical work but still working on confidently presenting ideas to large audiences.	High Demand in IT Industry – Huge career opportunities in software development, AI, ML, data science, cybersecurity, and cloud computing.\n\n\n2. Emerging Technologies – Exposure to trending fields like Blockchain, IoT, AR/VR, and Quantum Computing.\n\n\n3. Research & Higher Studies – Chance to pursue M.Tech, MS, or PhD in specialized areas of computer science	Rapidly Changing Technology – New programming languages, frameworks, and tools keep emerging, so continuous learning is necessary.\n\n\n2. High Competition – Large number of CS graduates every year makes it harder to stand out without extra skills or projects.\n\n\n3. Bridging Theory & Practice – Applying classroom concepts (DSA, OS, DBMS) to real-world projects can be challenging at first.
304	1568	Quick learner and always eager to explore new technologies.\n\nGood knowledge of programming concepts (C, C++, Java, Python) and hands-on project experience.\n\nConsistent and hardworking with a focus on completing tasks responsibly.\n\nInterested in AI/ML and actively working on projects to build practical skills.	Procrastination.\n\nCommunication skills need improvement.	Pursuing Computer Engineering provides opportunities in IT, AI/ML, and software development fields.\n\nAvailability of online certifications, internships, and projects to enhance skills.\n\nGrowing demand in the IT sector gives good career prospects.\n\nCollege mentoring, workshops, and fests provide exposure and learning opportuniti	Staying updated with rapidly changing technologies.\n\nHigh competition in placements and the IT job market.\n\nBalancing academics, projects, and personal skill development.\n\nImproving confidence in communication and presentation skills.
305	1434	Creative thinker, quick learner, adaptable, strong communication skills, Proficient in a foreign language (Japanese), Good in Web Development, UI/UX design.	Perfectionist tendencies, sometimes overanalyze, hesitant to delegate tasks.	Growing tech landscape, chance to apply skills in real-world projects, networking in internship/ hackathons.	Balancing time, managing pressure, staying consistent amidst distractions.
306	1564	1. Strong foundation in C, C++, HTML, CSS, SQL with hands-on project experience.\n2. Practical exposure through Smart Traffic Management System (loT-based project) showcasing problem-solving and real-world application.\n3. Certified in loT, Selenium, Large Language Models, Project Management, and Power Bl, highlighting both technical and analytical skills.\n4. Leadership and organizational skills demonstrated as Infinity'24\nEvent Co-coordinator, Infinty’23 Core Member.\n5. Consistently strong academic performance (CGPA 7.88, SSC\n76.8%, HSC 64.83%).	1. Limited direct industry experience, mainly academic and internship-based exposure.\n2. Need to strengthen expertise in advanced frameworks/tools (e.g., React, Node.js, TensorFlow, etc.) to match current industry demands.\n3. Sometimes more focused on technical depth than on soft skills like public speaking or networking.\n4. Tendency to manage multiple responsibilities at once, which may affect time prioritization.	1. Growing demand for loT-based smart solutions provides scope to expand your major project into research or startups.\n2. Certifications in Al, project management, and data analytics open pathways in multiple fields (QA, AI/ML, Data Analysis, Project Management).\n3. Leadership roles in college events enhance your networking opportunities with faculty, industry guests, and peers.\n4. Strong Linkedin presence can help build a professional brand and attract recruiters.	1. High competition in tech roles, requiring continuous upskilling and specialization.\n2. Transition from academic to corporate environment may demand adapting to faster workflows and new tools.\n3. Balancing technical learning with career-building activities like internships, research publications, and certifications.\n4. Rapidly evolving technologies mean a need for constant learning to stay relevant.
307	1565	My biggest strength is my ability to take initiative and lead. Whether it was as ACM Chairperson, Co-coordinator of Infinity, or part of the Technex team, I’ve always enjoyed organizing, managing, and motivating people. At the same time, I’ve maintained a strong academic record with a 9.15 CGPA, which shows that I can balance multiple responsibilities effectively.\n\nOn the technical side, I am skilled in programming (C, C++, Python), IoT hardware (ESP32, GSM, GPS), app development (Flutter, Figma), and databases (SQL, PostgreSQL). My major project, Beast Sentinel, combines IoT and mobile applications to solve real-world problems, which reflects both my innovation and social impact focus. Apart from technical skills, I consider my communication, sponsorship handling, and networking abilities as key strengths that make me versatile.	Sometimes, I tend to take on too many roles at once. While this gives me diverse experience, it can make it harder to go very deep in one specialized area. I also feel that my industry exposure is still limited, as I’ve had just one internship so far. Another area I am working on is finding the right balance between my hardware and software expertise—I know a wide range of tools and technologies, but I want to master one domain more deeply. Finally, because I push myself to take on multiple things, I sometimes risk overcommitting, which I’m learning to manage better.	see myself at a unique point where I can combine both technology and management. With my leadership experience and technical skills, I have opportunities in business analyst, product management, and IoT-based roles at companies like Amazon, Deloitte, or even startups. At the same time, I can explore higher studies like MBA or M.Tech/MS depending on where I want to specialize.\n\nAnother opportunity lies in my project Beast Sentinel, which has the potential to grow into a full-fledged startup in the field of smart villages and wildlife conservation. The events and initiatives I’ve been part of also give me strong networks and visibility, which can help me connect with the right people for collaborations, internships, or research.	My main challenge is to position myself clearly for the future—whether I want to pursue a tech-focused path (IoT, software, AI/ML) or a management-oriented path (MBA, product, consulting). I also know that competition is intense, and I’ll be compared against specialists in both areas, so I need to highlight my unique mix of skills.\n\nIf I want to take Beast Sentinel forward, I’ll face challenges like funding, scaling, and long-term sustainability. And finally, with how fast technology evolves, I need to continuously upskill myself, especially in emerging areas like cloud IoT, AI, and 5G integration.
309	1423	Hands-on experience in cybersecurity field(penetration testing and ethical hacking)\nGood problem-solving and analytical skills.\n\nAbility to learn quickly and adapt to new technologies.\n\nTeam player with effective communication skills.	Sometimes take extra time to perfect small details (perfectionist tendency).\n\nLimited experience in industry-scale deployment (but actively learning).\n\nCan feel nervous when presenting in front of large groups (working on improving)	High demand for ethical hackers and pentesters in all industries.\n\nCareer growth through certifications, bug bounty, and security research.\n\nChance to work globally, even in remote roles.	Rapidly changing attack techniques require constant learning.\n\nLegal/ethical boundaries limit testing scope.\n\nHigh pressure, reporting workload, and costly certifications/tools.
311	371	Ability to learn fast, good at team work	Procrastination and attention deficiency	Pushing myself to learn new technologies	Difficulty in sticking to one task
308	1541	I have strong technical skills in full-stack web development, with hands-on experience in frontend technologies (HTML, CSS, JavaScript, Bootstrap, EJS), backend frameworks (Node.js, Express.js), and database management (MongoDB). I can integrate dynamic functionalities such as event management systems, admin dashboards, and user-friendly interfaces, which shows my ability to apply concepts in real-world projects. My problem-solving mindset and adaptability further strengthen my development approach.	I sometimes face challenges in balancing advanced backend complexities with frontend design polish, which can affect development speed. Since I am still in the learning and early professional stage, I have limited exposure to large-scale deployments, optimization for high-traffic environments, and advanced security practices. Working under strict time constraints or handling multiple features at once can also test my consistency.	I see excellent opportunities to grow by exploring emerging technologies such as cloud platforms (AWS, Azure, GCP), data analytics, and AI/ML integration into web systems. My internship and project experiences are valuable stepping stones for larger roles in software development and innovative product design. I also have opportunities to expand my network and skills by contributing to open-source projects, participating in hackathons, and collaborating with industry professionals.	The fast-changing tech landscape requires me to continuously learn and adapt, which can sometimes feel overwhelming. Competing in a highly skilled job market pushes me to consistently upgrade my skills and showcase my projects effectively. Ensuring long-term scalability, performance, and security in my projects is also a challenge I need to prepare for. Additionally, balancing academics, internships, and independent projects while preparing for career opportunities requires strong time management and prioritization.
313	1526	I specialize in Full-Stack Web Development and have hands-on experience building end-to-end web and mobile applications. I am also exploring AI/ML integration into web platforms. Through internships and projects—including my ongoing AI-based hands-free Android navigation system for accessibility. I have developed strong problem-solving, adaptability, and learning skills. I am patient and detail-oriented, which helps me handle complex projects effectively.	I sometimes over-analyze tasks, which can slow initial progress. I have limited exposure to large-scale industry projects, and I am actively working on improving public speaking and team coordination skills.	I have the opportunity to work on real-world web platforms that create meaningful impact. I am particularly interested in integrating AI into web applications to enhance functionality and user experience. My ongoing final year project allows me to apply these skills to help people with disabilities. Additionally, my internship experience has provided exposure to end-to-end development, client interactions, and real-world project workflows, which I can leverage to grow professionally.	Managing multiple responsibilities such as college, internship, and projects within limited time is a significant challenge. Keeping pace with rapidly evolving technologies and staying competitive in placements, hackathons, and skill-building opportunities requires effective time management and continuous learning.
316	1520	One of my key strengths is my strong technical foundation and continuous learning mindset. I have worked on diverse projects including machine learning–based phishing detection, an AI system for missing person identification, and IoT applications like smart wheelchairs and assistive cursor movement technology. These experiences demonstrate my problem-solving skills, adaptability, and curiosity to explore new domains. I also bring a sense of social awareness into my work, often choosing projects that create real impact, such as assistive technologies for people with disabilities and solutions addressing safety and human trafficking. Alongside technical expertise, I maintain consistency in learning, shown through coursework like NPTEL’s Machine Learning program, and by practicing aptitude and coding challenges to refine analytical thinking.	At the same time, I recognize areas for improvement. I sometimes take up multiple projects simultaneously, which may limit the depth I can achieve in one particular area. Strengthening my focus and prioritization will allow me to build mastery more effectively. Another area is communication: while I can convey ideas, I am working on refining my formal writing and presentation skills to make a stronger impression in professional settings. I also aim to gain more industry exposure through internships and practical experiences to complement my academic work. Finally, I continue to work on sharpening my fundamentals in programming and theory to increase confidence during interviews.	I see several opportunities ahead that align with my skills and interests. With growing demand in fields like artificial intelligence, machine learning, IoT, and cybersecurity, there are ample chances to contribute to innovative solutions. My projects on phishing detection, missing person identification, and assistive technologies allow me to position myself at the intersection of technology and social impact. Opportunities also exist in pursuing internships, research work, and industry collaborations, which can provide practical exposure and help me apply academic knowledge to real-world problems. Continuous learning through online courses, hackathons, and technical communities also presents avenues to refine my skills, expand my network, and stay updated with emerging technologies.	At the same time, I acknowledge certain challenges. One challenge is the highly competitive nature of the technology sector, where staying relevant requires constant upskilling and specialization. Balancing multiple interests and projects can also be demanding, as it requires effective prioritization to avoid spreading efforts too thin. Another challenge is bridging the gap between academic projects and industry-scale solutions, which demands not only technical expertise but also teamwork, scalability, and professional communication. Additionally, adapting to fast-changing tools and frameworks in machine learning and IoT can sometimes be overwhelming. However, I view these challenges as opportunities for growth and resilience, motivating me to focus, refine my skills, and gain valuable practical experience.
317	1415	Goal oriented, hardworking, passionate	Laziness	Internships and conduction of workshops	No
321	1538	One of my strengths is adaptability — I can quickly adjust when priorities or requirements change without losing focus. Another strength is people management: I’m good at coordinating tasks and resolving small conflicts so that the team stays aligned. I also bring discipline and consistency, which helps me maintain productivity even under pressure.	I used to be very detail-oriented, which sometimes slowed me down. But I’ve learned to balance attention to detail with time management by setting clear deadlines for myself and focusing on the most impactful work first.	Growing demand for full-stack developers and cloud-based solutions, which matches my skills in React, Node.js, SQL, and MongoDB.\nChance to learn and apply emerging technologies like AI/ML, cloud computing, and DevOps.\nOpportunity to work in collaborative, innovative environments where I can sharpen both technical and people-management skills.	Keeping up with the fast pace of technology change, which requires constant learning and adaptation.\nNavigating situations where teammates may have conflicting ideas or priorities, and ensuring alignment.\nEnsuring scalability and security while building applications that meet real-world demands.
324	1553	Curious and eager to learn new technologies.\nGood at researching and connecting ideas.\nHardworking and determined to complete tasks.\nCan think of creative/innovative project ideas.	Sometimes struggle with practical implementation of coding/theory.\nSelf-doubt and fear of not being “good enough” at times.\nNeed to improve time management when handling multiple tasks.	Plenty of time to build strong technical skills (Python, ML, Data Analytics).\nChance to stand out with unique projects in your field.\nCan work on confidence and communication, making you strong for interviews.	High competition in tech/engineering jobs.\nNeed to bridge the gap between theory and practical coding skills.\nBalancing academic work, projects, and personal growth.
329	1409	Strong foundation in programming, data science, and analytical problem-solving\n\nQuick learner with adaptability to new tools and technologies\n\nTeamwork as well as independent working ability	Limited industry-level practical exposure\n\nNeed improvement in advanced topics like deep learning and big data tools\n\nPublic speaking confidence needs enhancement	Growing demand for data science and AI professionals\n\nAccess to internships, certifications, and online resources for upskilling\n\nScope to specialize in emerging areas like Generative AI and Data Engineering	High competition in the data science field\n\nBridging gap between academic knowledge and real-world applications\n\nKeeping pace with rapidly evolving technologies and tools
310	1536	One of my key strengths is problem-solving – I enjoy breaking down complex problems into smaller, manageable steps.\n\nI’m also adaptable to new technologies, which helps me quickly learn and apply new tools or frameworks.\n\nAdditionally, I have strong team collaboration skills, which make me effective in both leadership and support roles.	Earlier, I used to focus too much on details, which sometimes slowed my pace. But now I’ve been working on balancing speed with accuracy by setting time limits for tasks.\n\nPublic speaking was a challenge for me, but I’ve been improving by volunteering for presentations and leading small meetings.	I see opportunities in emerging technologies like AI, cloud computing, and data-driven solutions. These fields are growing fast, and I’m actively learning to stay relevant.\n\nI also see opportunities in cross-functional collaboration, where I can combine my technical skills with business understanding to deliver impactful results.	One challenge I foresee is the rapidly evolving technology landscape. To address this, I continuously upskill myself through online courses, projects, and industry updates.\n\nAnother challenge is the high competition in the job market, but I see it as motivation to sharpen my skills and differentiate myself
314	1431	Strong Technical Foundation – Skilled in C++, Python, DBMS, ML/AI, web development, and working with datasets.And also Punctual and discipline in the work	I sometimes get deeply focused on details, but I’m working on balancing detail with efficiency. I’ve explored many areas of technology, and now I’m working on specializing more deeply. I can be a little self-critical, but I use that to push myself to grow and improve.	Hackathons & Research Conferences – Platforms to showcase your skills and network.\nInternships & Industry Projects – Can gain strong practical exposure with your portfolio.\nCreative + Tech Fusion – Your design/art + coding skills can help in UI/UX-heavy AI apps, making your work stand out.	Time Management – Balancing academics, projects, personal interests, and career prep.\nKeeping Pace with Rapid Tech Changes – New tools and frameworks emerge quickly
327	1523	Quick learner and adaptable to new technologies\n\nStrong fundamentals in programming/problem-solving	Sometimes spend extra time perfecting tasks .\n\nNervous in public speaking (but working on it)	Opportunity to learn from experienced professionals.\n\nChance to work on diverse projects and build strong career foundation.	Adapting quickly to fast-changing technology trends.\n\nProving capability without prior work experience.
254	1408	I believe my biggest strength lies in my diverse technical exposure and hands-on experience like Full Stack Development, AI/ML, IOT, etc.	Handling multiple projects and responsibilities.	I see plenty of opportunities to build on my current journey. The fields I have worked on AI in healthcare and IoT solutions are in high demand.	The highly competitive and evolving tech industry requires me to update my skills constantly.
330	1532	I bring strong leadership, communication, and teamwork skills, developed by leading student initiatives and organizing impactful events. Alongside these, I have solid technical expertise in Python, FastAPI, PostgreSQL, and deep learning, which I’ve applied in building real-world projects like QR-based ticketing systems and AI-driven analyzers. This combination allows me to collaborate effectively while delivering innovative technical solutions.	At times I take on too many tasks because of my eagerness to learn, but I’m improving my prioritization to stay more focused and effective.	With the rapid growth of AI, machine learning, and full-stack development, I see huge opportunities to apply my skills in solving real-world problems through intelligent systems and scalable web applications. My internship experiences and projects in deep learning, FastAPI, and database-driven systems position me well to contribute to industries adopting automation, smart solutions, and digital transformation. Additionally, hackathons, research opportunities, and collaborations with startups provide me with avenues to enhance my technical expertise, network with professionals, and further strengthen my leadership and teamwork skills.	One of the key challenges I foresee is keeping up with the fast pace of technological advancements, especially in fields like AI, deep learning, and full-stack development where new frameworks and tools emerge frequently. Another challenge is balancing academic commitments with continuous skill development and practical project work. However, I see these challenges as motivators — they push me to keep learning, stay updated through online courses and communities, and actively apply my skills in real-world projects to remain industry-ready.
332	1573	~ Strong foundation in Python, Java, Data Analytics, and AI/ML concepts\n~ Hands-on experience through internships (Code Core Global, IT-Networkz, Deloitte Virtual Internship) and projects (Modelmate, Research Agent, Village Connect)\n~ Quick learner, adaptable, and eager to explore new technologies\n~ Strong soft skills – problem-solving, event coordination (Campus Experia), teamwork, and communication\n~ Creative thinker with the ability to connect technical work with real-world impact	~ Still exploring and finalizing a specific domain focus (between Data Analytics, Backend, and AI/ML)\n~ Tends to overthink, which sometimes delays decision-making\n~ Limited corporate exposure compared to peers with longer internships\n~ Confidence fluctuates during high-pressure academic or interview situations	~ Growing demand in AI/ML, Data Analytics, and Backend Development opens multiple career paths\n~ Certifications (NPTEL, AI Masterclass, NVIDIA, Deloitte Forage) enhance employability and credibility\n~ Ability to build a strong portfolio with existing projects like Modelmate and Research Agent\n~ Plenty of scope for internships, entry-level roles, and higher studies in chosen domain	~ High competition in tech industry requires continuous upskilling\n~ Need to balance academic performance, project development, and personal growth\n~ Rapid technological advancements demand adaptability and proactive learning\n~ Building confidence and consistency to perform well in interviews and real-world roles
337	1543	Good public speaker\nExcellent communication	Overloading myself with many task	Opportunity for data analysis \nCan work on confidence and communication, making you strong for interviews.	Time management
339	1570	Strong technical knowledge and problem-solving ability.\nGood adaptability and willingness to learn new skills quickly.\nEffective teamwork and collaboration skills.\nCreativity and innovative mindset for approaching problems.\nPersistence and dedication toward long-term goals.	Limited real-world industry experience compared to senior professionals.\nSometimes overanalyzing before execution, which may delay decisions.\nTendency to multitask too much, which can affect focus on priorities.	Growing demand for technology and data-driven solutions across industries.\nWide availability of online resources, communities, and certifications to upskill.\nInternship and placement opportunities in reputed organizations.\nNetworking with professionals, mentors, and peers to gain insights and guidance.\nScope to contribute to impactful projects (AI, data science, social good, etc.).	High competition in the job and placement market\n\nRapidly changing technologies requiring constant upskilling.\nBalancing academic/work commitments with self-learning and projects.\nLimited resources (time, finances, mentorship) compared to large organizations.\nUncertainty in the job market due to economic and global factors.
312	1338	Dedication,  honesty,  hardworking, communication, aptitude and programming languages like C and Python.	Time management,  lazy , unpredictable,  unplanned, lack of consistency.	ACM student chapter member, University skit actor, Hackathons, SIH.	Fluent English speaking is the primary challenge for me. Preparation for GATE exam , learn AI and data science and do the related projects. Lack of consistency in any work is the biggest challenge for me.
315	1559	-Eagerness to learn and understand new topics\n-Technical knowledge across multiple domains\n-Time management\n-Spoken English	-Networking\n-Limited industry experience	-Attend various conferences like WTM, DEFCON, GDSC events for industry exposure and networking\n-Hackathons\n-Internships	-High competition in the field\n-Volatile state of the industry
318	1518	Can adjust according to the environment, calm and Patient personality.	One of my weaknesses is that I find it difficult to confront others or speak up, even when I know they are wrong.	Learning a new skill that’s in high demand, Networking or mentorship opportunities	Rapid changes in required skills of companies.
319	1539	Leadership	Confidence	N/A	N/A
320	1521	Team Management,Teamwork,Leadership	Slightly anxious during questioning ,getting nervous  in formal question and answers.	Workshops & Certifications,Leadership & Extracurricular Growth,Personal Development,Exposure to Real-world Projects –	Time management across studies, projects, and internships,Interview pressure and soft skills
322	1528	Leadership, Management	Confidence	NA	NA
323	1534	Versatility Across Technology Stacks,\nProactive Learner,\nHigh Initiative	communication,\npractice	software engineer\nfullstack development\nAIML engineering	presenting my skill in front of person ahead of me. even though I can do work but presenting it to someone is a challenge for me
325	691	Hardworking when engaged in fields of interest\n\nStrong curiosity and willingness to learn\n\nAbility to stay committed to tasks that align with passion	Tendency to procrastinate on tasks\n\nLack of proper planning and time management\n\nUnorganized work habits\n\nUnclear or improperly set goals	Scope to improve organization and planning through tools/methods (e.g., planners, digital apps)\n\nEngineering field offers projects, internships, and teamwork that can strengthen discipline\n\nLearning from mentors/peers to set clearer goals and priorities\n\nOpportunities to channel hard work into structured productivity	Risk of falling behind deadlines due to procrastination\n\nDifficulty in achieving long-term success without goal clarity\n\nUnorganized habits may reduce efficiency in competitive environments
326	1550	Self motivated	I can concentrate at one thing at a Time	Networking via LinkedIn, hackathons, and coding contests.	High competition in placements and job market.
328	1575	Na	Na	Na	Na
333	1567	Good Management skills, Communication skills, \nBuisness management,\nEvent management	I don't get convinced easily	To give more exposure on industry level projects	Attendance Criteria
334	1529	Strong problem-solving skills, demonstrated through building AI/ML projects like helmet & seatbelt detection and recommendation systems.	Public speaking is still a developing area, though technical presentation skills are improving.	Growing expertise in AI and computer vision opens pathways in research, internships, and industry projects.	While working on the helmet & seatbelt project, collecting diverse and real-world datasets posed difficulties in terms of volume, variety, and labeling accuracy.
335	1576	Confidence in expressing ideas — great for leadership roles, presentations, and networking.	I get  little aggressive when things don't work in my Favour	Opportunity to explore content creation (singing/dancing/cooking + tech tutorials).\n\nNetworking and personal branding through public speaking and creative showcases.	Rapid tech changes — need continuous learning to stay relevant.
336	1562	Quick learner \nTeam player \nActive Listener\nLeadership skills	Time management \nProcrastination	Data analysis and visualization \nMicrosoft certifications	Poor time management
341	1515	Strong Communication Skills: I am adept at clearly and concisely conveying complex information, both verbally and in writing. I am also an active listener, which helps in understanding needs and fostering collaboration.\n\nProblem-Solving: I enjoy tackling challenges and can effectively analyze situations to identify root causes and develop practical, efficient solutions.\n\nAdaptability and Quick Learning: I am able to quickly grasp new concepts, technologies, and procedures. I thrive in dynamic environments and can adjust my approach to meet changing priorities.\n\nTeamwork and Collaboration: I work effectively as part of a team, contributing positively to group projects and supporting my colleagues to achieve common goals.\nStrong Work Ethic: I am dedicated, reliable, and committed to producing high-quality work. I take initiative and am proactive in managing my responsibilities.	Public Speaking: While I am comfortable in small groups, I sometimes feel nervous when presenting to large audiences. I am actively working on this by seeking opportunities to practice and taking presentation skills workshops.\nTendency to be Overly Critical of My Own Work: I strive for perfection, which can sometimes lead to spending too much time on a single task. I am learning to balance quality with efficiency and to trust in the value of "good enough."\nDifficulty Delegating Tasks: I sometimes take on too much myself to ensure it's done to my standards. I am practicing how to delegate effectively, trusting my team members and providing them with clear instructions and support.\nLack of Experience in [Specific Software/Area]: I have limited hands-on experience with [e.g., a specific programming language, a new marketing tool]. I have started online courses to build my proficiency in this area.	Industry Growth: My field is rapidly expanding, particularly in the area of [e.g., Artificial Intelligence, Sustainable Energy, Data Analytics], which presents numerous opportunities for career advancement and skill development.\nFurther Training and Education: My company offers support for professional development. I see an opportunity to take advanced courses or certifications in [e.g., Project Management, Digital Marketing] to enhance my skills.\nNetworking: There are several upcoming industry conferences and online webinars. These are great opportunities to connect with experts, learn about new trends, and build professional relationships.\nMentorship: I can seek out a mentor within my organization or industry who can provide guidance, support, and advice to help me navigate my career path.	Rapid Technological Changes: Technology in my field evolves quickly, which requires continuous learning to stay current and avoid having my skills become outdated.\nCompetitive Market: The job market is highly competitive, with many talented professionals. It is a challenge to continuously differentiate myself and demonstrate my unique value.\nWork-Life Balance: The demands of my role can sometimes be high, making it a challenge to maintain a healthy work-life balance and avoid burnout.\nEconomic Uncertainty: Broader economic shifts or budget constraints could potentially impact project funding, resources, or job security within the industry
344	1514	Resilient, Team collaboration, cooperative, Good listening skills, Creative, good technical foundation, Adaptability, Problem solving	Self conscious, Incomplete industry readiness, Limited soft skills, shallow practical skills	Placements, internships, Final Year Project	High competition, Evolving industry needs, Balancing Career prep and Academics, Imposter syndrome
346	1577	Time Management, Leadership, Team Work, Communication	Less Industry exposure	Adapting Self according to the industry	Sustaining in the Industry
348	1519	Leadership	Sometimes go in depth about the things that i personally feels not good	Availability of free online tools	Time constraints with academics
350	1400	Descipline, teamwork	Stage fear , public speaking	Played football tournament from college	Stage fear
351	1402	Leadership	Time management	N	Growth in AI
358	1544	Being fresher I can say I have strong creative idea and problem solving abilities.	I have fever industry networking and exposure.	Ready for open internship and placement offers.	Market slowdown and global issues may affect job offers.
367	1340	Logical reasoning, Emotional Quotient, Fast learner	Lack of confidence in social interactions	Internships and Industrial visit to know the work environment	A highly competitive academic environment.
397	1369	Flexibility in work, optimized, high quality output, Ability to Work well Under Pressure, Strong Core Understanding of Fundamental Technical Knowledge. Grit and want to always learn something new.	quality and optimisation centric approach.	.	Long college Hours, Academic Pressure, need more Exposure to hands-on workshops, bootcamps organized by college for better Domain Specific Knowledge, no incentive against work.
331	1572	Good communication skills – shown in MUN participation and event promotion roles.\n\nProven leadership and coordination – experience as Infinity promotion coordinator, Zenith co-coordinator, student council member	Balancing academics, commitments, and self-care can get overwhelming.\noverthinking	Chance to become Promotion Head of Infinity this year (natural growth from last year’s role)\n.Networking through internships, college events, and leadership roles.\nGrowing awareness and work on mental health (even developing a chatbot project) – potential to turn into something impactful.	Competition in career opportunities (tech + leadership positions).\n\nBurnout risk – juggling studies, events, internships, and personal goals.
338	1580	Communication\n\nCreativity\n\nProblem solving\n\nLeadership\n\nTeamwork\n\nAnalytic reasoning\n\nCustomer service\n\nTime management\nActive Listening	trust someone quickly and shy , fear of public speaking.	Technological Advancements\nMarket Trends\nEducational Opportunities\nNetworking \nCompetitor Weaknesses	Basically include  over-analyzing internal factors, failing to address changing external conditions, and subjectivity due to biased interpretations. Other issues involve a lack of clarity in goals, poor communication between stakeholders, difficulty obtaining sufficient data, and failure to translate findings into effective strategies.
340	1525	Problem solving and quick learning through practicals	I find public speaking difficult, but I'm working on it.	I seen the growth in domain AI/ML, so I'm thinking of doing course or making a project based on that.	There is high compitition for getting a job in IT sector, so I need to stand out with good skills and projects.
345	1551	1.Consistently maintained 8.0+ CGPA across all semesters.\n2.Strong foundation in Computer Engineering fundamentals.\n3.Certified in Data Engineering, DBMS, Machine Learning, and Data Analysis from NPTEL and Coursera.\n4.Hands-on experience in full-stack development through the Online Blood Bank Management System project.\n5.Self-motivated learner with focus on continuous skill development.	1.Limited exposure to industry-level internships and live projects.\n2.Need to improve public speaking and presentation skills for professional settings.\n3.Sometimes spend more time on perfection, which affects time management.\n4.Relatively less experience in cloud platforms and scalable system design.	1.Growing demand for data engineers, analysts, and full-stack developers in the IT industry.\n2.Scope to work on real-world projects and internships to gain practical exposure\n3.Opportunity to publish research papers \nor project work in academic/technical\nevents\n4.Access to online platforms (Coursera, NPTEL, GitHub, Kaggle) for skill advancement.\n5.Chance to build a strong career path in emerging technologies like AI/ML and Data Analytics.	1.Highly competitive job market for fresh engineering graduates.\n2.Need to keep pace with rapidly evolving technologies and tools.\n3.Balancing academic workload with skill development and certifications.\n4.Limited networking opportunities in comparison to students from Tier-1 institutes.
349	1522	Hardworking, quick learner, good communication.	Overthinks, self-critical, takes on too much.	Skill growth, internships, career development.	Competition, time management, adapting to fast tech changes.
353	1433	Adaptability, Teamwork & Leadership, fast & quick Learner	Overthinking, Public Speaking	Growing global demand for AI/ML, GenAI, and Data Science engineers.\nLeadership experience gives you an edge for managerial or research roles in the future.	High Competition, Keeping Up with Fast Tech Changes, Placement/Internship Prep
357	403	Hardworking, Eager to learn , Time Managemenet	Less Industry Explosure	Internships	Lack of opportunities
366	1404	I have a strong academic foundation with consistent performance (89%+ in 10th & 12th and a CGPA of 8.02 in B.Tech), further validated by the prestigious INSPIRE-SHE Scholarship for being in the top 1% of Class XII students. I bring valuable hands-on experience through diverse technical internships in AI/ML, Data Science, and Analytics with reputed organizations like Deloitte, AICTE-EduSkills, and 1Stop.ai. Alongside this, I have developed impactful projects including a sentiment analysis web app, YouTube video downloader, histogram visualizer, and a student result management system. My wide-ranging skill set covers multiple programming languages (C, C++, Python, Java, JavaScript, SQL) and modern tools such as Tableau, Flask, Pandas, and Matplotlib, complemented by structured certifications through NPTEL courses. Beyond academics, my balanced personality is reflected in achievements across extracurriculars like modeling, dance, content creation, and video editing, showcasing both creativity and confidence.	Sometimes I get too focused on perfecting small details, which can slow me down. However, I am learning to manage my time better by prioritizing tasks and setting deadlines, so I maintain both accuracy and efficiency.	I have multiple opportunities ahead of me, especially with the growing demand for AI/ML and Data Analytics professionals in India and globally. My INSPIRE-SHE scholarship eligibility and strong academic background also open pathways for higher studies, research, and GATE/M.Tech fellowships. With my profile and skill set, I am well-suited for placements and internships with top recruiters like TCS, Infosys, Deloitte, Accenture, and even product-based companies. Additionally, my passion for content creation and video editing can be leveraged for personal branding through LinkedIn, GitHub, and portfolios, helping me stand out in the competitive market. By participating in hackathons and competitions, I can gain real-world problem-solving exposure, while my existing AWS knowledge provides a base to expand into Cloud and Data Engineering through certifications in AWS, Azure, or GCP.	One of the key challenges I face is the high competition in AI/ML and Data Science, as these fields are saturated with skilled graduates, including those from IITs and NITs. While I have completed meaningful projects, they still need to be scaled to larger, industry-relevant datasets and complete end-to-end pipelines to stand out. Another challenge is maintaining the right balance between soft skills and technical expertise, as my strong extracurricular background must align with corporate expectations during interviews. In placements, factors like CGPA and competitive coding rankings on platforms such as LeetCode, CodeChef, and GFG play a crucial role, which means I need to further strengthen my coding profile. Lastly, I will need to adapt confidently when transitioning from virtual internships to real-world, on-site environments, where teamwork, communication, and professional presence become equally important.
369	666	Can understand certain subjects easily	Difficulties in maths and some coding languages	Quiz and tests	To keep up with the ongoing subjects
342	1516	Creative, hard working, punctual	Self criticism	As an engineering student, I have opportunities to develop strong technical and problem-solving skills through both theoretical learning and practical applications. My college provides access to industry-relevant workshops, internships, and project-based learning. I also have the opportunity to collaborate with peers on innovative projects and participate in technical events and hackathons, which help in building a strong foundation for my career.	One of the main challenges I face as an engineering student is balancing academics with extracurricular and personal development activities.
343	1533	I have strong technical skills in Python, time series forecasting, AI/ML basics, and game development along with experience in cybersecurity and digital marketing workshops. My passion-driven projects, such as a mini Minecraft clone and stock forecasting models, show creativity, problem-solving, and adaptability. I also bring enthusiasm for continuous learning and the ability to apply trial-and-error to master new libraries and tools.	I sometimes rely too much on trial-and-error approaches, which can extend project timelines. While I have worked on individual projects, I need more exposure to large-scale collaborative environments and industry-standard workflows. I am also still building confidence in advanced deployment practices and refining my presentation skills for professional audiences.	The growing demand for data-driven decision-making, cybersecurity, and automation opens exciting career opportunities. My mix of technical knowledge, hands-on projects, and startup mindset allows me to contribute to innovative solutions. I have opportunities to leverage certifications, internships, and personal projects to showcase versatility and position myself for roles in tech-driven companies or startups.	The biggest challenge lies in keeping pace with rapidly evolving technologies while also focusing on depth, not just breadth. Transitioning from academic and self-driven projects to real-world, production-ready solutions will require discipline, mentorship, and structured learning. Another challenge is standing out in a highly competitive talent pool, which I can overcome by continuing to blend creativity with technical execution.
347	1517	Positive Attitude	Fear of public speaking	Growing demand in AI, ML	Rapidly changing technology (need to constantly update skills).Limited time to master all required areas before interviews.
352	1552	Strong foundation in programming (C, Java, Python) and emerging technologies (IoT, AI, ML, Flutter).\n\nGood academic performance (8.5+ CGPA) and consistent learning attitude.\n\nProject experience in IoT, ML, and web/app development.\n\nTeamwork & leadership skills (ACM club, UBA Android team, NSS volunteer).\n\nDiscipline and sports background (athletics & cricket) → reflects endurance and focus	Emotional.	Can leverage certifications (IBM, Stanford, IIIT Nagpur) to specialize in niche areas.\n\nOpportunities to pursue higher studies (M.Tech, GATE qualification, or abroad).\n\nNetwork building through ACM Student Chapter and professional platforms like LinkedIn.	Balancing academic load (final year project, 7th–8th sem) with internship and other works.
354	982	My strength is I'm good at everything which I do, i have good leadership qualities and i am good at team work	I sometimes took more time in project to complete because I go in depth of the project which is not required.	I'm incredibly excited about the opportunities here.	I am ready for the challenge to face for the growth of the company and myself
355	1546	I am a curious and resourceful person who loves exploring across domains, from machine learning and web development to literature and creative expression. I persist through challenges and approach problems with determination, always aiming to refine solutions until they work. I am deeply creative and vision-driven, constantly seeking to build something meaningful rather than settling for the ordinary. My adaptability allows me to combine scattered ideas into practical innovations, while my love for emotionally rich literature gives me a deeper perspective on human experiences. I am someone who values both technical skill and emotional depth, which together shape my unique approach to work and life.	I am sometimes impatient when things don’t work as expected, which can make me frustrated and harsh on myself. I tend to explore too many areas at once, which sometimes stretches me thin and affects my focus on mastering one skill deeply. I can be a perfectionist, often feeling dissatisfied even when the outcome is good enough. I also struggle with self-doubt and restlessness, questioning whether I am truly deserving despite my efforts. At times, my curiosity makes me shift directions before fully polishing or completing what I start.	I have the opportunity to grow in cutting-edge AI and machine learning, especially in areas like gaze estimation, assistive technology, and human-computer interaction. I can build on my full-stack development experience to take on impactful roles or create my own products. My creative side opens doors for entrepreneurial ventures that blend technology with art and human expression. With my adaptability, I have the chance to seek global opportunities through internships, research, and collaborations. I also have the opportunity to share my insights through content and thought leadership, combining technical skill with cultural understanding.	I face the challenge of managing my impatience and frustration when progress is slower than expected. I often struggle with balancing my wide curiosity, which can scatter my focus across too many domains at once. Perfectionism is another challenge, as it sometimes delays me from finishing projects or being satisfied with my work. I also face the challenge of self-doubt, questioning my abilities even when I achieve good results. Additionally, I need to work on staying consistent and fully polishing projects instead of shifting directions too quickly.
360	701	communication	maths	business	some health issues
361	1320	Dedicated and consistent in academics.\nQuick learner with the ability to adapt to new concepts and technologies.\nGood communication skills and teamwork ability, making collaboration smoother.\nOrganized and responsible in handling tasks and meeting deadlines.	Sometimes overthink or spend extra time perfecting work, which may affect efficiency.\nLimited practical exposure compared to theoretical knowledge.	Availability of diverse learning resources, workshops, and online platforms for skill enhancement.\nParticipation in internships, projects, and competitions to gain real-world experience.	High competition among peers, which demands continuous improvement.\nRapidly changing technology and industry trends requiring constant upskilling.\nBalancing academic work with extracurricular activities and personal growth.
365	1537	Problem solving abilities, technical abilities, time management, team work and collaboration and focus under pressure	Overthinking details and delegation	Expanding skills set, networking and collaboration, certification and workshops, innovation and entrepreneurship, interships and projects	Real world, keeping up with the fast-evolving tech, standing out in competitive, resource constraints
356	981	Capability of doing work once taken, Good communication, quick learner, problem-solving, disciplined.	Stage fear, Overthinking, less experience, time management issues.	Skill growth, online learning, career openings.	Whether I can do it or not what is decided, because of High competition, fast tech changes, work-life balance.
359	431	Skilled in sports & strategy\n\nCurious and analytical\n\nCreative problem solver\n\nStrong technical skills\n\nStrategic mindset\n\nAdventurous & adaptable\n\nGood communicator\n\nIndependent yet team-oriented	Overthink small details\n\nPerfectionist at times\n\nImpatient with slow progress\n\nCan struggle with time management when juggling multiple tasks\n\nPrefer independence, which may affect delegation	Growing demand for AI, data analytics skills in industries\n\nExpanding scope in sports technology and management systems\n\nRising interest in astronomy and space research\n\nIncreasing need for cybersecurity & smart automation in colleges and organizations\n\nNetworking with professors, industry experts, and sports communities for guidance and exposure	Balancing academics with multiple projects and interests\n\nManaging time effectively across sports, coding, and research\n\nStaying consistent without getting distracted by new ideas\n\nHandling pressure in competitions and interviews\n\nTurning creative ideas into fully finished, polished outputs\n\nKeeping up with rapidly changing tech trends\n\nFinding the right mentorship or guidance at the right time
362	1356	N/A	N/A	N/A	N/A
363	424	Connections, Knowledge, Communication	Lack of Discipline	.	.
364	408	Deep understanding of AI concepts, including explainable AI methods, interpretability, and transparency.\n\nStrong technical problem-solving and analytical skills, developed through coursework and academic projects such as IoT smart street lighting.\n\nAbility to quickly learn and apply theoretical knowledge in practical scenarios like sensor technology and operating systems.\n\nRegular exam preparation habits and an advanced comfort level with academic research and technical documentation.\n\nActive engagement in event promotion roles and social initiatives, enhancing teamwork and organizational experience.	A key weakness is feeling distressed when ignored in group settings, which can affect collaboration.	Growing demand for AI interpretability research and embedded system innovation offers ample space for impactful projects and academic recognition.\n\nParticipation in sustainability-themed departmental events provides a platform to enhance leadership skills and expand professional network.\n\nIncreased focus on technical writing and academic publication can open doors for internships, research grants, and global collaboration.\n\nRapid advancement of IoT, MEMS, and sensor-based startups in India creates new pathways for entrepreneurial ventures and hands-on industry learning.	Highly competitive environment in technology and research; sustaining motivation and standing out among peers is demanding.\n\nBalancing academic workload, personal health, and extracurricular activities, especially with imminent deadlines such as the AI paper submission.\n\nTransitioning theoretical skills to real-world complex problems, such as integrating AI with explainable interfaces or deploying large-scale embedded systems.\n\nKeeping pace with fast-evolving trends in AI and embedded systems, which requires continuous learning and proactive adaptability.
368	1530	My strength is that I am a quick learner with strong problem-solving skills and the ability to work on both backend and frontend technologies	My weakness is that I sometimes focus too much on perfection, which can slow me down	My opportunity is to apply my technical skills in real-world projects like ModelMate, which can open doors for internships, placements, and innovation opportunities.	My challenge is to balance time between academics, projects, and personal growth while ensuring consistent progress.
370	376	1.Good knowledge of programming and computer science basics.\n2.Quick learner of new technologies.\n3.Experience from projects and teamwork in labs.	1.Less real-world industry exposure.\n2.Still improving problem-solving and time management.\n3.Dependence on guidance for complex tasks.	1.Internships, projects, and hackathons to gain experience.\n2.Online courses and certifications in trending fields (AI, Cloud, Cybersecurity).\n3.High demand for computer engineers across industries.	1.Fast-changing technology that needs continuous learning.\n2.Balancing academics, projects, and skill development.\n3.Need to improve soft skills like communication and leadership.\n4.Strong competition for placements.
371	316	Grasping is good	Discipline and distraction	Acm chapter	Discipline
372	426	People friendly, politeness ,communication, \nInteractive.	Social awkwardness, over thinking	Rising interest in sports	High competition
373	685	Good foundation in programming languages (C, Python). \n\nAnalytical and problem-solving skills\nCan communicate well with people	Have some stage fear and don't have much leadership quality	High demand for skilled software engineers in AI, Data Science, Cybersecurity, Cloud, and IoT.\n\nOpportunities for internships, coding competitions, hackathons, and open-source contributions.	Intense competition from peers in coding and placements.\n\nKeeping up with rapidly changing technologies and industry trends.
374	1531	NA	NA	NA	NA
375	444	1.Strong foundation in Computer Science concepts with hands-on knowledge in programming and problem-solving.\n\n2.Skilled in Full Stack Development (frontend + backend) and currently learning Flutter for mobile applications.\n\n3.Quick learner with adaptability to new technologies and frameworks.\n\n4.Good analytical and logical thinking skills, helpful for competitive exams like GATE.\n\n5.Strong teamwork and communication abilities, with a positive and growth-oriented mindset.	1.Sometimes focus too much on details, which can slow down overall speed.\n\n2.Still building confidence in public speaking and presentations.\n\n3.Need to improve time management when balancing academics, skill development, and projects.\n\n4.Limited industry exposure as of now, which I am actively working to improve through projects and internships.	1.Growing demand for software engineers, full-stack developers, and mobile app developers worldwide.\n\n2.Scope to pursue a Master’s in Computer Science in Germany, which will open up global career opportunities.\n\n3.Availability of online platforms, open-source projects, and internships to gain practical experience.\n\n4.Opportunity to leverage AI, Flutter, and cloud technologies in real-world projects.	1.High competition in the tech industry requires continuous skill upgradation.\n\n2.Managing multiple priorities: GATE preparation, academic backlog, and skill development.\n\n3.Financial and admission challenges for pursuing higher education abroad.\n\n4.Need to consistently bridge the gap between theoretical knowledge and real-world application.
376	417	Dedication, organized	Procrastination	Came accross many opportunities within institute, department and college National level	Dsa, upcoming technologies
377	983	I’m very adaptable and can quickly learn new tools and processes, which helps me perform well in dynamic environments.	I can be a bit of a perfectionist at times, which means I sometimes spend more time than necessary refining details. I’m learning to balance quality with efficiency.	I see opportunities in continuous learning—taking certifications and upskilling in areas like AI and data analytics to stay ahead.	Adapting to frequent organizational changes can be challenging, but I use them as opportunities to learn new processes and demonstrate flexibility.
132	406	Quick Learning	Time Management, Team Work	Internships	Communication, Confidence
378	411	Strong problem-solving skills and logical thinking.\n\nAbility to work well in a team as well as independently.\n\nGood communication and presentation skills.\n\nConsistent learner with adaptability to new technologies.\n\nPunctual, disciplined, and committed to completing tasks on time.	Sometimes take extra time to ensure perfection.\n\nLittle bit Emotional and Sentimental \n\nLimited practical industry exposure\n\nOccasionally overthink before taking decisions.	Growing technical and industrial exposure through college activities, hackathons, and projects.\n\nWide scope to improve skills via online learning platforms, certifications, and industry mentorship.\n\nIncreasing opportunities in government and private sectors for skilled professionals.\n\nChance to contribute innovative ideas to society through technology and social initiatives.	High competition in both academic and professional fields.\n\nNeed to balance multiple priorities such as academics, projects, and extracurricular activities.\n\nRapidly changing technology trends require constant upskilling.\n\nLimited time and resources for implementing large-scale ideas
379	397	Strong leadership qualities, proven experience as Vice President and SRC, effective communication, and successful event management also have good academic background.	Sometimes lack in technical knowledge	Scope to lead larger flagship events, enhance networking, and develop skills for future professional leadership roles and building a start-up.	Balancing academics with leadership duties and managing diverse teams under pressure but capable to handle it .
381	1331	Good at adapting quickly to new situations and learning new concepts.\n\nStrong communication skills and ability to work well in a team.\n\nDedicated and hardworking, always trying to complete tasks on time.\n\nPositive attitude and willingness to take initiative when needed.	Sometimes tend to overthink decisions, which slows me down.\n\nCan be a bit of a perfectionist, spending extra time on small details.\n\nNeed to improve on delegating tasks instead of trying to handle everything myself.	Opportunities to learn and grow through new experiences, projects, and responsibilities.\n\nChance to develop leadership skills by taking up roles that involve guiding others.\n\nGrowing network and connections that can open doors to career and personal development.	Balancing multiple responsibilities efficiently under pressure.\n\nStaying consistent and confident when facing failures or setbacks.\n\nKeeping up with rapidly changing technologies and trends in today’s world.
382	1324	I have strong hands-on experience through DD-Robocon, where I’ve worked on robotics design, simulations, and mechanisms. I take initiative in projects like backend development for finance and payroll systems, showing adaptability and leadership. I learn best by doing and have a deep interest in AI and automation.	My depth in backend and web development is still growing, and I sometimes spread myself too thin across multiple projects. I also tend to rely on guided, step-by-step learning, and I’m still working toward tangible achievements that fully reflect my skills.	I see great opportunities in robotics competitions, full-stack development projects, and my involvement in clubs that allow collaboration and networking. The rising demand for AI-driven robotics and automation directly aligns with my interests, and my creative hobbies like photography and cinematography give me scope to build a strong personal brand.	I face tough competition in both robotics and software development, which means I need to focus on specialization and impactful results. Balancing academics, competitions, and side projects is a real time management challenge. Keeping up with rapid tech changes and ensuring my ambitious projects are executed effectively will continue to test me.
383	1342	1. I can adjust quickly to new environments, tasks, or challenges.\n2. I can take ownership of your responsibilities and consistently meet deadlines.\n3. I can approach challenges logically and find effective solutions.\n4. I can collaborate well with others and contribute positively to group efforts.	Speaking in front of groups makes you nervous, but i am gaining confidence with practice.	I want to Publish 2 or 3 Research based or Project Based Paper in a good Publication.\nI also wanted to grab a Internship and placement in my prefered Domain	I am facing challenges for managing time for between development and DSA. \nAlso Unable to find Proper Guidance for domain
384	1374	Good communication skills, Good at handling academic pressure, Innovative mindset, Consistent at work, High adaptability	Need to focus on time management and should gain quality of thoughts.	Emerging technologies, competitive exams, new collaborations.	Intense competition, hard to manage time for competitive exam preparation.
385	1326	confident and ready to learn something new	lazy and i procrastinate a lot	eager to take on new opportunities	sometimes i waste my time alot and pften push away my responsibilities
386	1335	Im creative, i know art , im a quite learner,i have potential to do n work on things I wanna do.	Not able to keep up with the aim.	_	Lack of information and guidance.
387	440	Dedicated to academic projects and commitments (ACM Website, UBA Website, events).	Get nervous in exams/presentations; sometimes overthink.	Improve technical & soft skills through projects, internships, and events.	Self-doubt and balancing multiple commitments.
388	658	Focused, adaptable, quick learner, determined.	Inconsistent, emotional, easily distracted,	Growth in skills, better academics, fitness, networking	Time management, discipline, handling setbacks, limited resources.
389	1319	Confident,good communication skills	Laziness,procrastination	Opportunities to learn and grow through new experiences, projects, and responsibilities.\n\nChance to develop leadership skills by taking up roles that involve guiding others.\n\nGrowing network and connections that can open doors to career and personal development.	I tend to overthink which slows my decision making.
390	348	--	Techincal Skills	--	--
391	1557	Public Speaking, Communication, Fluency in Spoken English, C , C++, Python, OpenCV.	Lack of discipline while following routine, Uncomfortable while opening up conversation with peers.	Campus Placement Drives, Interview opportunities both online and offline.	Long term endurance, Connection and networking opportunities
392	398	Fast learner	Possible time management issues	High-paying roles in FAANG, startups, fintechs\nStrong project portfolio → standout resume\nMS in CS abroad → global exposure	Very high competition for FAANG/top startup roles\nBalancing IELTS prep, placements, and projects together\nRisk of burnout due to ambitious goals
393	674	Problem solving skills	Coding	Environmental solution	advanced technical subjects like mathematics and mechanics
394	710	Eager to learn	Communication	Technical	I am Not in any field or domain
395	373	sports,family, friends, communication.	stage fear , lack of confidence.	college events , members in events.	lack of confidence, soft skills.
396	1375	Technical Skills	Soft Skill(speaking)	-	-
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, username, email, password_hash, role) FROM stdin;
374	24003117	tanushreedeshpande.24@stvincentngp.edu.in	scrypt:32768:8:1$YcXznBlEcTqFbePZ$fe0bf38edae1e828d6f1f0571535717df59a9039e56ff17e940b10b43c4710548e4c6603b8b0a1bf8f085e9c1c4351903482644005db3f44ad36b579cb5a0e5a	student
375	24003122	shivnayanthakare.24@stvincentngp.edu.in	scrypt:32768:8:1$M9O98nffDKV9Nuu6$ae7886306eab8224a297cecaf587f0401f63ea2d42c2dac054182d2fb4050bac80d5c573374eda2ae41f3d70ab273af4a30878413cad537b98c947338570beea	student
376	23001135	sanandsabne.23@stvincentngp.edu.in	scrypt:32768:8:1$Kdn86x0u40Zb1eQ6$7e528a6895571ea80f0bebcd927383ab569293f82b10e1d79621576b4b6e9f1a633b7340d389be96e473949a26529f31e48da6fb1a56b0c6e3feb585c804ab1d	student
379	23001003	nimishanair.23@stvincentngp.edu.in	scrypt:32768:8:1$2kzcmFBjcV9fhQlq$772376e3f2fcb8a9728729714140937f8759ba314c818eb639777d7dc2c67aeec0490444be1ed0e66d5fcde1219f22b0c63c17c80091d273755470f50d252dd5	student
382	23001008	jenikabarai.23@stvincentngp.edu.in	scrypt:32768:8:1$b8lJ5dxKEKvG4xFw$c57fe5e0cb91216000332dc16f40a44e6e382a07154392d54f666369455f8e3b5df858d546adf66d69e730c8882e7e2252539c97bdfeb945499e65be233cb0c9	student
386	23001018	devanshuekhar.23@stvincentngp.edu.in	scrypt:32768:8:1$fCKpGZZ5krH9HhbA$ef118773f088ee9adb6b78c873cf714733fcf32235a56a98f30ea0390f366be1ff24fc0af0c3de4780808ce3fb973ba7b68d92644ab180450a7337087e9d38a4	student
388	23001021	sanketkadhao.23@stvincentngp.edu.in	scrypt:32768:8:1$00XeL6zZOQd7R3Z7$03cff71210aff13d92e63678d54b584ca88ce9aaa4e568f982563867bfecfaab432855b39ec5fa86ef572866954924705a04f38f5306098ae0cf13f16891c1f5	student
389	23001024	bhairavisawale.23@stvincentngp.edu.in	scrypt:32768:8:1$bzESCh1jBBhmEtOA$8653a1ccd582ad905283480af7d893fb364bea78051abe749d17ebb5793ab5acb99084e66cc76fcc028518479bcb36c43cd256fb1574eae3439a4dfba5aa2485	student
390	23001027	nupurthakkar.23@stvincentngp.edu.in	scrypt:32768:8:1$uxsdpxo2NGUquoOR$52fec3ada17d6452b29744246fd295f386d2b9d3edf7cf894ac726d32fca9ef409c26a5f664e03f8756378e04c31492b72cc57b89c51dedcad666ace765c65ba	student
391	23001031	annlinmathew.23@stvincentngp.edu.in	scrypt:32768:8:1$ZiAsapk8VtOr0Wao$d57f0a7c749ac715b13cc6d57d3e45688d1117ab8d0f0b5bc485044cbf89a03239b8637661c0d7b53735c387bc704f315f760644704930947c7d79a449179f68	student
392	23001032	peternicholas.23@stvincentngp.edu.in	scrypt:32768:8:1$UiUYs4pTlBE1QnMt$5a7b652e7d9ee8060f0534a6ecaa274433cefe50b81cda3710d819ac9997e24ee5c177abee5de2631d53d0a8f366793be2fe18d83c8656a869fbfbddbc58bbec	student
395	23001036	kencheran.23@stvincentngp.edu.in	scrypt:32768:8:1$0Gxa0fIjDAe30JVZ$50ccc14e2ae87c6a8dd2d0be99a4c2b03f219629cb0e24ecfa963e00f50ecdd0903db21dbe5037635ad23b61c430395735986f75208e2f2688ce5678fe9d3132	student
396	23001040	shawngregory.23@stvincentngp.edu.in	scrypt:32768:8:1$rNGLWI5r5OCadJVh$bdc2e4b261d72d4e1a0011a1218eee90edd7727028bb5921ae99357154ca5fcc6ffaab3c6160f8a5650d7ba1461b156fbd9e09d4628fb986c24310e54a5516c5	student
398	23001046	sebastianguntur.23@stvincentngp.edu.in	scrypt:32768:8:1$1HGP3trSPdrIN6WX$46c18d5ca57c72499599a555dc5b038cdfcacb9afa99f596e85484de709edb37a5f85b9297a0f6aa478ce88ce273953791f90a330b396412c9ef3f5a1e062416	student
399	23001047	anoshsukhadeve.23@stvincentngp.edu.in	scrypt:32768:8:1$VEBL5LxXl7xPL1dV$7ccf66a3240d87ab4936c63a58e82e1979e14fb33dc8473cb6e84baeff177585c20931cd680a67b97a1f2b09bea398ce4fca919d93458406a39ae4330a655ab7	student
400	23001049	petersalve.23@stvincentngp.edu.in	scrypt:32768:8:1$bgqTWKLRhjr5Qe8H$d97305039a8df595acac163292afdff486afb82609e4934c04697eb336b089598732d08735ed2b14871083636acc4c6dd7792644bcb68ae4e590f4fc9ff550ea	student
401	23001051	gregorythomas.23@stvincentngp.edu.in	scrypt:32768:8:1$BDXoQsvjiLk5RvL9$28869c7f2303cb76c844b79332a433cd74a02ccbf50e1224d787c3493e5c1f8e95f12421126188898758dcdaf125fa750b7fce5868098e7f8f2204f9b12b61d0	student
403	23001055	tanvikshirsagar.23@stvincentngp.edu.in	scrypt:32768:8:1$ayXMutL5beK30ReX$f303938d2b108dbf7c32a2079b5879151b5a8d04ccecd3b7ff0ec47056b8d0edf7f051ac4d50e84b9c56b858a34ff8cb59604162042e01c9006956a897cb4539	student
384	23001014	sejalbhupal.23@stvincentngp.edu.in	scrypt:32768:8:1$cZtkmhKZqxu62Lxg$173aa6d4cb04bf34696a6b9ee5fec81abd421c1ed546f8d5e14cb3f2bab072a115fa517fab1fe5f8c79b02c47c7fbecf504347ed6ae895c458b5fd3682d8e659	student
402	23001054	shreyashtawade.23@stvincentngp.edu.in	scrypt:32768:8:1$yBsfWeHkd3mjjUvy$546975a1fc0fabaf71e125928e220502c52a102b67546a805053a99d787485a7f4ce376c78fffad54e65be6f37a28ddf859d521b0c4d086fd563682f6298f23e	student
387	23001019	vanshikakhedkar.23@stvincentngp.edu.in	scrypt:32768:8:1$Z9VkrhkyNR0VqTUC$c6656fd1741f53779e89118fb984e55386a90c036f741e61277dc66861a3e6fc13eec61f988f5314ebf9e6064a805e8efba0703e28e8cf0974f9d3f04f376a84	student
385	23001015	vedantlade.23@stvincentngp.edu.in	scrypt:32768:8:1$U9pGtBv5zeUInVqR$c7b1fa6d3fe30e98cd6b4732f5c695fad60368bddacec3d80f5f69bf573976cf13726ae8ce1fe2b2c731746f463da03d9ebe841ef97ec94e1aed6f4786d10b26	student
381	23001006	shreeshpawar.23@stvincentngp.edu.in	scrypt:32768:8:1$vGLa8rIObag6ZbT9$437bc45bb7c17bf6fbecb5984d2b9e8d7db18ef4b318e8d2533f9817991e296239eb3f4553ee3570b0b13b60bf41fb2eef3a941ae195efcea8af243cf6e52ea3	student
383	23001012	sayalibambal.23@stvincentngp.edu.in	scrypt:32768:8:1$drea867rSMXyCele$82e5b299b8d2b1ac602817bf5a1f5dbf6d34a5c632227834a81dbcf2ff17c8137dd2c41a39a791d5f93febfcbf5756b1eda7a4ed8e57d478122b6152fe1f56b8	student
394	23001035	teenalbiju.23@stvincentngp.edu.in	scrypt:32768:8:1$VKLu4wamRGRBOg4k$f538997e7bc5bb5b7d57498cb5f31a7e98af7160403c6235ae0aab7c090157328a0e910106b7cb6b29045a9241bb5f439bc24bc0d8b50a34197f6db85b4d9324	student
378	23001002	indrayanimude.23@stvincentngp.edu.in	scrypt:32768:8:1$eU5FV81YBoDDW0QN$2a0fca4b985930945bdaba892dd6e9daf3ce8697d7f8e6ed3f153d63565b37a6299c93fcbb3757f2a2da20dcac68afb612d66987b330a4e7aa2038ba2c526ad1	student
393	23001033	roshnikhedkar.23@stvincentngp.edu.in	scrypt:32768:8:1$su26XWjJXqA2RLsM$056b8a6ccfbd5e6faf13e6177fd8b37f93a3e634263bf18540c50ce9977ae38be22cc92a447a53541685bc3fda6ec0fc4a7bca4b706d04f0114c554e43215a09	student
397	23001045	deveshbanote.23@stvincentngp.edu.in	scrypt:32768:8:1$HivIgb5q0LBdGcGd$e4096fb187b5c73190527adb6021ccb4ee438a3844b503baab77953ec8192f4154c7c56f448c97c500189e95f542bb9814fa06fa2822bff6040fd76549b58dd5	student
380	23001004	siddheshbhiwapurkar.23@stvincentngp.edu.in	scrypt:32768:8:1$mtkg3VLbQ3NoA3sL$35ad36fa266262226fd2fb10eb4d1e52c06136d617483105b0dcf3901a9dc52c8136965b4ff077bf84f3c4b5c6942d2f2ab32989e5ede6fef985fbe8ed817dd1	student
408	23001065	anchalgupta.23@stvincentngp.edu.in	scrypt:32768:8:1$8zxMFEvicLAw5YZM$3a89a7833b044632e3c68abbd1df36737b6b791a13989631a7de9156868a826a5382bdb70aec0934ac6855d323559450d0bd792e850b096e604e026dfd3e9f0a	student
414	23001088	darshangadekar.23@stvincentngp.edu.in	scrypt:32768:8:1$Ic5eVzOYhuK3je0r$16c6197c6d7c1180670691b46b45b828241c30b8b6587ad481d5dc386d386f6bd519b8bbf0dd727b253a68833267e26b39995bff46d9c7449ea5481e707ee86b	student
1905	phase6_secure_1771487448444	\N	$2b$10$AOfEkkTSpnQ.L2GK7DbSp.wISHmE.HSNTWxgxhfh3hZfViltvszY2	student
415	23001089	kshitijdeshmukh.23@stvincentngp.edu.in	scrypt:32768:8:1$4PDHdO1RRlcqjGAd$39193baa2b3329d9a7f701d2819cd56ac608e9a88f1753d69dc418aa75756831ac7ff114aa7e2288e8d75ef5406639164969b4ef4bf78473d2375ee4eb4ef616	student
416	23001090	anveshmulkalwar.23@stvincentngp.edu.in	scrypt:32768:8:1$c5HbZb99mYJlDXpW$d32c1305b358c06b8893d14153b0cac024276c332224f899bd77ab95fb95d1ed9c27714c64e000e548ebffaa193c3d67a800a1518fb1a7bf0fdf1edecbc492c7	student
422	23001104	vedikamalhotra.23@stvincentngp.edu.in	scrypt:32768:8:1$eHu3T0zWSOcO9Hpl$edf4f55dfe14fec735e3cc6635bfdf61b03860795dd421a342a35a57606ed287fb58f06b091cdb06087009bc98906639d6e7218029f0d39f5d75b0bd3fffb8c9	student
428	23001119	jeenajoseph.23@stvincentngp.edu.in	scrypt:32768:8:1$uiBhTbLf5ooC9k7u$14d3580dcf6758c42a4b0ad25785125a233fe57574326b1fe23d0cd4ce509f65ee99a3d5f9fc0be544b8ee08b290f2103c3623c6aaea1598034ff5fd1e2da04b	student
433	23001131	saveridongre.23@stvincentngp.edu.in	scrypt:32768:8:1$znegUzh2Mw8tNCYX$a2680ce03749e92b7765a13bdb6e195147b3bd11eccc74f91f2d173f2f9156f394cb5a59d44247edfb2d0f5b1b842a9219388b3b4d5c9ccb918b69ad9d968de9	student
434	23001132	sanyujasonkuwar.23@stvincentngp.edu.in	scrypt:32768:8:1$Q6cGzvVDJCTwSIey$03f5adeb5df7855a4ef46525beaaf8e8584b3d25fbb4350f62fc45122afe1ec32531f2e0237531d7a80c7c77e72ecf38e5f93bd4677f83bcced7e1b8989086b7	student
430	23001125	vaibhavinavghare.23@stvincentngp.edu.in	scrypt:32768:8:1$h25KgxsCgTu2USqT$2eeb5d65313851b6adfe92ba68e471fa54b7460c37f6846753199e2cca95be4e92f21c7d8beb4e9c914017c324a5a7f0c542f2b1f0d61ebdf63c66cda472eae3	student
407	23001064	vanshmaheshgawli.23@stvincentngp.edu.in	scrypt:32768:8:1$SYg8qeZ4IcgekmfB$33a186b5cf3e3fe372ca4e50a4fa55a875d756d981fd42c595f0b2b6e9b88470bca885ad1e4dc024e13d467205b5edf224edff61b8b09d4ae7fc3530213f089c	student
406	23001062	nishikantdalal.23@stvincentngp.edu.in	scrypt:32768:8:1$UovUxRE9emsfZE3e$788da4ad742437567dd8a1c4ba3572f5e69420cbd02c716a88612175a54393d88c3f4d84fa4e0f06feecbd57b2e4dd4efe1f35775b7ed3ff4d4796f05976b8a6	student
431	23001126	anushreekhadgi.23@stvincentngp.edu.in	scrypt:32768:8:1$KrdKzL9G1YYiztRL$b967cfa4227b8db47063f08a95c1ed34af4b3ed63e21512312c740d2582ecc44e6069fcc7d2211cf28a803f1599fe49db03002709aa6105b7988ff81ef6d77ec	student
404	23001059	mansirahangdale.23@stvincentngp.edu.in	scrypt:32768:8:1$fo8OlXqifPgWhm62$8d118835da46c891310ffd2c697381255d1261c2b3c262be5d5756972e2c2c202da275e8cc5fa042eed3583538d81f6a425b0834bc9cd16b1949857ae208d0d8	student
426	23001113	jonathanshiju.23@stvincentngp.edu.in	scrypt:32768:8:1$KRplDTRBwCrZTxet$d93b3705595db45fadcd54b770be084f143705ae8dba4a54b50441aa016c120232005f1a1f83ab0883488a348d4c29412782555c1e3bcad8c0c0417ee62a893c	student
425	23001112	siddhantshindey.23@stvincentngp.edu.in	scrypt:32768:8:1$8Dgf5nIwS169Hpsr$94a18478687035823c6bc41fe6f249624b4b329362929d653dcca3908030d21b74e2c5753a0bda90aeae97185172cb76855cbc711460ebbf9b7b23c68085f40c	student
424	23001109	krushnataiwade.23@stvincentngp.edu.in	scrypt:32768:8:1$xs2SNlIwGPUsGxlD$ccb4695c5fdac2476a3abbfc333cfdc559de5ccb310f42f031eb5dd4793c3c2ef759f6b9aeb1ddb34b9770f38e384e6b49ac00fd975ae6a4b0db30b127b5aec1	student
410	23001069	prafulkharpuriya.23@stvincentngp.edu.in	scrypt:32768:8:1$8EF9uf8pe9sWVgvI$816bd39df2b08e4586c60f9214e29c2668fec19ac7865bbafd4ade89f9f96080135306b6c476c56609a8fb102b3002bca6d242c5dad2a7be728306a3a83a8405	student
409	23001067	sanketnagpure.23@stvincentngp.edu.in	scrypt:32768:8:1$91ZJWzVZk3IW4qLh$2c29913c435261758b26e03dadda9cb690d4de53a7e708e5c7913045d6e89af01d7e16b581b78ae2924947b24a738ee5ade0104eaa2c06be2162b2659b2f4de8	student
429	23001120	palakdugad.23@stvincentngp.edu.in	scrypt:32768:8:1$d1uz8HW2oS9SLkGP$f68f101e0b1eacbc53adbd4d70da420081733b168004a51baecbb1e8615cfc303a4afd2f1f79d667517ad3aaf00f7fb15d613362038b90de0c2073a4163c8e94	student
419	23001098	vidhimenghare.23@stvincentngp.edu.in	scrypt:32768:8:1$Hz2pmePLh0xjncJF$e226348e52fb4ad178ef8d6df795e0ed83d518377455435f83ee749ed2667f9291093ecac5732a07bf13934a6794cc5696cc7191bd1a4885276d129f25bd4433	student
413	23001077	atharvakamde.23@stvincentngp.edu.in	scrypt:32768:8:1$vUMhkrskAouymCrU$1f092302cfc3c7f13acc0c35f2e4147c1cb9553ad69a0b46cfd690b727c1890288b21c966991626589b1206c68d7d7fcab3653718e74317de155ae31f6961889	student
423	23001105	hannahabraham.23@stvincentngp.edu.in	scrypt:32768:8:1$W803ZYreZVIlWayp$5f05f4bb5fce7fafae29c593350ac397c3f09ea53d4771775a2d2159b58a927b22c56f6cb22a0c4a4e0f457b74a8c312566cd1698aec5516681efa386eb2af9d	student
421	23001103	shivjeetpatel.23@stvincentngp.edu.in	scrypt:32768:8:1$UAHbKbTiBK7s8auN$b294676bcd3ecf16281f3d667d5051567efd2810ad0103ccdf6d4eb279322e71b7f356fe77cd6c548def5ee9af391be44a658eb1cfa501bcb82e2819aaa14ca0	student
405	23001061	mitalichatap.23@stvincentngp.edu.in	scrypt:32768:8:1$O1DgNK80RD3QBKaX$d1ddbf03efda4e2796a1505926c68b8adcdda4d84a458bd0d03f05b6229ea1dbe2f5eb93212e7f41329ca1d4ad4cf3070a18e9b14b73da581ad8f51d08714dc9	student
411	23001070	krishgokhale.23@stvincentngp.edu.in	scrypt:32768:8:1$jnmT0qACscmfEl5V$d343b03874f1e16d1089cafd94679ec7b6655d8d5c20b3380950798e17c8ee5384613531696a8b7d7eb600d5fc990942b576704e170c6b712775ebb13e577f7d	student
427	23001118	ayushjaiswal.23@stvincentngp.edu.in	scrypt:32768:8:1$2PAJLp7e5lqDluVx$dd3978b21d3ed635e257836b8e04ee37e1b49577f55596e6cf5f3bcbd42566c9c03b90f9d92ff5532652d968b3144ff938efc583ad6320f3115a8cfb26086aac	student
420	23001101	parthlonkar.23@stvincentngp.edu.in	scrypt:32768:8:1$ldr7sROMEAimRMfc$17737e1ccb7d1a1122ffdf12da8ac02c6dac13a290d556031a033e987a3d217202c8400d43f54e71e5501866f4202ea4b4638b396c3f18ec8003fb5f61049569	student
1332	22004037	yashmulankar.22@stvincentngp.edu.in	scrypt:32768:8:1$jV76pxJeS9EhACBp$414bd2ad437c29d6741844b72d61d56229a7055e996da36e8868ae29e0327943431cef10e7201be1f31c73e084164d42359f2f167d1e77714c8ae962ed52f083	student
333	24003036	vedantigosai.24@stvincentngp.edu.in	scrypt:32768:8:1$U4vSbER4nnl3IOVt$c9aabe3ba29af8996a00464ef3b78866d29bb111021609e91a84a9e124784516e41277ff827bd37ecbe4a65fb177540dddded01a008949ad76841b46efd76a78	student
341	24003052	gaurigotmare.24@stvincentngp.edu.in	scrypt:32768:8:1$nrjwH3yFWBr2mrF6$8d889c4ad51d1476af897ac8982886123aa56cd022cb12d97458dffaf87d0ff3f6a77491697a6c120135326f8fd5ed56d2b878f0757129433d7bae8d9dbc5603	student
318	24003007	esharode.24@stvincentngp.edu.in	scrypt:32768:8:1$FCODzSS90cmVTSZG$ece2dcf45f3458842ec892757356e9bdad1f902e38f4060a2d5924023c486283cd39236f364fcdbfff975396772e0c9b9d641638c134a3ab810d3d4af36036f4	student
315	24003002	mayureshmangrulkar.24@stvincentngp.edu.in	scrypt:32768:8:1$e8QYtMfix808xmgs$3a2779c8bfe6bedc36681d830f7d4f1f67cdb0e52946c3eeb76103bfdc2b360c11e2ad3be297fb330ba3fcabdd205b0639ac09de29fe404ba1cd9c6fea7294e4	student
317	24003005	anishbezalwar.24@stvincentngp.edu.in	scrypt:32768:8:1$PX38jNhUdeNd1KFx$6476e220c232c9395a2b62c05adcd2829cca2fdc0e8fa17c8a75e4f633e7fdfd215e3fc1d52f150135095082bccfb1f9468099b35c6ed7a285f460087bd5a745	student
1	admin	admin@university.edu	$2b$10$EIBX48emf2q5qSvIuIZj7.baO.cZ0QSNZqpX1DYBFM10J001mFKkm	admin
319	24003008	ishuekka.24@stvincentngp.edu.in	scrypt:32768:8:1$UDhWE4daWMW4yOtj$496b4ebcb28163771b8004b4b8d63e19c076918166240807d488161eb83fd5e12bfec9e13affdb48eb4ba06b896376f6ac64629450fc559eb686d4adbd931fe9	student
320	24003011	bhaveshghubde.24@stvincentngp.edu.in	scrypt:32768:8:1$PbZ0N8mfu02ZxzDP$957ad20ac1a723c33b9123975bcf51985e44aca89d9d017488a0e1a023150f883eedf3536815ba96508d7eba12b9f94012c1557464c21a9d1501405e1a5df5fc	student
321	24003013	kadambariukinkar.24@stvincentngp.edu.in	scrypt:32768:8:1$6X0WzlLHEl8MPNvj$ef3ca1843a3761e13d0b006a985d09fd70d82567ff0cc403e1a679230d6f71c14f68c0d8e2e879acd36fd8e66e48a765437b8bcd381fd457c4a0a9a50df4ff23	student
322	24003017	roshanbhende.24@stvincentngp.edu.in	scrypt:32768:8:1$d3ePkqbKVxHotgsF$00f778d86c2f6bc0ebe43a61b08ae2da6c2b6dad484eee8b9e254dda7401c63536df97041f4700fc793582c542764c2b5b52c7b5a229d69f1471d4f664169c46	student
323	24003019	rozannepaul.24@stvincentngp.edu.in	scrypt:32768:8:1$UVZSKQR2n9hgfvm4$1485bd6eea87f39f43a1db7d73885f7606dbabcf177a2c231b0d603f5fca13091d8afaac18196bf0d3596bcf217076dc86b650f707fe43b6535bd4c58e938aec	student
324	24003020	ayushahale. 24@stvincentngp.edu.in	scrypt:32768:8:1$F7Y9QFy600W1f83N$b753e35b7d761d34f03d3ef9fef0caa7f2427e7c046f8b1f0678f05733431df67d98e6a70f64fae3b1b64bcb89bb347cbb847eeed55a1bd0c34965d9136df88e	student
325	24003022	gauravtribhuwan.24@stvincentngp.edu.in	scrypt:32768:8:1$Rrqh8M6rXfr2F7ml$f5640d75b60bfdd5484b1a61b1a84f6b04d827245d9ee36b4ca6244d269b3c721e55b4ac44e4a278d07810db4537d70cb35f353d78075be11d514f5a141a390a	student
326	24003025	vidhikathakra.24@stvincentngp.edu.in	scrypt:32768:8:1$JfMamGFF1NgLvvgA$030fc77ec767292a95f13e957d372c98584fccf2f9d9cc3d52d6ba36aafa7ed545ec901c9df86ba0535c6ab5ad526ecfd8df447e4e08f5907f65a8674e99bca5	student
327	24003027	bhagyashrirahangdale.24@stvincentngp.edu.in	scrypt:32768:8:1$Zs7I4lxqGDjyW4YV$ac8d8c268cf58e3795ac9186e808cdfa3d2e6aabf75a82838874f815d576e658e17ee3265c2c5ba1c5854a7d0c47d9813084d8469d87af4ec97835c70ad93b10	student
328	24003028	aarongarvin.24@stvincentngp.edu.in	scrypt:32768:8:1$Q33m29MUYFEWExhe$1022c2f18a187fd757ae1fb6f6bc462c3777f3d13ef0fe79a8e61048750f67a48071325c95d2fdb7e55dbb2d2468a78de5911ff57d307cb388ec280dd3d17f4d	student
329	24003030	piyushdeshmukh.24@stvincentngp.edu.in	scrypt:32768:8:1$1WdpU3y5K5GkKlCo$f1976f4ce225538dea1741b94a7bc1dbb7efe23f5168d64da59ad6534a43d8c360abf52b4f74e8152d5aeeb840c07c0f50e87eeb23b04b4cff3aff1594cfbbf0	student
331	24003032	jenniferpjoseph.24@stvincentngp.edu.in	scrypt:32768:8:1$WhspJvieJnKL1c5h$9c69918dd422a05113d0f6221ec4f8650d19c7f3efdd80e1b8011940abccb92788ba3227e44e4115da0867f99da358899ae0bbbe735db951637c7602468f2565	student
332	24003034	adityayende.24@stvincentngp.edu.in	scrypt:32768:8:1$ZEaGETxvOcubOhth$7f89297cb29c580bbe5f56c35b75ac09204b5f5b1920c870416c50cc68ca14ed48ea0536ed8a4afc3961a1ffa6b3b113a25ffb8ea5c4d461528615d5a1b9ff23	student
334	24003037	noelalgar. 24@stvincentngp.edu.in	scrypt:32768:8:1$k6MvOvsZquo3KWzi$78a9c3b0f6f65d13c00b91695123632458671342a2ae9c4eaf1cc8bd0f749b8cfeff420a77ea1054a95937101ae91b05a1c3a5881ffbc7c5b87cae0bb47ee4a2	student
335	24003039	lokeshbarve.24@stvincentngp.edu.in	scrypt:32768:8:1$l2d9l8h8o0r3gcSX$4586fd6c7eeb23b4e5e07f75d4a8f6ee99ac45261304244160674379860778e14f5a37208610e4f7cdb944675b3b5bbe0caae9dbd86548607661fddc00e32bbe	student
336	24003043	swadhinupadhyay.24@stvincentngp.edu.in	scrypt:32768:8:1$XHwBkk7ZteaALuE7$5421be7e4f8abb4d82a20ad7e585271814f50c6a93c90c210cb189917a1a60d5f12d5684ff3b42a9e5aeef590221b48de027d6aaea2c8c9e39706aca9587124f	student
344	24003063	jaisonchandi.24@stvincentngp.edu.in	scrypt:32768:8:1$oRWkXOvf8ZqeloN5$35f3491fab2eef3276c5e2aff3b955776784bd50a99df201faa84f8a9adf6a6b4ee4d46a9d6b57b16865b3ed5416a75c54b7bed2403489b1be7cdfc84db34194	student
342	24003053	kanchanghode.24@stvincentngp.edu.in	scrypt:32768:8:1$W3NBUtGwoc9nqWUU$6504115ddb0187c35756bb8da97f41021e87544ca8459e95fa8ac7e5f65a14563441fec293525221bd06dc6eb47e4a0dec9fe9933daa14b7165c8de5e7af7eef	student
316	24003003	omnagpure.24@stvincentngp.edu.in	scrypt:32768:8:1$qyxloPMR6EjItKji$e219b058c3dbb597a2eedd31b22de89e8109ef6b1fd9a5eeca6205ca61a88de6ee8f68e36b1cd2bb5fbe99c81e863a2379a434f6982f895a93eaf3c55d207de2	student
339	24003050	nikitabhushanwar.24@stvincentngp.edu.in	scrypt:32768:8:1$TntDOoVqDWFph1Aj$e46feb861c8eb7e2a67b8650f428e39f6198eb3383515f0bb745b9f71db42595053a8771b871551804d46fb98f16c9cc41f0d58a63ec44c328688f65b05e0283	student
337	24003045	drishtibawankar.24@stvincentngp.edu.in	scrypt:32768:8:1$47TcZhNZemwHtoQ0$1493225fac55a44690885ed933b1487446aee1831b8b32bca810bd401e9228f8bfbec1ef9fab468af196beb875f00f46ac3d3de1e2424ca4f0703bfcbfa03649	student
343	24003059	sohamkale.24@stvincentngp.edu.in	scrypt:32768:8:1$3V2iio21e4QOlBXP$193175473cfe2870baac992f367bfad700fa1a726b5b4a6dcae2d6bea23b99f3be994fbe7e644c11cc094ef582cd3fbd7a01eb3ad47675d6cca23b18103226f3	student
338	24003047	shubhamdongare.24@stvincentngp.edu.in	scrypt:32768:8:1$ZKp6Rm7SvDsdcISJ$b668df95f6eb359d7c91fcbbc312322aa7cc9d008691972faeaf1843d35a9fba66c03bcac9cc9e74c6fc4873141c6c00b6ea57b29a95ccde061ac4d48c5848ca	student
340	24003051	anshulthakre.24@stvincentngp.edu.in	scrypt:32768:8:1$syid3irKj8jzoy50$74ea0406d506f9dd457550fd341a1df634ab8cb5161e0eba333ed982599fe9162febfd881814ba9c249ec4a3e19d36cd4cf43f2df49d924d0d9d145b852b5a27	student
330	24003031	harshgupta.24@stvincentngp.edu.in	scrypt:32768:8:1$U2CyBfP0ysJhLuam$b380a826415a0738ffea6b54d9aadbf3fa0c5af0764b5bca63568fc6e7d160fb16bbca73332d5f28bae99472dc1f5395d3aa5d7d339a1ae2b93d1eea977e81fe	student
348	24003070	alishalouis.24@stvincentngp.edu.in	scrypt:32768:8:1$VNycJxwbSocGe9AR$d0aed99641d6372a0ef728ca7dd54d2ad57322a3fbccf5c2ba6a27418a05cc3b149880820f7e20593f3180ff3543f69fb7b69d627d833df84a91e4323cbe8e7f	student
351	24003074	parthkhandar.24@stvincentngp.edu.in	scrypt:32768:8:1$VK0fNdFRRkXfxXvD$cd5cf05d6317f57a02f104c771d9460df49604e39be637baa2d2f863834d786bc47c86d9ca54046d953efaeb9f8e8f726baea958c24b5015df90ab3e96970d53	student
352	24003078	dravishpardhi.24@stvincentngp.edu.in	scrypt:32768:8:1$UcKHG3yjk7AxrzzN$763d5b3a758d007ce92a8d0395d19d2378e857712f683e886f8becf9b6342d6c2bd01fcc562d76a5a246c2729aff3ce8795228ed4ecd7dcb79921ef26f8cf510	student
353	24003079	pranavkhawashi.24@stvincentngp.edu.in	scrypt:32768:8:1$59JXeTkDYzAdMchf$a07cdba823b0e457545a9305452536e20bf18e8cac73acfa1b60ad4cf2bd37a473ae27285a0cc947bb353d2ff05a0080c5dc9ea3bf1b34844898b1e14ccbd75c	student
354	24003080	samikshathawakar.24@stvincentngp.edu.in	scrypt:32768:8:1$GA2F7hXAhaaezI0W$12373270e213afbc86441e302a55a9507bd30d13cf3d4bda5a04671fca3f8c62523dea198fc06a059b02478bc3df72ee96f77b240a8c8bf8b804fcedfb9e2067	student
355	24003081	trishajunghare.24@stvincentngp.edu.in	scrypt:32768:8:1$hnykdg904wTYlOtf$75b8ea649ffda9b98ddb2b9c82a949702f0606cec88eca16c75c814655a2c7c728983f3999cad75c4400bfdb5f1c2fb01525d5027ce96e2b150e0075a67df4a8	student
357	24003083	stanzinchosrab.24@stvincentngp.edu.in	scrypt:32768:8:1$NFN994PTaWu9Qq3x$fee98dcb196b5cca33128581abe0b830fbae7ef090367b226235c2e559e16c976ee3c34132ab1f6c59e109131746bb4bcd8354c2f770035cca3da30ecc0935bb	student
358	24003085	dhanashreedahake.24@stvincentngp.edu.in	scrypt:32768:8:1$vqFDJz3SuOsTcHta$3ccfb58f1b22a2bbf17c43774a405f71f8efbec99046fe62803aba926f84dc092aac888ed053061e55f1db6845ada573196ef458a3404a06c8787e0a175b0e0e	student
360	24003088	parikapandhankar.24@stvincentngp.edu.in	scrypt:32768:8:1$n8BflmUfiywZqvlz$ef0bb814b5652c525e0ddd41e72cf4bafa3bedff484c06be22ba803015a9468c0327f8e9072350686f145cc2c8f81cf1720e201d0f8f4f90c83270915d77df76	student
363	24003092	Krishlanjewar.24@stvincentngp.edu.in	scrypt:32768:8:1$tLP7FsB8xqpMXQIx$eb9716fb15b90a015da64ea79ab3b880cba7c39e6e53f6e71bdecf39c3da981199ab5f2b7c4ebb9d8e6c746fc8d1152bbc6ec1ff66d2460e5673ea462569df1b	student
364	24003095	shrushtivaidya.24@stvincentngp.edu.in	scrypt:32768:8:1$2ACSLtlTwv5MrZ0m$09d432e973106fc8e202284634f44ddba82dd3242b6c79256b39a60e14ee00b4533ac1ebe697a87c19d6c335de527e2ff24e4047d10e6a6e896a497595441942	student
366	24003097	ethananthony.24@stvincentngp.edu.in	scrypt:32768:8:1$cUyak1MC6xn7xfcK$330ef8de7a41f982811623a809eb8675a8248039617a55b01956bda12d5acd371411da01671c953f15cb1c99f43eae96454e46120526e5778765dcac54a676c9	student
367	24003099	himanshukedar.24@stvincentngp.edu.in	scrypt:32768:8:1$uCZQImPUbvbYQ7M3$34379b3ddbcce424d83b4d1c3c40047559b81da320f0872ab3661d53384c5846b8411135fe2245e02fd07b0a892f5d942e30c452e808e17b7f149f795c66dbc3	student
370	24003111	rishitapokhare.24@stvincentngp.edu.in	scrypt:32768:8:1$xiXwVoKfzawlyrJi$034ff28923de485697bca0123ba5a9f5b23948e49f63a1fd43b17ddcee3863e6f90d513ddd5a70c46defb56b59236b979dc22abd1ca4c71ae3305b8e5d9d2983	student
371	24003112	revantbajpai.24@stvincentngp.edu.in	scrypt:32768:8:1$qSpmnNrTbGIti44p$3baeadea32992024d9b46cd3be06d2fe4713c9d5bd26b170b4d2703740a927171685e72e7ab58c4b721256adfd8e8052833e4f167688aa02033ffa162ca9819d	student
372	24003114	saviocherian.24@stvincentngp.edu.in	scrypt:32768:8:1$3Yj1N4zHbCcQEPqx$8b1f2406cf17ceb0d9c6c181cc94623ec4270232eb325c76a92672d8fe8b46e9ee747c6a259a6b31d0a327d33cec5d80acb9a2813bcb10c59815600340d6e7ad	student
373	24003116	abhinavsingh.24@stvincentngp.edu.in	scrypt:32768:8:1$c3xq3zKeUxSG1RaK$66de3f8022ff2c45dfce842abbf8bdf3fb6c8bc40c4545c7339a59ea6e500850b03c193467196e856ea9608c91c5a66387b61ff9534535f9fd9af92872f53bd2	student
436	23001138	junaidhameed.23@stvincentngp.edu.in	scrypt:32768:8:1$1SAJ5lWNkwcfwWNs$139cfcf2dcfef9d76174fd531bcab4e424e8c29259f7da8db29df52d1311a7035083edbb36f08b93c6c6395f48a022ae761eb8aadd9e1a5f889874095b968ea4	student
346	24003066	neelamlashkare.24@stvincentngp.edu.in	scrypt:32768:8:1$21cabPr9U4XmGcq4$67b765e372b3dcaf9f1eb54896ba056b448d4d073afa830964d407b0f76477e79a86029bbbf132761ed4fed632d1d5cc9e3fa88e71914e13afe9327fe14db783	student
361	24003089	khushipatankar.24@stvincentngp.edu.in	scrypt:32768:8:1$0ZVPQx9qPn6q0YRL$27e661086e6f4c44137a907b406114baac8db932ad2fb2654a22e01968ff0a41239862b84b34f0797eed4e1170dec932b0887f6fc54f311f6ffee8f078c7850b	student
359	24003086	valenciowilliam.24@stvincentngp.edu.in	scrypt:32768:8:1$0MS8eTrXqPOat74H$3b03441926d2979e0f726b2187c2dfdc31edbc53012d67feebb4be20da88c762a7979e8da3542762d4d061825b1514c5003eab2891450277712a53bb1e5cddd2	student
362	24003090	devashishkamble.24@stvincentngp.edu.in	scrypt:32768:8:1$Q6hlMFBmuMIVimRF$66cc35d967bfac0dc1576d5b1e201e333b98c8de4173f8ac92871020f574e0ea4da63e47ea9d7c32be9d61cf98cbf3fa38e06e22d91006dc355faf3543f5e9e6	student
368	24003103	rachanarewatkar.24@stvincentngp.edu.in	scrypt:32768:8:1$Xtz6AutXJxDbwpxF$e310474cbecf7dc51bc758bfe9dbbab1de65b6750894a4364a8423c433bc291a7b6f3a9a4c02021f7f0866fee1690c1fdd20b402b1e64a3949272692ee7673dc	student
435	23001137	nalakshrandhawa.23@stvincentngp.edu.in	scrypt:32768:8:1$oE3yRHx1d6CLG2CJ$efbff037b80cf6548c2a75c86f858e7c81e4f4c02c34f288e8857be2264f245576372de27311843669913e0b191b276ddc40addbf427f3237446c5796f3449c6	student
365	24003096	ruchikathosar.24@stvincentngp.edu.in	scrypt:32768:8:1$ySZ7xllIEfw2azIi$f0929357ce36627a112aa039658a8a45b097f7263436b606418a423ffd35c6c27d1bca4190b08414ff86cd6cce408b6c0b433342f87ee3dedb6de5896ee77245	student
350	24003072	atharvajoshi.24@stvincentngp.edu.in	scrypt:32768:8:1$AWCCeRBHns0zBMmI$0b5a63672652b084f4c399fb008de34e4830c5309b21ea0f1f9b758a9f20f9260784566541548d13ce7df6675d6b0105834c37fd9da9d7707de74ecdddaa8970	student
356	24003082	joshuaabraham.24@stvincentngp.edu.in	scrypt:32768:8:1$gRz9e81PpFfdtY3G$990d3bfe7fb58c6e865a1f64e9d52b7a2f7c44524cd9c4ea060451500c1c1b1d907a15de241ac0d26242f59cf8e4802f6bbb4170a8a25e1151414295b7fa02aa	student
347	24003068	sahilgirme.24@stvincentngp.edu.in	scrypt:32768:8:1$EqXOLSPiAxZ4pYIa$0a0b90ecb71cfaa89fd35bd8c3444178d38152079732288a78ca4cbc9f2febcecaeec534814e8b80b17e1c793d185efa8806c17cc524d90d687abcf8b1442edd	student
349	24003071	vedantghatole.24@stvincentngp.edu.in	scrypt:32768:8:1$IH7hlujHbKjR7Hze$a93a1c95dd1bf928570d344e8481982b4ea2954b819f40ebc3b64957a5601c6e10229374705bef993f9dc37ade491f3078bd9c56d1da29dcc6705058ff600c3f	student
438	23001141	rashibongirwar.23@stvincentngp.edu.in	scrypt:32768:8:1$oMNyI2uOUH3ynJSd$024b620a97b01d6079a6f865e3e2dd101a7405a17df019377488427959cef86f1a2fde7b70c2b92c9c0d016af5f8031eb8cda89e765e925277ffea2f9136394a	student
439	24103101	shivamkurhadkar.24d@stvincentngp.edu.in	scrypt:32768:8:1$ScyhlV1ZEYsG7bGy$c7c4d84e8b0f47ef2f98739340e70556e8f641c6d2eadc0f36b1737bf72eed98948c99a69f7d35d25d7163207c7b72033cd9d2af7654c400b570b9a73b729285	student
442	24103104	surajmude.24d@stvincentngp.edu.in	scrypt:32768:8:1$o47HvJDeM9FXHTzI$2f46ec4509951e6d7c7c06db499a510f1297e2537414e3384bd19e940be2a2f7e5ebbc1302a3e835f23b8ecab8aee172f1242f46dc3e2b8b66486d67023ba98f	student
443	24103105	abishaiamair.24d@stvincentngp.edu.in	scrypt:32768:8:1$gXBYtApaEdBjqvIm$2938e9b4ce6fb6b85ad43df611e35fb90372c432e150d365b99594052a3ab80ebf1df1180da036a188e0050a2890c2f21e205e20605aad0e97bf53ba9ace6993	student
444	24103106	royalhadke.24d@stvincentngp.edu.in	scrypt:32768:8:1$8gg6oPWm3XrMZecH$e8206ea53cb1248380c418e80b29d89849e0ed4a6ef631116749a7695569f7bc7e694ec6750aef51ccbdf395012bc8e1701f59faebc3a5ff416d149adcbcf3c9	student
446	24103108	waradkalyankar.24d@stvincentngp.edu.in	scrypt:32768:8:1$y4Udav6HVTfeiDYq$e54380c8c37779ecb342db194de3b26a9b8c6bb2e6ecb6b8371e5f0e731395356e7a98d809b9effade6cdc769b15a14489208f597a4b166f7facd5ba4be1321d	student
447	22001046	anugrahakasbe.22@stvincentngp.edu.in	scrypt:32768:8:1$6hXCWThxeMWKh88r$bc6afc6fcd8ecf319c3adfdf8c6aa26b7ff4b7bf1201c4631d02456fa93d70c38f4cbf155c793ce430e73cd3ff73409baa94494fc21e961320b28a35ceedd312	student
448	22001107	samruby.22@stvincentngp.edu.in	scrypt:32768:8:1$gsqZ2dkY3Mc7SiEZ$7ae344a3e5a0be874c35418a7a52a74716caa838bf0f1193e0443f50f371fe09ea4c4bfb24c81e6a98e29c7a1b6660b0919543c86a6f6bc83fae7c66e8b8b5c2	student
1334	23001005	shreyaroy.23@stvincentngp.edu.in	scrypt:32768:8:1$xDLUA4Ko6uaBHkQO$5eb32ba35696198bcc76b775d00caaa622b129c664ee3bc4996bdac77944e9867e397dfe112a472067632f89c1d8252434c939da6087267b6bd48579eb0dc256	student
1335	23001009	bhumimakde.23@stvincentngp.edu.in	scrypt:32768:8:1$cFGmUwlRyXNg0rQD$838c7b51c9f9d5767d93fb52c43ace6919f1fff3214f2fa6a70b31866c106f2775aeb56f4b2580e006288f853596f1ad0a0970e9592f9fbb61ed81e1da286ffd	student
1336	23001011	sharvarighotekar.23@stvincentngp.edu.in	scrypt:32768:8:1$rpvSzeu22O7F5jhu$9868ee605bbb4e5855845d73569f652f6f55dcb9bc4b524c27f735f9d28d7e2aba8c5361bac63f48c9e7e12931a122e171994381701fc75ef88081d4fe8d0f85	student
1337	23001016	juelichintawar.23@stvincentngp.edu.in	scrypt:32768:8:1$rxixhBZ4glj6luoT$f1c3fabb3dde25da6cd1f9de3850b9afa35abba4f758810ed7ac6aa9f447e7200f4c45a920d918fdc7d3e5222df2d9680784eb85ea54a5d25f3695f5d6fffda6	student
1340	23001022	tanusinha.23@stvincentngp.edu.in	scrypt:32768:8:1$khJM7m3ob8YTLWWA$338e54ebd5663b1fbbe5036e35b6d74471716ca89f2e2b5ed32ac0c20cb564b8f8f4f655acdfbcacf2a35ebea2fbe45d92bf4b03f2fb2791578166ab7e1cc2bc	student
1341	23001023	sohamakre.23@stvincentngp.edu.in	scrypt:32768:8:1$MxNMMeIppmbsbYc4$d72fd20d0cfd0f5c44362864892405a7ebe41e6a1f3fc3a817f3e4ea2cdacb461f22139b7ca2443434e676c91762d18a993c62e5f7138d67cfe556cfe7113023	student
1343	23001026	bhumikabokde.23@stvincentngp.edu.in	scrypt:32768:8:1$Us6iQq2HHZfHUvzM$853fd705b2655ff9d66222eb27e91beb5e998fb570e1db96a0d60200f8792e4f028c8da76fc404a821d98976df9fd08ec14b9f1fdf8e84338d9ffbd1bbb36232	student
1344	23001030	krutikathakur.23@stvincentngp.edu.in	scrypt:32768:8:1$YPQjMqRwKnjcBeLz$eaea58692d4b8240a49eace6023d095bebed542420282f37f44b1938cbb410c5dfa64fb9fcd050fcdec2114d72c9dcd54e9fa3576e0b4af4db0f3f5c0115c8d4	student
1345	23001034	melrickpaul308@gmail.com	scrypt:32768:8:1$xc7Rf5O7SJTSk7TP$144de376654138a7e258ae314b4e0e6d17fa8a1e3fbcfa554adc745016f8819be287bfe3de11fdee194687d3d8d381a068a442a5fddf12ac00e7c4d4b595ec65	student
1346	23001037	elizabethchauri.23@stvincentngp.edu.in	scrypt:32768:8:1$v9mfGrbinMVv8Tc5$16a1271d7b985d2dd11f5c17b5cde23b47f6ab06cd25e902f5693ed634d9c7f801d1f1cc1fb3286d0dcef61b018bae8ade0d008090de0acb24cb08ad6f13ebf5	student
1347	23001038	joelvarghese.23@stvincentngp.edu.in	scrypt:32768:8:1$wS9gaeGuUeI3rpax$fe662a028498e8f98ae201af16e11c7ab26474301d30b7dd55b7184bcb2841a5eb8954d0f88cc5146679e33d9f34e876a9221d21d55894f12d72164a7ad1f62f	student
1348	23001039	terencejoseph.23@stvincentngp.edu.in	scrypt:32768:8:1$UoLdZvv6MpdCZfTq$0136b301d88547594965e5140e34dec758632c8b62df1df4f2aab3bd06754bcaff1fabfc54deb3ea1452d1bf6c964e90f21aa5048eb52edf9bc0e85efb9fdf6c	student
1338	23001017	payalmohanapure.23@stvincentngp.edu.in	scrypt:32768:8:1$OMJmSKzmGKD6rggi$54dc58452575a74bbfb07e591676e76806f6a1fc1bb5c2e3f3a50884f9253fc14937cbd317412b882fb28ed78b78a0a04f8415e186fb7a5ce2d0f6e160e0fee1	student
1339	23001020	manthandhawas.23@stvincentngp.edu.in	scrypt:32768:8:1$csuZRbfYI4dKzTKA$1a95e909abc587344c79917fa729310a6ce29561f44b2cdee1ac968838e57705de9c2c1fcd9efbcdf7d71d0f445a87bbefd110fd2552c5c770e6d772cd55c57f	student
1333	23001001	rochanawasthi.23@stvincentngp.edu.in	scrypt:32768:8:1$sKi6S8hmXTOBTVcn$c103f7203f86735d247ae58f70516cec26ef1ac40f263de06753be3fa84421a94d9e9d88fd372704f9bda4fa136987a0db1d84df7cabd203d598cc2a1ec05412	student
1349	23001041	aarushighadge.23@stvincentngp.edu.in	scrypt:32768:8:1$NV5JjtfhwIVwF90k$9a27a4bfa9e0b0e09b13e9a6e26efc57882f2430b99cf935d364c3ee58ea6ba230ae58e767a066d3fd5211a8a3aed978ef2d06ccbb5df0b1f0d66882b744d5b5	student
441	24103103	vedantvairale.24d@stvincentngp.edu.in	scrypt:32768:8:1$BOWLUhcOUXl7o8Ay$c19ac63dd8eca323611a056abd18ea063316eae4a677f6e8f06927b0508b3664b90fbf2457563dc916486f2fb7f8aea4b750b7157c49c21626d901e5ff2d1309	student
437	23001139	rohansingh.23@stvincentngp.edu.in	scrypt:32768:8:1$LlaFapp2yc9mwtZ0$c7ce22a1b226ca6f70270e407510e0f581070787a943d9c7269a067bad39f4973d8ed42e7dede577f187f413f6c87b9e0990984d39078976f86234a2f29451f2	student
1350	23001044	prashansawankhede.23@stvincentngp.edu.in	scrypt:32768:8:1$GaTcQrfxjrhgIPgi$aee87228509091656489b82b6cf42467f3d738dcb68dec0736e5677946586d48a82757bcd8acd3c5d9e8deb09a580df5bbb8781d9ba140c046e0d0cd7119f91b	student
440	24103102	rushikeshbhandekar.24d@stvincentngp.edu.in	scrypt:32768:8:1$eHm4DLGWchrclM0U$fe7f3440113b4ef3e0539f542456093b8315f18caa1ed80c0d4b249487108d75bbc17adb1dde4e08f0e22e4bbc68b2316e088e094656657230c17b3ea22783d3	student
1342	23001025	md.shahanwaz.23@stvincentngp.edu.in	scrypt:32768:8:1$fGNrAff69n3poczq$8d4fae8dc094054a4e918fac39088436ba5a37308e7810d088e70f10f208db7ae54322512c1778dd9d9ad5d95ec951a23a5cf12efbc918bbe17e675077954440	student
1351	23001050	romadive.23@stvincentngp.edu.in	scrypt:32768:8:1$WQweJVh0wRjQAakf$c0a31ba9f60211108c8f900d5bde2e9aa3e9b7158bfb49b03e88e93099890f4fcc8f2246d361d1c40357228401a995f4588c3d88b7b19987d351d8517da0ebad	student
1352	23001052	utkarshkuchankar.23@stvincentngp.edu.in	scrypt:32768:8:1$Vtmg6an0lrbL7rGz$99875bc3f18b094b94b1e9b1fd1ac7a3a855a62f5f9b90a0dd96419e235030b5c8652d81eada514775e5c5bdced53ab1898109343762acc7f830bc08b277dfad	student
1353	23001053	amodpathak.23@stvincentngp.edu.in	scrypt:32768:8:1$olKxQ4QE95BDD0yM$1bc28b730aed21ea8478c8c587d7a1a1530607fa726ea52fc9c4ec4c031a7684e2ae06e5ce26ffeecdf43e9a752a6fda17f2869307a6f2f36e1fe2c8c6e8605f	student
1354	23001057	amrutakharwade.23@stvincentngp.edu.in	scrypt:32768:8:1$kTBwgYcTFUaQpfEG$234fb166413629028d4314e6358136a94556728b83011cd7dc556c5575e54e11a69d89ae73b17d929ece6e8ca075c46b97bad881bb67346772835a898f2b529a	student
1355	23001058	surajdhere.23@stvincentngp.edu.in	scrypt:32768:8:1$IM8RuKGciOTajqsG$8f1476b6910b9b64ebc27da559d388cc4b767dcc756f18193b068c8f3249b3bfb3d70e33437c6958a68ef090eebb4d0ef3ac617f936817563a84253509cd6f7a	student
412	23001074	siddhantlohakar.23@stvincentngp.edu.in	scrypt:32768:8:1$8xQ6sQzwQ2O0H4F0$2170b7b56ab6871e9d1a9e150881108cfa3c018bdd9f62dd758efe964900a3f23f0810f68e653ccd0a210f4addb7148a759671ebe9f53de39350fd012eda705c	student
1358	23001068	sahilshrivastava.23@stvincentngp.edu.in	scrypt:32768:8:1$OrFZxM0AvKzTJeq0$717919b0b0824b0235a1103900211a1b108197bfa65206c48037f884a8c90689412e083d4cdf3d35d2e59cb490b5cb4c9597e66ec337cfb3d0e4fe7a2462e25b	student
1909	23011111	\N	scrypt:32768:8:1$g1VYPIHeXWiwX26G$09c5b0cc8b2599e25bf27003c86a2455f397be8f1cc6e2915c93120bedb7e0b6800faa6b5129075a7f5d6e6ef1488f032eaedc531b96b61bdb1cf63b391077b2	student
1359	23001072	prachimishra.23@stvincentngp.edu.in	scrypt:32768:8:1$RX1Pe1gj4aMcf7vh$583b05262765327b8fec31fea46ce37ed0bf5f0e4b8e7dc78f952c7c08bd66700bfe7d7b90938f3d1168430b8ce8da8a81ea7512c432c00f7739dca2932862fa	student
345	24003065	yashlute.24@stvincentngp.edu.in	$2b$10$91SI8ie9xJxpGTSXyz5S9e2GdlxAHXQYIm0Z8vei.LnW47IcLT2mO	student
1360	23001073	aniketsinganjude.23@stvincentngp.edu.in	scrypt:32768:8:1$JqUbjr6pFOqEpDfL$3f8591475f049435462e986b3ed2acaa10b7c581111188a2976bf043c05f2fe2e6f5160e6305164ecdfbb0686954ce4d6e3d36533c9530a0655b8500474c2d49	student
1361	23001075	sumedhmeshram.23@stvincentngp.edu.in	scrypt:32768:8:1$ZJrhIgwHo0qWxCLQ$fb51fb96606f61fe0fdcc23d6141bcf200389143df8cd6b57fab5c532d594dd20c4f8c217767b94c6ca43a6d8bfb3aecc798b0eb8bb47513a00992e555bf4533	student
1363	23001078	parulgaurkar.23@stvincentngp.edu.in	scrypt:32768:8:1$hcLVBDS0KH8dcIjV$4c75cfdcd340d7025cecc13b5d130211c9c18c48a73836a2434fcc314bfa20b5987eabd07db640310e6f2bf51fb846db11d70e3806e20805698d13aaa7a8c549	student
1364	23001079	manthanshirke.23@stvincentngp.edu.in	scrypt:32768:8:1$tbs1tUQHd6uHE9kT$afd19a7a9818b44f41c58a59a61f52df78f0338150bf691516257631cbc5c0cbb3587035c664c5834eba4f8cd0f8164e286e2369d266e7edd40664b34e82a155	student
1365	23001080	gunjankadu.23@stvincentngp.edu.in	scrypt:32768:8:1$kCOxdbC37Xl1W0Iv$e36f7e1a57bc98d3c2def9174bb162301b38a31eeb6ae01fdffb779b93d566138696bd2423a322073bf3d53be6e3b3717ff363eb47eebc5ce3ec85721f3121a1	student
1366	23001081	mayankbalpande.23@stvincentngp.edu.in	scrypt:32768:8:1$6mtrvJr4NZmOxR9N$9e51e1fc475440e40603b2f97df9b248d9846024737bd54feb515fdb27c292c0bf737b84a1ceae7aaf47c099f57183071257e8dfb6037c4711ff85f7cc6052d2	student
1367	23001082	ritikpandey.23@stvincentngp.edu.in	scrypt:32768:8:1$EUB4pR1bC2FTwLru$4ac522307e42ad1a50a5d536a6844b2803d0429329f113852189c9a24f771a02e09dc3f2c7e26438279dea33bff88af16eaa4d03e1173c4412e7ac6aedee104f	student
1368	23001083	pratikbhoyar.23@stvincentngp.edu.in	scrypt:32768:8:1$OMwHS4zLksWjUar8$a8934dcb242f160ac410952cc090fa825b106af1f2c19184bf4c1963ae459e51df2b9ce2fdbf5765e741893c3853e8cecc9511566a04a48ef0be20f8acb580e9	student
1372	23001087	vanshbansod.23@stvincentngp.edu.in	scrypt:32768:8:1$KMPrFJLu25m3fLkO$3afea0d3e5b7947625ebc0e29e605e92175be084af2407543056e4226df1d2455673157441cfe4b874f6fac2cf1af9f8ecff5bf4449e8e0c5d58d86100d43d10	student
1374	23001092	yugakale.23@stvincentngp.edu.in	scrypt:32768:8:1$RcO9XzSmXkBI3n69$cc413c7e94803047624ba7d5ecc1d566215107dbf9dba5cf19fe86dfe7b8811e0180bf1829e7d8790fed05eb2d409ac0040110bbdeb18feff64d5f7ca296845b	student
1375	23001093	ketkithakre.23@stvincentngp.edu.in	scrypt:32768:8:1$lIV794LuJvJmengw$b57e5079e3ca7559219f1760217d9f8220599fc5c06aea52888d58669cf667b91576b4be4b5a3db6f4b0e4b873c3f7ee0f82b1d5cecdd8caa10c77d241c5edc3	student
1376	23001094	abhyudayaaware.23@stvincentngp.edu.in	scrypt:32768:8:1$JTQ4tl1424k3YkK9$2e9b32c6538bf96cfb995a569d4a2de58b17ed200d6395172d998db0c1f46d0182d0152ed5a05a1c1816d6092a969f076b60ee592282d20c3587b684e68411f6	student
1377	23001099	adityazade.23@stvincentngp.edu.in	scrypt:32768:8:1$KvisAeZQYXOjQyh9$ded6cf0c3ee9df8906618e8f63fd525ba6cb742043991fb3e9ae36d7476816048af0fc8b58765418bb014abf80f8a074f238ab198b119cc376e6f8f517490be4	student
1379	23001106	adityanagpurkar.23@stvincentngp.edu.in	scrypt:32768:8:1$CyQ69R5et1v94aVC$bfd21073df29624e83f4bffc41c55685a5c73a65ef48e1728ded986a38af5a29a92d62593561008aef86fb7146df7cbd202ba533cd81b5043c154d711e302c71	student
1380	23001107	mohittelang.23@stvincentngp.edu.in	scrypt:32768:8:1$OEOGwRYJUkxC7jZy$18af75798bbc9da0ffbe045e213e2e130eed31521f17bbc0ab44ea6976b056d46d5b80ae8fe0c679a9164e8bb7d5095b5d1126d016ce524c88f02e10c8634c0d	student
1369	23001084	kalyanijiotode.23@stvincentngp.edu.in	scrypt:32768:8:1$i7lBNpiaS5m0AbrD$bd7647d2286be65fbec0e5cfd6e4f179f1fd6a71b62fc3c1da14903d0fe4bda0cab4ffa25fcf26fd8f5ecc20b541c4358c33fe07d6106a13361a875682e1e0c2	student
1371	23001086	akshitkamble.23@stvincentngp.edu.in	scrypt:32768:8:1$rVjufpgSaPFBQBwP$bf8188e979cfba495c027ce2728b44323909a35eaf29e1bdb78a551555262c9a642ed29f20f409ed38dd566014c3b47890a28bbe7b6dc43baa41e7fb75af674f	student
1378	23001100	utkarshraut.23@stvincentngp.edu.in	scrypt:32768:8:1$tvNODgWT6ymNMThT$f657e40be4b65898b16f53fd5ddbad8df7e451c2f9278139dcbcf3e6860448eb7f58b9c102b3410334edabec0db9bb270c242f9c0f703a9014566df13b3f6f38	student
1356	23001060	radhatadas.23@stvincentngp.edu.in	scrypt:32768:8:1$9Kn4L4Wcyx9IvvkU$f17f1747f7ef360518b22448d7c94530850b873734c243159833c469d324fa408f7a86ecd68ec48ad53d7ab100c8fe2839ddbc420e6040df2146ed8f47a868ba	student
1357	23001063	harshadselokar.23@stvincentngp.edu.in	scrypt:32768:8:1$5x3v4d3SRaDGxTzo$76e3288dfaec45c63dd56172cfd428fc6554a79dff41de203e6aa88eb00950c31469b8c831cdfc4b28d607d6fecaf69ff85098f1ea3ae03fae100f3f18821176	student
1362	23001076	tanishashingne.23@stvincentngp.edu.in	scrypt:32768:8:1$oV0fqC6hsmOyqWuO$e53e432143e4deeca7410d83195d5d5358a033a721cdf3f5c4100538007cdff68dc585dd70c49ec4cc19304a653ff13b215a7b21a994714f5055b507bd69e736	student
1373	23001091	sahilsheikh.23@stvincentngp.edu.in	scrypt:32768:8:1$67ZgQACVdvU9QAgB$98cb677a1183b2953a25bb9b908a18e37cb744db6465052c1fdfeaa336779728c26cce13698b95e8bb51c0e2bc8b7b0fb5ec4e83d059777e43bb8f3b65a580a0	student
653	24003004	mayureshitankar.24@stvincentngp.edu.in	scrypt:32768:8:1$wUVScaNO1BFFJ8jl$bdff28a1b87930216a081e672878f762637e695e96c8545ffc23989002fc95f03d7f31841a407016a1b286933ea74654932a7cef814f5f80bff0fd524010da78	student
1381	23001108	preyashchandurkar.23@stvincentngp.edu.in	scrypt:32768:8:1$GfRMqewKqKBVdV1i$2e77be6cf34d059e40fc34bcb5d7d8d38b9908188c5383aee10d926f8096b2aedc2f46a00a05aa22e5b59ba4d0bd79dfd61f6fc54d179562ea9f58a1399e970c	student
1382	23001111	bismeetkukreja.23@stvincentngp.edu.in	scrypt:32768:8:1$mIYT1O4zZteaJkxS$133c7d3b8d8e392ac15eff7249f20abc87e171656758fe062e364c3de3033942609ccf91bc0aaac787726ad23754e6264a87b90e40a9eae1e94ab97f13180bc7	student
1383	23001114	vishweshpatil.23@stvincentngp.edu.in	scrypt:32768:8:1$KGxkMFP7s7ppocOf$cd69d3060ae629797764551d7b9f403aafa0a29362e9d023a4b6504663d846bc54c1460009e13e62fdf2fe99a2f36a1e59021f9baf9dd67e1cf62afe44313583	student
1384	23001115	adityayelne.23@stvincentngp.edu.in	scrypt:32768:8:1$edQJfTDoyaJhwMta$903c6f0417eac8b071712b4cb1f463081497deedc54528b83bac105dbdba9f509b6c42378e3fa6e37d0d6241f2bbe181ea8ecdd5d27e63f9616c6f20c74a8195	student
1387	23001121	sheetaldevi.23@stvincentngp.edu.in	scrypt:32768:8:1$SEqDAj1mP1qEqYq4$012a6ade6b5333d3f13091d915bdc6553f6135a2d6bd00ff909e03256f8a6164da35a7d56ea9294a9d0fd512e76711c626ace019e3822c63fd50e5782b36c51f	student
1389	23001123	ananyarajurkar.23@stvincentngp.edu.in	scrypt:32768:8:1$63A0zYekZthEe5iM$922846448d1b4d80b9268e9aa74ce79eea73307acb94657f7e158d76dbc24f73e971218d5d2880557c3b1f3a179e96be83ea18326d7641fcd6f919894d248002	student
1391	23001129	jacobmathew.23@stvincentngp.edu.in	scrypt:32768:8:1$CxhqRJScyMlZfJ7m$25164000abe301fc40663d112c7accc35d97357ae8633134d93a1e9a8d8a463c653e53c0ca945cd04759a12cf3a8347a8e7484adcd3cccac15186e8c309b6613	student
1392	23001133	tanmaymeshram.23@stvincentngp.edu.in	scrypt:32768:8:1$LnXrMToZxRY9EaYI$af47ed85cd5619b41173fc4d40d4f8516d94238143ea4a6a4a530e2e57f0fdbf5ea0308bd195ab755f643ccd667d0cb0c00048fb1091ee512047898e81dce435	student
1393	23001140	manchitchoudhary.23@stvincentngp.edu.in	scrypt:32768:8:1$QCSMnTUgz1TxDGe5$f8d31dadf2468a5eed17541410c8caf36882552ab3d14930c6d3f38df19091b4fae9170be039b6cfd61b09df0f20661905428e1dfe351d0d8505b47ab397ef79	student
655	24003108	navajotmishra.24@stvincentngp.edu.in	scrypt:32768:8:1$Q0Vke1X5vYIKPcMR$d62b3b3c3af4aa7fa68828620b121809989285d5f8d1b1e25154b5a5248238368bf6399b14f3de703cd4ba30b9ef7c3734de63952eed1a97c9ba56553245451a	student
658	24003113	sahastranshushandilya@stvincentngp.edu.in	scrypt:32768:8:1$bhdLQ0VVxd0kaThH$a462609b9c8b39a4dc0933a399d96086ff57452bc90ba51a31ac24784f6f8f98db19848effd0aa44762a6488617907df53af3f3bdd2a7f00b16017153d661fb3	student
660	24003118	rutujawaghe.24@stvincentngp.edu.in	scrypt:32768:8:1$292Av1jfi0BMQmuf$4784930db9996b26ad163c18cc95de537c3d0b9822337e09b37d321e63cfd4247c6e9d46803845c0f08c879fb4554c7feed7612260f469e8c94bd203b2e8ae2b	student
661	24003119	pavanrathod.24@stvincentngp.edu.in	scrypt:32768:8:1$pLYcvclpYWFRZLnS$9b5ec3248e8ae2ad86d326ba0d3d8570597aabbda4e16933ed8fb9e6c68eb03ded4c93ac5a486562c71b3957607320c90855a4d926d4c665a5b6bc2bec69f220	student
662	24003120	kunalsahu.24@stvincentngp.edu.in	scrypt:32768:8:1$LdgrWbLoP4ggx2KX$4dfd5c708903a036955244cd64e9853fd3f27349ecf46ade218e1afdd681b0306b5d4529e70be812d1a27ca391c4efc300146ab42e6fb5556969a7514918e121	student
664	24003123	akshatjaiwar.24@stvincentngp.edu.in	scrypt:32768:8:1$Z8r56U3wLU2Lkyrn$e4e127f2d247c1b05f4502b95df4ff848ae4ad579cec36f34212db7baf3eb03d747983c12f51aa17fe2a8ae18984dd415ff2f5997c2385224b8a57802cb9f4ec	student
665	24003124	amitanshpardhi.24@stvincentngp.edu.in	scrypt:32768:8:1$CoaVacmiADFLeSnN$ad3ef0e8f50e1ce0d4d63513754861aa2bba9548dc8a28c01de65f9be4c260bfb8ac495bf0f060c697aabfc7c62f68737d350d86f2f2e869778acd040e753cac	student
657	24003110	oinamkhuman.24@stvincentngp.edu.in	scrypt:32768:8:1$aGe9N6H9EdC4dMIb$34c150b64b824ee5c8040527c021f87aaeb170757075382bb47e52f6769f13463fa88545377a37de62a9080aebf984b1fd6962198eef67f6feb884b017ddf2b4	student
369	24003107	mayanksaha. 24@stvincentngp.edu.in	scrypt:32768:8:1$9LWWuXWKHwAFxl9k$880812995e91277424b9907ec1494bcb4c035bc50f6366734890a1fde9a30558a0a5a05cc8f60c16ed454773ddbf2a233c7948bee5445af4f9507e0099de1fa3	student
654	24003010	tejasadhal.24@stvincentngp.edu.in	scrypt:32768:8:1$hxc6Fvm0ddL9pjOa$9d055cdead665d4c0180fdcbcc61ca724e8e23896f7d3b22a1f45b9983a6af60d361184ebecfd6f96e799c0f1796f53e04682f9202de05823b569ab9fa53aa2c	student
656	24003109	swaranisal.24@stvincentngp.edu.in	scrypt:32768:8:1$T2Qk45C405dDZmVk$529b973d25252c33d4eed053eaea7c6cbbb0650414c63a6234ca0b1cb523c4cdf03d1527d32bdc3198cff9f487185330001ae008656ee554610531d1c0ed7a96	student
1396	24103003	priyapachgade.24d@stvincentngp.edu.in	scrypt:32768:8:1$JoXoPRCMVcgqMdfX$54c8c69d26af82b268e19f8156e42f86fc202be6b749d82beb2885dc63048ca4ffc82de3f662f3ddae6e5c3af35e8cdbc0dca65e3afa8a0385d887dff3b05615	student
1388	23001122	sharwariwadalkar.23@stvincentngp.edu.in	scrypt:32768:8:1$DgxVYk2Obb2xMoxl$51cb9b4c511fe6fc6b55f0b10178cfb72dc964cca60c5f47b02440b6a9914423e9c3d323c1e0c52e7be76b34e1fa899d25034a37b9f98632f249b056bc97a2ac	student
1385	23001116	guradeshdhillon.23@stvincentngp.edu.in	scrypt:32768:8:1$1Hf643tjXXABp7iD$a25c8263b0108ab7e9fbe33d5ffca5693733a1b4b40e92be3e9f503affaeee9715225cf2efd21000145ae9ff35ce740129e04edbaecf08ab60418ae83985081b	student
1394	24103001	tanushreewanjari.24d@stvincentngp.edu.in	scrypt:32768:8:1$J0rpVJjiWlGyydvq$46f7276f30820975ecff7c59beb9308e0c1114a64c5981a8d856aa2b15fa8e9714034bae4d2b6638221b7848abb2ef09574ed227222cf2a7bd85c650c822bec7	student
1395	24103002	shreyadoye.24d@stvincentngp.edu.in	scrypt:32768:8:1$EGhnjIlx6FqHPWUc$2ef2c703fabc7380af921bf9aa76ed5cfa68968563d79e76bff7aa7eb1ce2ba0dae95c9e2d3743eae87246ebd9815e987680d15b030865d361b222f9385907bd	student
1390	23001128	srujanzanjal.23@stvincentngp.edu.in	scrypt:32768:8:1$R6h0JUt5KR8lv2j1$04436cb38ab5be641d305a995c65cd1400d7142c943bd095c594e04c778aa6b6d544c5fecfbba9b57f5c8069f9caacaeffffcec3cc88ab2c67f3fad346b0dcc5	student
659	24003115	saviomathew.24@stvincentngp.edu.in	scrypt:32768:8:1$a7qXzBbQenYqbMtX$5537ac59a12dbdf03c50ab806078897f652509fae5c42838ee5242932cf69c71d5372d7468f5ddf3494afcba1b8bbd141d11f81a642eb719516485503e66af0b	student
1386	23001117	mannabilu.23@stvincentngp.edu.in	scrypt:32768:8:1$i8dkmACExfxxT59w$9cf6103c1ec2997e1802b1f6eefa73d65db8cd3fc13cef0f5086041d17e0f3a2dcc55700ea9dbd0b121a504d9318d79aaf9c23f839c996a3e2d2ca5a463db2b5	student
1397	24103004	shriddhibhongade.24d@stvincentngp.edu.in	scrypt:32768:8:1$IYOlS6B8R3NE7vBQ$fc40eced37567ebdcb390840338de15867c3a2d37bca99c36505f955173b6f4ab82e151387f2d07e794e53c495a7e40609ddc41d98c6956fb9c3d9d1860eeceb	student
666	24003125	gunwantbawankar.24@stvincentngp.edu.in	scrypt:32768:8:1$F20s4LBrTBjfa6sI$5cf06afde3fce707683f6201d519023e9f9a2e6bedf78862d474896c513a8cb5f5bce67e16f4c34ad23bec84f4a1f58dd34168c803f8e875d27a20f1ce2d2e2f	student
667	24003126	swaroopgabhane.24@stvincentngp.edu.in	scrypt:32768:8:1$SW89Zt1rvDh1hCqc$85f786da93c1677e9e4a13c74233793ecfa140ab8420db8e24ac06be5d38881fe636e16dbbb3233cc36fbd01eb6b0b3919fb8704352c5a179cb171ce8bf8be24	student
668	24003127	harshthakre.24@stvincentngp.edu.in	scrypt:32768:8:1$pNqcBIxTamm0bSkJ$4964ac5d45ae60da052e91c6b0a8e08de42ac840fd61ebe69ae5fc0eb3c6f93b8886d7e514a772e5709080549a377e805b2106ae7143c53c148b934f86488201	student
669	24003128	ishanbassin.24@stvincentngp.edu.in	scrypt:32768:8:1$gIUbksgNBqli4ia1$2ef5e8e86e685cfd362e2bd7a97c7baba1d2baf44852b0ef0a321b35b1ae35e65e9d6fc576bf83503191f54ad3f162d62577a3e10f1ba1af1e53cadc93c7aa7d	student
670	24003129	joelbiju.24@stvincentngp.edu.in	scrypt:32768:8:1$Fjxzfmia2Uflj3g8$022f4b6a7536b1d1c57242c54854bdd70c2fb2410e4df7ece9e271679161de7f2b18c0277fe1e296980c7dbc956f3f3de4aafd26feb41f3476f61b1a2eed1c58	student
672	24003131	prathamtiwari.24@stvincentngp.edu.in	scrypt:32768:8:1$Nf9gNmfWETv3xln7$b036983364cda1d9ab1af854137c8c090400071c0d464788f959f5807f4019e49e947efcfd5412800a399f2953d53e0b97d9bdaca4db01bd9a3ec16ea7029a63	student
673	24003132	devendrarahate.24@stvincentngp.edu.in	scrypt:32768:8:1$lIQxM8a0qjXdv8A9$ee6c70685fba5a7d2ab1ec29f6a1065e67fc4a6daf86dec7a03d773540c98ea30cbaa364f216a6da62facf0594aa4b136b42aeb5ab10a4a04f8c60fc6ec4a995	student
675	24003134	resabenjamin.24@stvincentngp.edu.in	scrypt:32768:8:1$GQrs5yrGtsg8g3fA$cf762a0259027300abb7c0d55f1f193069442624b05befd7fca9ad271dc74ff2137d91e40e98fd0e0ce741aadab16565de639568cdc2ab1e91fb75c27c65783a	student
676	24003135	kevinfernandes.24@stvincentngp.edu.in	scrypt:32768:8:1$UhDFjkY8iWiWhOmf$2f8cf4ccddb1bbf1c52fa7ce6e2914e47eec08fad6ce989fa5e68325467a36ea1e247cac2c1ced35da96bc0aab4e0d8c812274430d56bf4f3e1317a4973625f3	student
679	24003138	joyseekannuri.24@stvincentngp.edu.in	scrypt:32768:8:1$XKVqjKMZ8PuvljCL$af1365803048f96dcfc3f7ceafce47f62cf9126a956b53f2acf46ef4a1f8570d929bb91de00f2f973ea691e8aa900c05f2bbcc4a718c525c63f06c56e2cceba7	student
680	24003139	marioagade.24@stvincentngp.edu.in	scrypt:32768:8:1$9qdNeHE35qWJr5zN$19cdb933905b413d5eeb12328e19f0a2247103b77620e1f00fe2ac673ad57545b5a97aec05ec89cd07476d0eec53408b4de478a228f10274da361f30b0339f7f	student
682	24003141	enoshramteke.24@stvincentngp.edu.in	scrypt:32768:8:1$C1Jk46leu1RwThak$b27a0ad5ec969a1544c6c8d9cd2c948a0734107ddc90e640bd9b26f6f5b302e963e6280cd54d24dd7e4d5a12fb1449ff7d915fafc6fb9cea5db167e82d73d6ad	student
684	24003143	elvinalovett.24@stvincentngp.edu.in	scrypt:32768:8:1$f39vFBdTNpnejaVj$1f30032c3bffcceb00c8af0c155139ea4701fa80a07d79ab08c308396382297c63769543a4355eca5a5652f183e742a7da58285698664e1e174ff3c2f4c5f1a6	student
685	24003144	abelbovas.24@stvincentngp.edu.in	scrypt:32768:8:1$u3OxzwsmGuYZxL3C$1e4b081fc7c54771b2880b0f841eeae2ca35109d7a40b63f2ab97eb532a42d0c1af1ce11a66c1376232b6d5d638c9b2a94c7f5f2824dfcdf92c5bb0b777325d9	student
689	24003148	sparshchalotra.24@stvincentngp.edu.in	scrypt:32768:8:1$VN3E7xeha91Y5NDW$a130dc1fdc9c30fbe54f85cf11306e3b85dac73a6c95e40efba9bfd458c0c601790cffd256752e356091fb9e5d8b77797aab76fa1d24bf5caced55632f2a0c07	student
691	24003150	vedanshumungal.24@stvincentngp.edu.in	scrypt:32768:8:1$Tw8hXCHCWNfvSSNq$66811232fd36f430b7ae9f1e988945f757ff8bf839d1f95ee89ccd0fac89ba9582ec875d39707b3edad109f962ac5e7c9c8ee72ab3f3f5e4059c6d70c4837bf6	student
693	24003152	dhanshreehande.24@stvincentngp.edu.in	scrypt:32768:8:1$vewkIRHNvmIImFmI$0d48c6e9e82e4575bd15e7e012e633c7571a00658e2560c6f7af0994f7c24e051566e96dadc2ae585b4600dbe7f39046a65461a6c2e867b2a9437bee1efe492d	student
694	24003153	yugalkalaskar.24@stvincentngp.edu.in	scrypt:32768:8:1$tZyDwtwZScbSh1PK$e80571ae095daa0813749c1e4338002e210d0407077c232650161a430b02ea85acee3df9880ceb3de8b157dc009b623b7f9d98ef00ddf229d08c7b3b59a5ddb7	student
695	24003154	adityachafale.24@stvincentngp.edu.in	scrypt:32768:8:1$YuguQX2vFzuwFHpE$0bc433ee57cf889005a17b2e9853a5ecd7446c83ddf0d45944082c4e13d4dc9d9343a1e9848eaec85b36bcaf31d5894c0435741991cd5f70bf842cceb01c2bf1	student
681	24003140	fionasamuel.24@stvincentngp.edu.in	scrypt:32768:8:1$luBQCfRiniUKfUR9$eb4335a097454b20f606abf1c3f106a1fdf95601e489910db74d5e1ef07b083124054f60b554ce64a29110bbc92669e41336f3b8e0cee762a092a45430da3b3a	student
678	24003137	anishkindo.24@stvincentngp.edu.in	scrypt:32768:8:1$6Zr1IkMmRsT8Ppx7$09d3fd276944c37c2000fdd7b6a44adba022c3e777deebf6dd43751838877381b5971108524301774f598c4b92adca47534d2d0fecdcd848821429d5c360e71e	student
674	24003133	kajolwanode.24@stvincentngp.edu.in	scrypt:32768:8:1$FBQYPXSd158G8Miy$b11132c002ea8e713268d9890262cffd1d493bd3c54ac0f1b477f1e01db23eb4cef5f74912ff8e571c7252df3b3b383a6bce075b6a7d8d6175057aaac4c4ff0c	student
677	24003136	prayuktamadniwale.24@stvincentngp.edu.in	scrypt:32768:8:1$c7bYiOGG2yBD1oHX$413ef76d6e0bb8edf1002eb3e405f6052c64a1f52ce84b5aeafff36f1739d5bb958e18a3299b92a8433afc1863cf8e1dcade2eeafd0a9ff63a38ea89113d0d0a	student
671	24003130	sankalpjadhao.24@stvincentngp.edu.in	scrypt:32768:8:1$20lxjNcISSiqGwfR$efd2be4bb8046ef967d1cb6f3bd993803cf814b5dfaea1c3cb4b4ccb61c202a7f530915b1378d03a013427301ff305af3da8d1e7f59631147ffa270c24d02aae	student
692	24003151	nachiketparkhi.24@stvincentngp.edu.in	scrypt:32768:8:1$bWswbJIP5Z78OgJt$bc216a080c6f28c49999679f8db22af99c8376c5d75fbcd330bf4cb0a426d627bd33f01172e5374dc394f1477a97d3a3cc6375b2e056cf1fe5448a0ae53184e6	student
687	24003146	ishikaburde.24@stvincentngp.edu.in	scrypt:32768:8:1$dT4Sqh84ZxzHKQDi$b0b657911796adccd542154ac26a654f062f78ae78d446039f327bf3bf96f1ef1dcc4a42c1a2a9ddda6c229a6a98085a7d913dfeaa65e0502298ab5d63d1bdff	student
690	24003149	vedantikabhoyar.24@stvincentngp.edu.in	scrypt:32768:8:1$NTWweiuCAnTbLQMH$945683dc45a3df3c42d2d5c1388a5433ee8f3ac23053972883e3991e77a117618a9c01638d56d80dfb7536b4480a1a80de2bbb941d88629f2cdac3fba55bf81e	student
688	24003147	sujalgaikwad.24@stvincentngp.edu.in	scrypt:32768:8:1$4ejb0TDsWNdQJ8no$5cafd81876c51190e5d56110387bfd970fc8e1d8eb864c7ef928a133b564f3dde68c034ca6c12e5a5877f2c9062500f0d1e69d58c3ae743114e41ed9541cb780	student
683	24003142	sherwindias.24@stvincentngp.edu.in	scrypt:32768:8:1$zgQyIoydkF1aismU$89b4cd497144d9f992f38084875106261c44f760b1d31450e302c86be1275f3b0b5cf1cbf918dc58101d6bb8db012154e4c9cc5e88e2974d9a435a53c9201d23	student
696	24003155	ayushingole.24@stvincentngp.edu.in	scrypt:32768:8:1$Ogu4e7ELr6Ga2hie$57bf97b8e77241339bf4d8803a403ea92a806e06e5ec31a712cfdc965e04482344ae914d9a9612cad6cc7b9a533f1c5f583173c28cf6e748380d4f68c273faa2	student
697	24003156	rishiwalokar.24@stvincentngp.edu.in	scrypt:32768:8:1$DfwxSxUf3vztn8pq$d8a65eacace2d9c947dfd81d71cef0a658aa758bd8b30a7a2262eba5bb6119473d7eb984f25c0056181ab6cb8e806b1bf7b46aa62881813a6e81e357bca558d9	student
698	24003157	prajwalmartiwar.24@stvincentngp.edu.in	scrypt:32768:8:1$2GZPtV42MhShn8tH$8ff4c088082284fe71c3f1194d2bb4b2a8dc83867f3476067d36a08f8a031f6eec55ad73320ac910ecfb23a706760089df0898a51cb8433ba0921ce8506dfe6a	student
701	24003160	saniyashende.24@stvincentngp.edu.in	scrypt:32768:8:1$TO62bMBnZaFNnVbJ$987b7ea90e514196d8505f36ef3d1e01536de4e1d0721831275ab70d710bc4dde8e4a5a5ee0a9c1554fdf6b6a222acc9831df771ad0f31ed1fc892396c365069	student
702	24003161	kavyamude.24@stvincentngp.edu.in	scrypt:32768:8:1$7ZsmV2zJK6uD3wnx$2c050536d99d8279eeac4a1c27dc36ccdd03037cdc58f462146a3cdf6ada351614126e8c1542e8c72df98767d3f64e09d492ad6d3324b5cb94b284d0bec52414	student
703	24003162	aryannakade.24@stvincentngp.edu.in	scrypt:32768:8:1$JcuWNcWSOtb5pGjR$bc5ec14f068b20f119d7464caa06708a1b1646ec4c641328314a680bf67387f66ef8eea120e20fe791acff74a9518ae6c0f237983d459e5f8b5ae17bb3c1b6b9	student
704	24003163	ojasmitakumbhare.24@stvincentngp.edu.in	scrypt:32768:8:1$ycBjH908vefYEYrb$b9a51a8c237afbe4734e9435bb439148399bd8b60b9ad75a83bf99279cab8257b9f28189976111f88d17448c1e6f39c351e94b203bc4b6a3a4637f3673891fe7	student
705	24003164	vaishnavisatone.24@stvincentngp.edu.in	scrypt:32768:8:1$gdhtfb8a7m81wy9e$0789a05c8928c55b925c0c37797e7d3068c445ec8105f097e5a41cd6ced76ac8221b62ff500aeb43d7b69548d5991ef0df799a7e15a86917b3676df59fb7a6bc	student
706	24003165	gauravgulhane.24@stvincentngp.edu.in	scrypt:32768:8:1$YAcFlRhTs5FfVdbL$ef663f2c27d4267a6df60e79643349196d5be637ac76292b4c1c132a9cf9296caa0a8dd8ec56393c831488c51e8069de68bdea71d9d126fe4ed373a6dfdc81bc	student
708	24003167	aratishende.24@stvincentngp.edu.in	scrypt:32768:8:1$eB1jZZ1LVzjziYqz$f7c8dac090f0f851b98b33937897736de13cef0f4d5d5f9b914f9efd2213439781fd68b333c55b4c9964fbc517604cbebab36142d8d7fae4f48aa227ed9977e5	student
709	24003168	janhavijoshi.24@stvincentngp.edu.in	scrypt:32768:8:1$jib5oXX8e9hIeh5M$aa9e611a06dc4f17c418326113781337ba28a60438df34878384323980db05b06f4d9f2d97480aff66aa41b3ad09c3cc7bd399ea61007e864827bb6676788830	student
710	24003169	smitpatil.24@stvincentngp.edu.in	scrypt:32768:8:1$bf79ekwJy7H7etsX$4fced244b7f69a40b0346b686a21371c7be4651a7f935cc3de032162abea7f665cc9be9a89f8c209487c2a2880f0be1935c6de4501d43ef356b853ca5bd86751	student
712	24003171	vedantkhetre.24@stvincentngp.edu.in	scrypt:32768:8:1$yOcSVjlcNLarZ9K1$a290389509aea145606bd0dbb4b0adf49cbfa10c1cae0fb715b936fe6f26d5abe0b02c8f66e40cbe85b64111c84837da30301f67bbadc2dc62fed522e1cc4a78	student
713	24003172	zubiyakhan.24@stvincentngp.edu.in	scrypt:32768:8:1$jR2Tn8cWf7JQ3wGW$e1354d4e58881d15ad3ae421596e8f6ce31de3bc11bd6f0d6880ce92d04d34a306ff259c09016549eccec1d0d14aaa0dd52dfb3e9b6f2990dceb423345448273	student
714	24003173	rohinishende.24@stvincentngp.edu.in	scrypt:32768:8:1$0Ug0XLhL3hzgXaEa$22d3366370836cfa572aab38586f69e5c25f480c2b08492b742f201f858cd1e9df665269aa0d1a810dbc232dc2222947a828caa0d24f8f90d116174993692304	student
715	24003174	nehapatil.24@stvincentngp.edu.in	scrypt:32768:8:1$FMirlZ7JR2Zg9Mvq$a2deef587e974005cd3ca80dbdd6485248b49364e134e95c5e6a9670d0d8aa9bd43d42f7bcbea9e33c798cc9a4239b834ab60ee039de773d30f75af0d767ac77	student
716	24003176	shlokhotey.24@stvincentngp.edu.in	scrypt:32768:8:1$1fzHkOz0gNF2eLYM$367dece49b81b0bd4c7cdba3cd9f4ea16c8c81565a322488cc54572d427f192e33d131747dbb4b488d816d81e0653b7bc9327aa0bc87379eb4f65a279ad3ea37	student
717	22001127	parthobanerjee.22@stvincentngp.edu.in	scrypt:32768:8:1$P8Qp37VnOk67JOgA$55d7663c3629b85bdd1787ce3ba1a66b4440f2fd9f5822313df098529118af4098fdacfa6d5e4d0f23157e5eaa176d42a006a8e12b9162cbd696babb468b83f5	student
718	23001013	atharvatrinagariwar.23@stvincentngp.edu.in	scrypt:32768:8:1$wZSyA7Ev8kl1I2JR$f717976038154d30bae2bc5170d8e8712464077346a9e7d85597cde3ce888f1362ccffb63cfb755ae38b8acccfe75f9d3773663f0ac06c0a074ba5630446ef82	student
991	24103006	kashishjoseph.24d@stvincentngp.edu.in	scrypt:32768:8:1$EPNiGexxNlTxRSS1$3cf69924415b0cdd681aae3d51e7512e5e22899c3b08de1cc29c85acae7675442b0f766da7b845c39621974f8337911458007dac6f8ffe444af1e068187b2c3e	student
992	22001005	rimanshusonule00@gmail.com	scrypt:32768:8:1$A1TBA3VV26jFq9Z7$93b203e8902bd4d6c1a005238588cc24ae4df16cb5401ba3db63a15e4b7899d9b41551d0b7bea31e7a1d52063d69fe2f1d1e16bb9ee8bbcea2e62f841a22d4ee	student
993	22001032	navinchollangi1234@gmail.com	scrypt:32768:8:1$zZBqpSkTjCHZhYvH$a7406120e652b5dbed649b68538f3eff32f25c3376304dc59f1177fff61fd33d49d48b77f0f814df3db23dc8ba458b63ceef2ca403eb18740e603fefe80aba63	student
686	24003145	tushartiple.24@stvincentngp.edu.in	scrypt:32768:8:1$wn9ExFdKJd5e1mTt$a7659e11c7b45baacfe68724633fc213beea4175a2bfff39305898ce80ed4b50a1e66f8b696084a1b01e5b37913cda8986c4dbf0a326c5a0c458e9419a5bc428	student
314	24003001	amanmartin.24@stvincentngp.edu.in	scrypt:32768:8:1$jn3k9obDVQWcMlc5$759b1cdce17b50ce9c6428ba030873d191568e69c608830b7746a3575a31e29a44e21d3ede0f9925290b6d77be4dfd1771c6db55e19b90dc5b62c1c8a08a6b0e	student
418	23001097	sakshibondre.23@stvincentngp.edu.in	scrypt:32768:8:1$FSmGsOlKT1W7l9X3$baad9808b318a9170687fedfee282a68039104582ddbd39ba2ddc46047c2b9e00907c79f7245e371903921c84cca928ec240ea40c05e2d7bebd2959aeea85e7f	student
699	24003158	virajmohadikar.24@stvincentngp.edu.in	scrypt:32768:8:1$ywuy20nOVk2ljyw3$11d765fb90a6bf9d63986a3d02d8e79d1b3fbcc857f20697d48051d897b657938d29ff880450419565b2e587e305bb2795cb825eadae1dde203ee7616c94be0b	student
700	24003159	bhavishkapaunikar.24@stvincentngp.edu.in	scrypt:32768:8:1$PcyPbMq6gzNDSU8c$904862c9892f65a891f34df1ffc514ea878a059dbf47802c2941bb88dd95d2e2ac14f1062ff7a29d354963859cafbb5c90e9476c9eb5ff120574627de2921373	student
1398	24103005	\N	scrypt:32768:8:1$yWS0fMyBhwxzODKZ$2d67d2a5f4d8619efde818a6ee3ebd5a9d13f37c5fee37605c8d6d63923fa13b1fa31183d62bb8aea13a97142d9959d44e3ccc4bf29823d4d9875b3c1bdf8276	student
707	24003166	chetangaikwad.24@stvincentngp.edu.in	scrypt:32768:8:1$aUpUQD4nEepd1SB9$26c5953d6a98803a6ded8c3337c13eace63835bcf3737ebcc92fa83fcf0bffb5b601a7745f659463414df16f66e7bd214441467ee3a300cbf88a570edd599cf1	student
1400	24003012	\N	scrypt:32768:8:1$ODDNoAZu7WN5W6aN$9e5c5f07aa44a06edbbdc9b552225aecd38ef03401d2ca23cca2f2334b908c7c4c46a1b10f843b9aa9fa71455dbe404b67aa38544fee153c32d6e07fd903ac5c	student
1403	22001006	parthdange.22@stvincentngp.edu.in	scrypt:32768:8:1$hBsjaq9LX5I788Cd$3e8970c044eaf470b465ec9258d0eb8688b6d1bd9ecc265b8ec5d6f014824998e907af751184b87da4f07d3618362e00bd4f300194b386fb3761c15b187c48f8	student
1404	22001009	mayuraglawe.22@stvincentngp.edu.in	scrypt:32768:8:1$seb5cdr6QnwF6lz8$a86ca616b355a9a869a190d2c2017d600def91e3dfb4f4ab16488f8fd08a7bd0a734e693d62c308aabce11955ed5c71e1f7b64dd7c3995c410995b08bbc8873a	student
1407	22001016	himanshuhiwanj.22@stvincentngp.edu.in	scrypt:32768:8:1$Xl8pz88FBcZf9tSM$c90321dea06e7cd6a89f59515a41b40301df9e5c16813f804f7a7e2cc20750319b1b2b5ddbfb5c73936071d29daa537d5b5b5454e8de9c82d1513ebd327c1ecb	student
1408	22001018	shashwatlautawar.22@stvincentngp.edu.in	scrypt:32768:8:1$Os8MgDcaduaiOY6T$61633c58837575012e5954ee47168d358fc9869832e6da1a0b38b911c67f580564939769827e488ab897df7292d68ce52f5bf95c04d260cfce6c1248fd2ee1a7	student
1410	22001022	rishabchawhan.22@stvincentngp.edu.in	scrypt:32768:8:1$VHzhENan1FjAdD5w$9b813d297befcafd4c9db6a254188099e404a13e20ff04053b3297102ebecbbbab3ab8972e715f39e71d5d3f00cbf230302c223d47f79b5c1cf5a8a855b02999	student
1411	22001023	mansithakre.22@stvincentngp.edu.in	scrypt:32768:8:1$9URxgnXdxysuOhrA$a840b7bdb24a0b6a51bb96d57c359481cd97c62ed0c1ca91c987f174acd0bcc5f14574de50a7a84c46655ef55a5fdbc2bfc96b0100146aa4dd2ec15e7cd20c53	student
1412	22001028	parthupadhye.22@stvincentngp.edu.in	scrypt:32768:8:1$epXwcozHiY303x0a$8ed8ec6807d7682ee8c2be6f7eb8ccbf475e6d80179ad3d9ef89a14d647b8c294bbb380345cbd75d6a75fde743db3259fa9491d4f3c39acc877de2495cefd7f8	student
1413	22001031	manukondasuresh.22@stvincentngp.edu.in	scrypt:32768:8:1$lny6oOshjfWmN4Op$b655c6ab0c0647df5871a2a1f63d55e7500206cb3604d49c2565ad4b855efa0ecc080f113bbeca3aab5b3334bc69023a6dc67760ca847707b787f1e43589f9ca	student
1414	22001034	neerajruda.22@stvincentngp.edu.in	scrypt:32768:8:1$v7EZWylpheNGFCCF$5470642e912968ba8a16c1a8fbbe586d40c98399ecbc323391190b4871cd8392c8c112191d640bb90b08b723311840417312b7b5925a67c9e6572c148df38678	student
1415	22001035	ryanlawrence.22@stvincentngp.edu.in	scrypt:32768:8:1$tZkvdOsriocla9qE$3919f32adf2729493343db519780e258bb7677d924547c849b0f35be3f04383405e8b2771d8988eb7d5fe6c30867636afe726cab3262815730825aaf596bda1f	student
1416	22001038	shalinyamanwatkar.22@stvincentngp.edu.in	scrypt:32768:8:1$bBbK3GWfwGpptunJ$e9ad4a1da1f9f9b5e6fc79bb23ea2016d538a49d2f1525b21e99b7668e310a1092f0b76507e9a336fb0a67a6c4e05ebecb54d5ee1d35ab677e6cd634f6a81be2	student
1417	22001039	justinaugustine.22@stvincentngp.edu.in	scrypt:32768:8:1$Z1HUMmleAByG3G7P$41bb8bf787f257e7f407dc5a9fded3fa77a1a03e3cd8de8e223ab0aa42a251a640ee52bc9444ccaf7a33e80ecf4a1da03d1a76ba5b6b551684900d0cc9dd6203	student
1418	22001045	elashadeoghare.22@stvincentngp.edu.in	scrypt:32768:8:1$HvxC9EVSg6AP6oiB$d2f60f19af75d88c6a4a3eb7351b18c98ea277749650d95f63ed2140b0101189a47a4f3562a17e20da83b8336e4ecc15dab9c07cef64ca4b2cd39f1d9a6ccd97	student
1419	22001048	sanikaumredkar.22@gmail.com	scrypt:32768:8:1$tMjzjnY9tQZJc91d$773f5322e2df9301248b6878ee07af6401ec9522a7768dac2282c94446f609471536ba07406559b3e6d00e632f18ef1ff004907bee514b2862df48c9bb762905	student
1420	22001050	kashishkanojiya.22@stvincentngp.edu.in	scrypt:32768:8:1$SzMRz1qHRdW9IKJH$46390decd15d0eaf62d9033d8c453f8e3136b1c6b6253153c3699f4dc0c1fb46caf224b9cd013e3c4e5271cd94c559e442f7b9f6e78c3d35702c4ce686e1b593	student
1422	22001054	sarangdandekar.22@stvincentngp.edu.in	scrypt:32768:8:1$uj5KWe4s2DcISCBi$c6513e7b7f3b99a3cc687f79aa6e2c496d4ac2814641fdefdede7e63560970afd06744cc877fb1dbc70cc5a31afe45acf9eb093372aa0488b3e82bd8f83dcff6	student
1423	22001056	Madhurashende.22@stvincentngp.edu.in	scrypt:32768:8:1$dIhQRXAAcpiNLF0K$b7c8f0889cec9f958a3d4d14dd8f39ccc6ca3e587a7bd0bc9ecc52d2ee5435ec55a0fdf99fef5be5eb30c46e1f4fb4fa53a242a8c172820a4f7ca14fd18a1e18	student
1428	22001066	tanushreejoshi.22@stvincentngp.edu.in	scrypt:32768:8:1$OvTezZ9u0PdM4PiM$9b7e65b38da10a7dc7282a1a0697d4a2b109c72a1dcb54207a599ed1060777c6272153971d8287e81db78134f2a27aca2dc9f2364c9599156a6eec601055d956	student
1429	22001070	ayushkshirsagar.22@stvincentngp.edu.in	scrypt:32768:8:1$1DF5Tle6RnSg3oen$055ecd03828e110d5250d087dbce6b8d24c4a2613620a7c885dc35e276c457eb4fb090935ffb2fddb86f443ae5cd23400b630bcbd249254eebf363732bb18201	student
1430	22001073	rutujatamboli.22@stvincentngp.edu.in	scrypt:32768:8:1$x5lZjSFic98Xv9fr$b2ec6cdc6691dccf4ddbe4d7d9d74f502c8e62887f52e01c437dafcd6f9a690f35258e0c394fe920717fa6305e1887b22711e45947d3842869e10d07db0b7248	student
1409	22001021	bhumikapatrikar.22@stvincentngp.edu.in	scrypt:32768:8:1$OLfVQT2BVNWxh4Wd$85731a0765ad242344b479f1ab041a536d107fd4f843f0e06c26661029917bd66e211b163b8011f2a2c64834db21170d4e166cfa2817dbee04a0bc9d357f0b9c	student
1401	22001001	atharvanaitam.22@stvincentngp.edu.in	scrypt:32768:8:1$tck4o8pcUdK7uoeD$255c972ac08c18cc4e204f587e64fc5d83719b0845576c5c8ebd7fb94715f08bbfbca639aafa8b837a485235b87a487712ee1b73b048b5962fccc029af1455e7	student
1427	22001064	khushichoudhari.22@stvincentngp.edu.in	scrypt:32768:8:1$LBXLqkDqqVqTKO1Q$1488f096fc97ff3bd0c9507fa7b723445ec40db9c7744223fb5bc9b8cccf0cb44e255e6bbf2f97f07d9b2d0a2e1f9f8504bc4b5b4a10859ebaacb6ab64d94960	student
1406	22001015	kunalwandhare.22@stvincentngp.edu.in	scrypt:32768:8:1$ES1jL9jCJJ0GTgUF$638a5bd3a96322d19b016a5e20455f3cdb82f7542e7f00aacd9d26621544ecdfe246029befc4613943e34d59996f8be78841f75e5246fd70888e30afae49e2a8	student
1421	22001053	anushdighore.22@stvincentngp.edu.in	scrypt:32768:8:1$xlU6I6crjpkG1O4p$08e0d557baf3ca9294a370158e011eeff7d41b4bafb4e1652721470ab5451f52ef4b2af9e0cd81b154bb89beca667d6d7f1b17c3337e8b6d70eea318a215c9d0	student
1405	22001010	gargiudapure.22@stvincentngp.edu.in	scrypt:32768:8:1$fXIn8YsnxXN0LCN1$1c638d99a8469d9baa5d6dba72aa9381013446e38f4a2bef216b827549e11a502cfd8d1d502ca6a4a0a2deb4488867ccf1deae3f50fa59d2561098d9ab338d20	student
1426	22001062	sanvedkabade.22@stvincentngp.edu.in	scrypt:32768:8:1$SCXQszY5E8R9o3Oa$596d7c94a37dac1e955cbcb15299fa3b69b169b75683ff840fec6e5df6be2b60d686a19ab555df6004f6cee6e0112223710cbbb20209054fcd354bbd65f1d7f6	student
1424	22001057	paritoshmagare.22@stvincentngp.edu.in	scrypt:32768:8:1$IK0rhi6yGVazBEwB$8bb768cc4a455bb306f89bfd582546f88e0c690cf1e0ac27fc36472cbe9127bbfcd3f4bc104f811957b81d75e1cc690411daa5b4979c3ecd77a4aa982ca04d67	student
1425	22001060	pranavhatwar.22@stvincentngp.edu.	scrypt:32768:8:1$bQwKS9zlShfeLcjW$883f1535339d2f6ccc48037ab7d7ed01caca0d853d0a363226f0280973cd279a39cb98dbe1a2de21f4e47b88a43aa7d06ab02237b46b596e7645551a523ca95d	student
711	24003170	ruchiambatkar.24@stvincentngp.edu.in	scrypt:32768:8:1$Ez87eHAwTV8BcYVr$d1006fb9a05f7817d17e32841ec3f8ba98fea6cd6262473f41a5874115595a4de02dda8708c427c61ad85c0b4a41d0a8cadefc670413a2c69072d8fd69027ba5	student
445	24103107	shravanwargantiwar.24d@stvincentngp.edu.in	scrypt:32768:8:1$JOd6PemRe94VdFlf$aa928cc8b771c0979d1cc288bcc665d12cb2fd858ae5b19ad576616759ab69382b420a284b01dc1f530e43c917622441b8c9419d71c441d411323990e7304245	student
663	24003121	atharvasonone.24@stvincentngp.edu.in	scrypt:32768:8:1$6ReldFPiRyejr7SA$35d2f3e62e65126b28aa04da8b727b20ce3e94f44df7658430fa2229b1a6994d01f9aa29379ed2974aceaffe5b481cbe6530ac2e19cc45b4afb9db8e125e1c77	student
1431	22001075	nakularmarkar.22@stvincentngp.edu.in	scrypt:32768:8:1$fZ57lbKydOLhHMOw$03c556df503235e61513a705ac0e84b57f4e3a6f980b5c55b3658ebd26870fe9ba4f13c4a97e009dc8acac8d0ff0add67ca49db21d4364d4928eed61b77f3ba1	student
1435	22001089	latikmohariya.22@stvincentngp.edu.in	scrypt:32768:8:1$JtPQCoZ6KsXGXKVg$09a84993d33fe36beb1b0fd2263ae9c188ce58ca8b0d2fe710b18d31190ee8dd8e859ff258a9e6dacb37527742f3c351f1de5125ce12f2dd7350e6593f16a561	student
1436	22001092	sanketthakre.22@stvincentngp.edu.in	scrypt:32768:8:1$5WyWZAOOLVbjXKqa$391fd19f47da708f4f16f3c44ae8b18c92ffddeed9e8dc7e79063130759bd4e9ece1948fb38d6c4e590353fd830b0ba840af89d08b27d92c9aa00a2e4931f1bb	student
1437	22001093	nevinoommen.22@stvincentngp.edu.in	scrypt:32768:8:1$5ddYQ1DLFU7c4Agj$dd0881027470d8d1b44c0650c6123d466292a5afdc1c79f8e366ae1939afc73a1d25b8b1738a656e7a5723cf0e1ffa0587e989e820ec88c8eec9c8376daf1d34	student
1439	22001100	darshanbutle.22@stvincentngp.edu.in	scrypt:32768:8:1$O8gyppQVF7LQEnZX$8b02159e56e3c8b7d532e0dd93f29193a53bec85404bcb68253b17758624a674ed147aed542609e46109c12180c7e85e908b521c02862137c65c0e6d621223cf	student
1440	22001102	rudrakshaasati.22@stvincentngp.edu.in	scrypt:32768:8:1$LljlvPcPTkweiwkz$3d0c1d91d2350fae6dab12dabe505cd7864b73eef0f1f88beb70bc60f0c7baa4327f2929d99dea8c2a7bc93cb1c5204e52a0d0a31b826056594cf89b8de2bb7b	student
1443	22001111	kaiwalyapund.22@stvincentngp.edu.in	scrypt:32768:8:1$fbxN3tU9coPRX0FG$29a7cace2159a10acf0314655427a9a731329f61765bebdbac7cbfcbb773139b3ba8cb0679192ab9c044e31a6dddaf9ec478d8294de3c7fd0ab88ce48b70dbb5	student
1444	22001112	yashsiddhabhatti.22@stvincentngp.edu.in	scrypt:32768:8:1$rpMAqlU2LQwFge0X$f1a2d9e47c6b17d74518bd8607c4746d7e4fdfb46dd3a73994e66175f45a006ce01b8432ab092c9f585fbb2937f5ac91ea09a29f16175739c01cecab1ae9ae69	student
1449	22001128	vivekkumar.22@stvincentngp.edu.in	scrypt:32768:8:1$cmrSMX6adWhFsDxf$782d10b3514e05edbdf4e5e60af7de180df4979c6bb6471ee04166b920426c76247798248bcefc3cc887b95883fe84701b3ccc6b39f3adff6160f60472bbe715	student
1452	22001133	atharvibabhare.22@stvincentngp.edu.in	scrypt:32768:8:1$7zi1SWJ5P7JBxU6v$40bd3b49471fae8d1cabc36a1e9792a9e80cc0ead34e19326e631178ce08c3179038fb0b65a3de18d6cf36263ccfd1902b3cfb5bd4a93a763ab714a0f0e42196	student
1453	22001135	villayatali.22@stvincentngp.edu.in	scrypt:32768:8:1$sMmM1bAf6YLc12RG$096660a668e33c59af773df1b54cf951de6b0c192fd1b624b0b1bd76fbc2868700d064637575ae86712c9c4bfad19f1d3094e590cc3a96496cad48eef5999c10	student
1455	22015035	kasturichavan.22@stvincentngp.edu.in	scrypt:32768:8:1$ByGm1a9O8ceyxj6F$d457034c916e417dcd577ace78825aee37fc5a5a6e4cb4db922a615f327615c90962331f68a3e614908455ea486bc23300cf85b789583281b043feb10f1e55f9	student
1457	23101004	rohaningle.23d@stvincentngp.edu.in	scrypt:32768:8:1$FqcC3MjO82nhgSLU$576538de682e8845fedb2e01cdb80cc704023342988cd0ea88238b4bda28290ad21605fb6dcfeda0c5589b5e19a9859d1589778ca8077aab5c342481b56a52c3	student
1459	23101008	roshanbhuskute.23d@stvincentngp.edu.in	scrypt:32768:8:1$L1bgyRIsBmiHiIkI$af66f67d6367120b5706e26a26d90807693f9c4ce5bfe6675aaf016e358807b62e3b8c9958e9335734606acb05938b64ccddf7fb9747d4dfecbe26976df2ed82	student
1460	23101010	shreyashwadibhasme.23d@stvincentngp.edu.in	scrypt:32768:8:1$qHrZYiJtLySBo76g$1eee1aa558c8b498742933f1de9cfa078dd34df80c1d70e1b137d84b6a5074bc2227793475daf2f6da5cab3c6a5012c53a3c861193100b903100b6ad7d881cfa	student
1461	23101012	palashbhong.23d@stvincentngp.edu.in	scrypt:32768:8:1$NuqzurVrjkXJf0lm$650d5a6fced9d68fd8ed8c0588e559940c402f6f5bd63c664fee652fbcd501ab6373dac8016cb1642876fcb33938a9a516006e4e14eaa04ba2aec95218d65834	student
1433	22001080	chaitanyakolate.22@stvincentngp.edu.in	scrypt:32768:8:1$IsBHv3DhZqx2eMWm$59d6e2d20629666b9d8c7febb262f9821924b87177146a0175c37d513235e4fbcef062174228f5ac6ef2048142c671741624c98c3e598bf9027cdd50e5933f49	student
1438	22001094	aryaingole.22@stvincentngp.edu.in	scrypt:32768:8:1$gm7A2adxP4Nbov27$be1ef4c38fc96b191397e8d8d1e066b59b6b80efcc5fc7dadf6ab4ecdcb73a6517b2757b1bd30f082e07e483e199d4249f571505bd4f927636fe9754165c5a63	student
1454	22001136	sahilkumar.22@stvincentngp.edu.in	scrypt:32768:8:1$emDo8PGQqgjQgmxr$2d7068c3c8d9bc10c7d0ad3ce3b7a7b5f53ee955cb9784bacaab7d5180dfb539c0b1d2663741c8012036271a6dbda4aaf14793714dd390d074aa0f29418c1a6f	student
1445	22001116	sanveekarandikar.22@stvincentngp.edu.in	scrypt:32768:8:1$MFfz4Wv9VUj7THaP$4fc2c33c52fe0472c96a80d5491ae249864c75c94ba3690c1f32162e78c99c2794c0539bb6eb97f4359babe190e1d12abdc8cfb8653eb13f4aada886e9731a0e	student
1451	22001131	sajalsrivastava.22@stvincentngp.edu.in	scrypt:32768:8:1$DJT5a3erZUnz7Ldb$bf5971d983bc97c719aa8dffcffe8461125e2ff35e09de5abeeb22f867f5d16a8e88db2a8a5b462786cadfbfe77749ab12253124f56e129732501cf97298d9ac	student
1432	22001077	sayalibamanpalliwar.22@stvincentngp.edu.in	scrypt:32768:8:1$K4f3vHOtavtvND2R$4ab47220dcd7acfdf763d5c71a3fdc65ca1142545edbae9ddfd2946bf992b263c9e4ffbc65f33e213434b5fa43df2e4006a4a37af6138bc9179254f1d13fd233	student
1442	22001109	ayushihatwar.22@stvincentngp.edu.in	scrypt:32768:8:1$7wyVBmv2LrOMKxxs$375103c7cb11d2399e5617fc2dba3e5e150e9f379856cc26c1af7f861349d6f0ce5986df478d42a73fb71daacfd52e2ff86d758f212fcd4e5bfb50785cf8f8b2	student
1458	23101006	akshayreddy.23d@stvincentngp.edu.in	scrypt:32768:8:1$YLAnjfh1FskdXYht$e54be65ef4da9deb9160112e1612ef99011ceb483e883ee34cb8601fc9e401ee17ea46202529b17dc29068b79ede38834cb627ac0ba4de106bc5c1bdfc4b6e31	student
1441	22001108	ankitaaitwar.22@stvincentngp.edu.in	scrypt:32768:8:1$ADW5QipohF41fEmk$1ca821f4f165ebe26ba5e410be87d7da28d62c8e3903b32ae0365405011b10052c9477e74e465e7c15162d1b47f9755c267f7654b37340cddf9cc601475d305a	student
1448	22001120	gouribiswas.22@stvincentngp.edu.in	scrypt:32768:8:1$5LUTqXGCfCJ0POr6$ffef22605f5111f0e6e7ba97885ef6b1475bc854661e5ee9bbc2c3d7684d68e8c84138ce7f25721feb8704e52aeb68d50a2aa46bb4eb860717041bcb9ece65bf	student
1456	22017002	parinitiagarkar.22@stvincentngp.edu.in	scrypt:32768:8:1$D9qnsENd5RYKYidh$2224d712eba9a4f34954f5ef11cbf2658200e32bcfddfdad7477a71943099235e9308ebb455be19919762bb0c2e9ad5e6d4ab7326c1bb97a72b0835227ec9847	student
1446	22001117	fahadkhan.22@stvincentngp.edu.in	scrypt:32768:8:1$bWfq6yOufY3yHk8b$6a8206432fbee153e549b0a83b530b5d9a41a4b40012ae2990cee8353e9de25f5cf2547bb7e1ad2082e18c1dd7dab0999828e52b7992bc7c827e774e268d4be5	student
1447	22001118	gargigundawar.22@stvincentngp.edu.in	scrypt:32768:8:1$vveK7kfuqVnxopRp$9340560fb382ae06e189fd4447809f764853e241f0a9d4a95a68c03a2a34c6180fb9f5185150aea3565a5eaa6270dab17b88081bcf9ba0c90bc19227f91dd9e2	student
1450	22001130	radhikasalodkar.22@stvincentngp.edu.in	scrypt:32768:8:1$9ReFacDRyLtzenzp$ba7a1aa6bfef9b4d89accdc4d1cae5598d20228bc4483d9b5559db75bdb76f6cc23692886f4c6564b8ce6a151d3c063e41f35cc1eec9cf869f3e063ebd03a676	student
1370	23001085	vanshbarde.23@stvincentngp.edu.in	scrypt:32768:8:1$RJ62EGCqwcnT2Cg0$bfd607e151cf37bace8bd8a27d6d89e14bc004d8a23178f7de78437a573004c156cb764b599770bc00725e7f64ecb714230a425bb076fb44e662fdebebe434e4	student
1532	22001002	naineshzod.22@stvincentngp.edu.in	scrypt:32768:8:1$tVeWVg6sevoHIvFn$7eb5727a1764343fec4450ba7e34a35fa410bdfc5f16f40ee3ed560d6f8a34c808fca61ba57c377e0faf234080a8b42aadb7240db9d56b1b516390d8bb361b4b	student
1535	22001008	meghashahare.22@stvincentngp.edu.in	scrypt:32768:8:1$ATqPsYGys4O75Ssb$9cb1914df74bfd2f4dfbde54f8a543d8c62992a4576ae9c12b24fac194cf5f1e462ae40d80192a3e22efc52e0817a44af4191041e85665e2f17ea7b19fec3a55	student
1537	22001014	piyushbutle.22@stvincentngp.edu.in	scrypt:32768:8:1$1BYIroe9HuAFZOip$42acceac6f4c297945b9bc001c0c5097ee9f3c27dc5bcea421d25561b15dd19256785e0becd2b2bb76ad78b7dfad0d965489840de50146db3c848e6333dd43e4	student
1538	22001017	vedantiwandhare.22@stvincentngp.edu.in	scrypt:32768:8:1$wW9GwAUEj03noPd4$a2f505aef1fa3aa84793adc651c2fb77d4e7716dda1dd1d571317ff5962578281d88cb608ff2dcb89a56fab40f02ca0b9db634b0f9916549cacf81d072786961	student
1540	22001020	adityaraj.22@stvincentngp.edu.in	scrypt:32768:8:1$kov29sL0f6bgAOnt$8779d0a7f6a4bfeb56e3510d83406d4124262958a9795822d1f4708e12cff414e0f71411c34d2221987e177f33e9dd9e876a35e86b3fb4a51be3abe8670e68d8	student
1545	22001037	timothishandy.22@stvincentngp.edu.in	scrypt:32768:8:1$Bf6Fiu48BcioA1Pg$ed8d5c9fda017b5cff03eaee3ccc557c4694ab547d45e5e56c3642272be7f7a4c8cac5c28fd422bffec33f8ac4cd39a7b140940fb1ce96cf7cb81c37192d1a7e	student
1546	22001041	himanshushahare.22@stvincentngp.edu.in	scrypt:32768:8:1$OZu7GoZ1KYr6g9gs$21c1c74d4e276e99697a5513ab55f8df565aec1d5ae39e8668c54fb21fa94da6ed1806ebbb3ca4e42bdbde5fdb73d8e0aedc6714351ecade14677bd876c8d57a	student
1547	22001042	yogeshvarchaudhari.22@stvincentngp.edu.in	scrypt:32768:8:1$ghEuVcpNSZ58IGap$37d2a8cdb9ef6fdf9c11187ee0fbf7f516f13e438b31d42e27a845813a57a9381732dc68fb383356315741f07765c6f558399128d885d0bd0c1af237d883ab36	student
1548	22001043	saurabhwankhede.22@stvincentngp.edu.in	scrypt:32768:8:1$P5Ne1VIDNUOnZeDZ$bb27ae4ee501195031dd13025da20bfb29e8e51dfc182d60fc98a0bfd2080ee0df3cd033217453d325fe76c4a425b478e1a3d9391f1b23a26264261773dda356	student
1551	22001055	harshumredkar.22@stvincentngp.edu.in	scrypt:32768:8:1$GW72nUqdYqHIC7ne$b637c97eb87ed3f2c2b42f6cf886a58bce925e437915a2f4b29d90a2bc99b79078d918662b9f423d8171711b680018a764acda7e2b8b96bd7d79a82478eedf64	student
1552	22001058	pratikshaghate.22@stvincentngp.edu.in	scrypt:32768:8:1$NmbsjmB70RBaFIQe$5aa94fe686190d8b136e096a4f2fbdcc41b9c293273fe537a10a8ebd37d4cffd1ee7974ff48c818cff41f32fd2189efacfa8d7426db76601885cff2a8c86e88b	student
1556	22001065	lakshikhar.22@stvincentngp.edu.in	scrypt:32768:8:1$gbmyhuqfmImj3JpS$591575a2490fd7f172377c6591dd0ddd31f14ed088a82fd64b819f8a979ccc58d6679cbe87c99330742254a6ed9cd93f8b71d4db39f0d3bd814b6f0fb52175af	student
1557	22001067	renushreewadhi.22@stvincentngp.edu.in	scrypt:32768:8:1$bRoNS60k4JhIydDR$48699d5aaacb9db5d30d42bae7e069fa85855bb2e4e188193e0c59f65d70e84708a977dc58c4f16168434615b109856bfe01a0323abaa7c9b483fb84ae9e71c2	student
1558	22001068	ishabarapatre.22@stvincentngp.edu.in	scrypt:32768:8:1$yMSClNTG81b19ILL$f5adda4f0aa45a554b5e82e519640adc395a9e2242ae978274c103735036b35175d78c566bb629cfd50346d8f339f6604aad445b924a897cc83dd4e8a7ad363e	student
1559	22001069	prathmeshnishane.22@stvincentngp.edu.in	scrypt:32768:8:1$XfTeLpynY9anvgKk$efb1c91c696b35236ca8670eaf646a483ef7d408b03f8984195b92ae7bd7ad4a4adf6309aafd469e51cc7d4714cfa7db9d6cacc80f68eb24e9ed895a46107a20	student
1560	22001071	asthachoudhari.22@stvincentngp.edu.in	scrypt:32768:8:1$lmBi6uaUUfApDzkQ$5bb54e2cea444903b6ca4591199bd4950e4c6ed320e86e83fc3d44ef8fa6301c4e6b55537ad0e58a1b03f4431b072a2ba9b6e5f626d535d1cfcb87b48f2cb6ff	student
1553	22001059	gauravingle.22@stvincentngp.edu.in	scrypt:32768:8:1$jWCeFDdauDwAL1vr$1bba20762eaefeba15375a5d35551506c974b5ac69a43e9bc1230ab243b6e8403a8f26e3815354b9dabcd4a5c931811981fd345a4f7f6b650c590a0b1b5d8e86	student
1544	22001036	amiyabovas.22@stvincentngp.edu.in	scrypt:32768:8:1$AarmKOntrxxhS1lN$8b58e31e5d3d1d2ba4fc9df720ef5f9bfcf2d069659b4c8f1b8c511124546aad5bbc9671b0e6ca393a3d8d463c105f0a087f2ead0c02cee344984bee34188741	student
1542	22001029	prayushadhengre.22@stvincentngp.edu.in	scrypt:32768:8:1$FCokeShf7Bt5eXCw$91187d8f3817e49fd3694e7fbc2b437fd5e96dff4c33149bc575cc9f5dec15676e02c4940ab2b9e2dbf42014dab78d36129abef18247e1ccc8ac3313a7f7522e	student
1543	22001030	harshwanjari.22@stvincentngp.edu.in	scrypt:32768:8:1$DsYNwqcsiM8WnAyw$f11a9fed5b38b4a4cc03ef8dab02b9997cabb7a0dd66f2eaa4764fba6800a537194adf0777e116712dad36f482013e74cea3063e6f3a2be5b5306406eb135566	student
1541	22001027	vaibhavibalbudhe.22@stvincentngp.edu.in	scrypt:32768:8:1$f4K8INsOnVMMqFLO$89780bbccdca4a6723aec78b8bbd2b2ca531a616450e6d68aadb9225a61f2d94ed4d65af272769b44700472743fc986664df94de520bc810814a365482e1079f	student
1549	22001047	vaibhavthakare.22@stvincentngp.edu.in	scrypt:32768:8:1$rLVm6J55TxrxS4BT$a7933dedc7f5e47af7ffce4a95fdab59a123e1c81bb57fa3dbee349d5c11f9badf01dc4da642c920abd2f1d9a205216842c4fbacb77c8bf997ba84fe2a4f7808	student
1555	22001063	adityabhujade.22@stvincentngp.edu.in	scrypt:32768:8:1$yec2E9UfRdGrnWzM$5170ffc7a7a830a7c2ec525734e648906d7ff4598b7dfe74fca93681b05565541d2c204f7234d43b8403ecd2129990a875d15c461d2ffe5a8807e964fc4c80e7	student
1533	22001004	pratikshaparate.22@stvincentngp.edu.in	scrypt:32768:8:1$auxCkeKPDdENjDsy$11f0c5bca4903a720a69cb40f5116d84a1b90005dc808e0ef772e64aa32ba085b79638b029816a7c9c650ec0658087bfbda9ba4c6236723a6b4b9d9d0e763412	student
1531	21001116	aryawankhede.21@stvincentngp.edu.in	scrypt:32768:8:1$3FRL1uPrItU5bGFJ$1354fde5d5f60f884d803ba87e647bde8b2ff9731326c79c65239a999dcbbcaac02649e5cdc9a7070c55c638b565ea2b9486ee7f36dc41746f6d0004802f821d	student
1536	22001011	princesingh.22@stvincentngp.edu.in	scrypt:32768:8:1$q3VDERzXM8v4KT3o$104e19a4541caeb2247e689fa7fd8ed3f4ad9fe52eb58cbcc4dd71c641a87ded1af5abe13cbedceae5ed63618711b0bb574c00de4453c53118ab7bff664b82e8	student
1550	22001052	danishgaus.22@stvincentngp.edu.in	scrypt:32768:8:1$EqTo7QnFByJCm8OX$89cbc00cef914d4055e4235490321a76ded67cdc203abdddd2a6ac6e0bd9ef8713eb324e79b104586b5c9c44cafe47c8454779cd8ff3faae238e7db277724482	student
1539	22001019	diyachilmulwar.22@stvincentngp.edu.in	scrypt:32768:8:1$WiBCWhsiAsJXd4uj$981b8d21809d2cd8a2ab110a2edb9a86b147a0293f7b78e7467c398ec75b875f025623cfc431c9eee26350755762c5dc4029acb2b658bfe19908be33d4579df1	student
1561	22001074	pranjalkothekar.22@stvincentngp.edu.in	scrypt:32768:8:1$LzHluG0GlTgZKAUG$f0e05acea5c45dce269c992869e15d9a1fad99f72757079dc79224cf6d1c804905ba19e7fc153666a1638aede48da6f30d3f3909ddcdf01dc5f3d2a5468fcda5	student
1554	22001061	darshanjadhv.22@stvincentngp.edu.in	scrypt:32768:8:1$7YnC8SmvrRfnLiRj$e617ce0f73402b27499c7e1272d92cd1092e21de56bcff073cf82bb066168c77990bef5eeb78268777f6d44160673048faa6f50d97018a010580fb302029956c	student
1562	22001076	shreyaborde.22@stvincentngp.edu.in	scrypt:32768:8:1$I51MqhmobeqF6Cr0$a50457b568f8030be117f50fb8b50cd7852338e19fa0b3ed106a5a511ad078fea9d6715e4b66c34a80a13650fa403e08dd5b9d51026682df989eabbf81cb1c98	student
1564	22001079	samikshadhawas.22@stvincentngp.edu.in	scrypt:32768:8:1$tXwDySNsNcivuHXM$54f445bd595dfd828a4f4d763ee22c3a13a2dc51a8cabd62a4e062751782f7b4998b244bc5dca166ad0ef70f5dc3389f72fe8a30bc8f404ec7c23ad54f8ca13c	student
1567	22001085	simabhongade.22@stvincentngp.edu.in	scrypt:32768:8:1$dFD4m45ec5YEqVDj$765b438f61d651146e6a2f79af9e24d4249625dd47f2682c49aeb1f08c84c538d0b1bcaf261db2c7b6a4fcb00ea135876f07b1b63fc6e5b6a7f000dabbe2f26a	student
1569	22001087	aayushjibhkate.22@stvincentngp.edu.in	scrypt:32768:8:1$mniHFpmCF2H9w2Vp$77f10ec25cacdf061136c1566f0d738b59dbeed08f914414ef6676e791c8968c00173aeb7ff6d66f1afe0d45daed993f5007408da6c8f4e17e6866fb6206b093	student
1570	22001090	vaishalimagarde.22@stvincentngp.edu.in	scrypt:32768:8:1$0uwJYK1igFzKhNmC$84a89046f4b579820d4674bdacf4ee5dcc03df984b05ca66dbf245061b42f5093a30aff835d3e881fb9ac1edca9fbb14f2653f91e41fcd8531dc2f0af528c70c	student
1573	22001103	roshantigga.22@stvincentngp.edu.in	scrypt:32768:8:1$V2jEFLkCD54OCM0k$42c91733180990f601d670509baf04976c7804725882576e3f1a6ab3e5061b4ed1fc14c30a44d1f86f1eb12fd36c08bb518deb19dbe8f2e9d6d4655461a5962f	student
1574	22001104	alvisvarghese.22@stvincentngp.edu.in	scrypt:32768:8:1$ZX6g3mMa4wxAGohg$1bf24d16e3e065a7bb99d73fe57c56195a026cadc825b9532202c423b28221c6cc020d90585938337f1de6f79c22b68a571ad38d031e1509ba56f1fa4ce78fe4	student
1575	22001105	alwynpaul.22@stvincentngp.edu.in	scrypt:32768:8:1$hPMqZSH0d9DdGlA8$bdca5f09fe3f33f08f120fba2354d162fd1eb0de2ddbabfec6ba04fbc6335969613176b80914f0c8c5d7d691e75adefdba171d46891964b07d11ee7875b80fc7	student
1577	22001110	aayushiasole.22@stvincentngp.edu.in	scrypt:32768:8:1$0VV6ALLAOtEoOrDh$38309bf557608e78e3b71fcb3d06b83df975e097acf9f8c47d775b7d4727d5ae88b2517c90d82a60dcdd57f5002c794cc1a07bea058608584123f04c54ca3581	student
1578	22001113	tejasirinait.22@stvincentngp.edu.in	scrypt:32768:8:1$6qqlOfaUpdi8Yh9e$35e26e5db407d2af2cebc712e38d91fbdde4d283b001a9255834cff744757c902000aba2ab4caa2f668b3ad39a72e04314cb30e45a9b6ccd896a78451af3f8c2	student
1579	22001115	meetshivhare.22@stvincentngp.edu.in	scrypt:32768:8:1$bktYaH7lgV59YOVH$9075668f42bfe4d6266d5a79149b874b1328782949abd7e6c852ba41d0e1925137dec01f67bf0c78ee618ba98df437bf7812bb3a257c4024cbba1d0d9efddc5e	student
1581	22001121	ishikabhalla.22@stvincentngp.edu.in	scrypt:32768:8:1$cHXgI2xsNR2tLruQ$59d1414b4d5cb1baf315239600589715daa91d5146710f974bb2f3696118dadfec852f2e5bcf844d3ab3ccf21b84ce08fde090e773349ecc1b28a576d1613b8c	student
1582	22001122	rajastarapure.22@stvincentngp.edu.in	scrypt:32768:8:1$lLrVrMjvh0JB8M8O$d162265a2e85b8840bda870ca134ed7ce2330999450899e4f7119decf498c06de5d6ad8a77aad39e7c1aec9bf547acaa310dc0287525a27414fd58c6a6615615	student
1583	22001123	sohamrothe.22@stvincentngp.edu.in	scrypt:32768:8:1$4Btatj5IILbUE8jd$a008b84eb302178536a7f9fd10e1f3d2e4672a66509d9103c14f526bfe3fc507669394191f50b68228e1d4f12bd1582af6b2dc7f2be19b25f57832b61077d6bf	student
1584	22001124	sarthakthote.22@stvincentngp.edu.in	scrypt:32768:8:1$iOGVjOs7X5l3UIkP$afb02af484b643409b05d9a191ed02280cc500d1ff1f00ab656ee4de27c290c3022d9b0ec860da4303d36ea97824ca018d5c12735252f3f9fa0a0b920a103665	student
1585	22001125	sanikapatil.22@stvincentngp.edu.in	scrypt:32768:8:1$8X5FUjdIYrPXTJnS$3c1ba27ff82e60bd94eb0b672310fbc7badc74f7e3deed5b02a8e20e3a21c98feef34b49954df6b0720ecd7c23c08d1c435ed362bdb437c3f3195b3d53ff3733	student
1586	22001129	tanvijunghare.22@stvincentngp.edu.in	scrypt:32768:8:1$my2w8iS7XCHJWkXJ$ff6b162b27507da2771f3bc826f309f243c5e14ee55df3b53d231d0c4bdd3e7deb3937c2bde970abc084597173c78c0eb668cff0bd472681ff8698894a812434	student
1588	22001137	jatinmeenia.22@stvincentngp.edu.in	scrypt:32768:8:1$aqP2oNMFDSceXLAD$53a18245cdfe7bc7be951741392c5aebf9d5d0ba32e40e1603db720a20b4df216c64999e80db30db017205786a3a414ae0d704c5f393ca66eeb1f96d2f5eaf42	student
1591	23101003	vaibhavvaidya.23d@stvincentngp.edu.in	scrypt:32768:8:1$1F3QREXXmrJEBtHj$825033e0d296eae94908fe72d9a61cae1ba8a557968844b6b5d2fa9d295b8afcf993fcfe1160b2bf7ccb7c5420cd44e55d7e1ec4829321bb19de4e1ab06b3164	student
1565	22001082	udaybhoyar.22@stvincentngp.edu.in	scrypt:32768:8:1$5jWQTBQd33TjyNvh$dd5c2027e0e1abed4d3dfc3a0a1dda551d44eef64e80f45d9a4f0420148c93f1cac50c2bd9ee5566b55629c3799a7eedb58b62614eee8b9605d0867b33887471	student
1566	22001084	adityaganvir.22@stvincentngp.edu.in	scrypt:32768:8:1$G7C2OaBu3QAg0YZI$ff25c45fa0ee841a26f15b8550540353951611669866636ac6aa6b14d11aefd92d78d6a73eb8f2559aaaef0b7a3db4fb4e9aef5d9cefcf3ffb104b23bbea9552	student
1572	22001099	mersajoy.22@stvincentngp.edu.in	scrypt:32768:8:1$Z7DXCJoYJ65AYUnr$23f037429f12c09119b589bf553dbc7c7e99d6002a7467be9d228a2ee0608e1bf50d6154abe1383cd25e58356a6c388108340e5c9891482abe9b0308954a7ef3	student
1580	22001119	nikhithasanto.22@stvincentngp.edu.in	scrypt:32768:8:1$qb4vB3z9wzaNDXSb$96d7b350f65361f2fb84fcc57d8c4612baee9269b26d6df0c7a4b8166249e50d719833283edd5bbf0d6d229eba6d69ba2d7d8ec321a9eebf9b4f204ad874cced	student
1576	22001106	edwinjoseph.22@stvincentngp.edu.in	scrypt:32768:8:1$k82q3YDllnR7klHY$4c02495718671adf05c96a4f944829e344ecad53b78324874f96298a94d4111cd8b971b02355231e82987eae883ce7e0eaf34cc44f4fe70fb53b5d5288792cd2	student
1589	22017013	sharwariraut.22@stvincentngp.edu.in	scrypt:32768:8:1$rNyTCPwpAFsDXGaj$996d7b4ca892620d57dab6c7b0402767bf93118534ed73336cd6f032aa59a14318eea799506e3995f5920308e7190acef12943a266bfc507de615d44ccf323f5	student
1592	23101005	nishantwankhede.23d@stvincentngp.edu.in	scrypt:32768:8:1$dl4FknbJNVAlEhMr$7d3f7fa94094d30e9b5909e5c61212186a5446a2d912cff67a951ad61b6bf6efc7d40d798bc851b0200a378c60786ad80d9a6f456761ec139caccb19b7964969	student
1590	23101002	uttarabalpande.23d@stvincentngp.edu.in	scrypt:32768:8:1$SmzD19uZ9N71pm6h$1982b50f040b079b60e9d1b752deb927b2adf899105954406c2e8b73031e01073cc4e303b6ff1aa4c01a68a1763db2eb834d36da08a9fcb5503fc5d2cecec7ca	student
1587	22001132	shubhamdhabu.22@stvincentngp.edu.in	scrypt:32768:8:1$jwuCG6f7Mmu4GUpk$bedb9e8158b76e80f625bc60ce32631ab617a15886a197431cbfac3ebd5da6b7b924d455403c48d1a785e9ae46a1dfd66f32aed44b9fffa8fc0e40ba5929f51e	student
1568	22001086	sujaldange.22@stvincentngp.edu.in	scrypt:32768:8:1$Yfb8NOWMMCk3KaU3$2276e71073406dff16b56a3f50be4912c7b633939979647c281c8f428c684fe6ff54eccdc86f0188ac056f240f80ec1829012efbc40267c0bbf694e5320a49f9	student
1563	22001078	sumitprasad.22@stvincentngp.edu.in	scrypt:32768:8:1$lZulicVdHGwLgO4X$57e7243e7e30658a3a1f351d7c04561500c85cca870d8725e985cdb0caa1b60fcc7b5fe9e56db18515f4951cdd0ea7be67702b25db8f9034b1eede3511288172	student
1596	21001126	sahilbante.21@stvincentngp.edu.in	scrypt:32768:8:1$VVDsLytJlQNv7uFx$5baff3bc25b6a143c3f8a8c828cb27bd01d35787ba2c43321b78fd0332c7d47a3e568f00011d7651535461d2cff7d41ca983f58b331640f193c87f2305fc4b9b	student
1598	21001042	SAIDENSEQUEIRA.21@stvincentngp.edu.in	scrypt:32768:8:1$pKnLMyXGEnM4b5Xv$006db7f8200f67ab061b6d03475298db82cb8819955ad3f90a6b66afb24c0e2e06543ad75c4d15a09a6eaf6400cc299358aae6af237acde0d0bc327a27bf2d4d	student
1599	21001117	aryanhumne.21@stvincentngp.edu.in	scrypt:32768:8:1$1dF3GRNHJByMW40M$010abfb5ca5c42ae7a69f422bd18b20e0f5b7cfd94a3b0e02e92b1a8eb57ffef070830542464c7c23ab21430ded69f1f96a657ac5f37dafbc094e32d8bd013ab	student
1402	22001003	manasvigiradkar.22@stvincentngp.edu.in	scrypt:32768:8:1$VKqPWidMfMBr7B83$843e083e13f8ef6df5e4a38f00f586e70553174bcab083f8f7557f8365a4885d73292316c5602c0d6e0cf3a63f5780917a81320c0b8382a9572500159efdc84f	student
1594	23101009	piyushkhati.23d@stvincentngp.edu.in	scrypt:32768:8:1$jvrsB2aOnPsLK8pn$3ed4257d7d1d9c01fde5e08e7d7fa75300c7c4d0948fc80c1d326da65da21d84813ce3d000f135de6c578af05a20c0d9c167919ed2861db1cf540a8598221fcf	student
1616	23001124	\N	scrypt:32768:8:1$RLx1Cm9xVP51SEKs$fe25dc83879f418c1849720a7b1f72e6750aceb8666b9a61b1055f4cc8ffc300ef397dbdd8fa6c1aef747798341368a2602901663d62a024c6b4e76e6ae38c15	student
1622	22001072	\N	scrypt:32768:8:1$9LwkPFIHq1Y9xUEB$d35a09acfc9c819db8196a421cfeb715ed24e498bd722078259a54dacba4a35dd307a183d119d42febce874b04c4d07cd8f92aa52f84531c6807880717b6f156	student
1595	22101005	maitreyadalal.22d@stvincentngp.edu.in	scrypt:32768:8:1$AdzFVPDSpngCPysQ$2c5c0a2f6fb8cc2000e666a15847e4b158522009ea49b7b774c7d46ede5694e26f3ab5bd2c613dd597d8e315fe352535273a2d5b1bb4135b3dfbca7f20e205be	student
1597	21001023	salonisable.21@stvincentngp.edu.in	scrypt:32768:8:1$kDqYaU62rl3eKkYu$0574688b23c84354f9dcccf09bb15fecf6e624d81f85d45ce4e6cfd3520817dc89d6903542c1d4c918e293f50d4c1ca7b20a95753cad609007e18c26f88509cb	student
1593	23101007	chinmayeechandurwar.23d@stvincentngp.edu.in	scrypt:32768:8:1$gTN1PSHgtLeUUbs5$dfbccdbc724f723b99cac5dc215296886d34d024f571436fadc55a1fa3375868d570a72abd363d474fccf10d0727169c9b74b26296bc85df32f1cbde48f9c5a4	student
1623	dgupta@stvincentngp.edu.in	dgupta@stvincentngp.edu.in	scrypt:32768:8:1$wb4oI9CD7FBtSkis$742e7bd5f84556edc5e960cc2f4421626d0dcd27a4e5c99d5f64e2999451283715b0803b2d39436f25e5a525e8ac54a476643d932f135fdbd4ba5572b4a4fddb	faculty
1624	mchole@stvincentngp.edu.in	mchole@stvincentngp.edu.in	scrypt:32768:8:1$n9vIiMEmxg3xLfaF$86154f0d5bdfd7348c2c9d8d2f57c94a41f1fdd45f7ce7d9330c188540f2698bfc8d755a43c990e89666a57bb2c7eb138437a72d334027c39df50a6907f0fb5e	faculty
1625	vdeshpande@stvincentngp.edu.in	vdeshpande@stvincentngp.edu.in	scrypt:32768:8:1$V6Jlnrmnp0VZ6bFh$0ff90549f88124494b69ddf52df434edf9111fbe5cee4adc6e2f53d313766bef36bfc955d8df08ca409541f7900f3e0704855c9af33e185b84d8e72d6b534f2f	faculty
1604	rkotkondawar@stvincentngp.edu.in	rkotkondawar@stvincentngp.edu.in	scrypt:32768:8:1$aWFcs1OZA2tCRZ3b$4eb23445e22d4b166f220c1b4937e091c0dee82c4bee3971c5f63d063dc5f592f4b24c39e1ed44b4b4a38019d2c52d4caaf0548bfc0953eb5e1cafbfb033f28a	faculty
1605	ynikhare@stvincentngp.edu.in	ynikhare@stvincentngp.edu.in	scrypt:32768:8:1$mY58xeYmfcl1QFF5$91b721e7759bbae42d4fa9224d47128bc2b51b8967ea5cd0cdd4e08e7aa33982fc64e52cc441b7c260b22ff382ea31108849bf86c7c55fa9c366113784baddef	faculty
1608	nkorde@stvincentngp.edu.in	nkorde@stvincentngp.edu.in	scrypt:32768:8:1$qnkLdQ2LwJNngDMi$b78250ff489812ca7294b832d04c6d3dd387b891be2908b4edccfa8fd0e6b80e2e311127f52b0a3791691cf93ed4dca81e33fc5fd25c83758431520566a10ddc	faculty
1571	22001096	mruduldehankar.22@stvincentngp.edu.in	scrypt:32768:8:1$FXixOdy2w5esAF8s$7898f8d8e1ba2f21b8c352b11bcc4ab7b699af328622e224ae038a19e597d93c6884403c4c702bb7a84aa9d82aaa95593b258f4b6e911c735b82c1c0154e9805	student
1534	22001007	dishantkewat.22@stvincentngp.edu.in	scrypt:32768:8:1$L0qqUw0n5POyW1Ea$25fade106a1e5fdc01ccd78cdce59f81bbe5dec2724b86ef294cf2d80ceecac4289600c2f002fe6207f2634b3482f7ce7365d63e8f3ffe75723e638225ce4840	student
1626	sdhage@stvincentngp.edu.in	sdhage@stvincentngp.edu.in	scrypt:32768:8:1$5k2wLWNaZYWNOwx9$9520acdbec75a2976409b74b632276fba2ed119950d2fa9f93a74c65f63fa02925d53c4fbf0680b5274e9f34631c9336611d62d8b884c125ed48944ecd47d17d	faculty
1627	kgawande@stvincentngp.edu.in	kgawande@stvincentngp.edu.in	scrypt:32768:8:1$Mc0ov0oTec3XFO98$10f92e91e173f1bee05c857d90d9752631556d7f8cc3da99f8dba8579c58dae3267eea73faead36c7e92d13b2fa338b172db33d342afc9c9a7695d3769937b0a	faculty
1629	mbramhe@stvincentngp.edu.in	mbramhe@stvincentngp.edu.in	scrypt:32768:8:1$Fz1jKYN9JBR1n8Wr$7e7aa1129d56df2d0ebbb663de743e3fa0fd0ea98c2e76a395902e7c6770669110f8fdd1088905f74b5b49024caee565146413ca873845181482599e7bb3b2a4	faculty
1630	dwajgi@stvincentngp.edu.in	dwajgi@stvincentngp.edu.in	scrypt:32768:8:1$9PKdHnxe2hlCW834$4cbdbd2b507c2bc72ff721fbf73047c08a557862754e40f050aa8133ff663543cd4e3eb165cc1585d36548ba1bc345142255303ddb6c5ebdcfe0a22a765d3d23	faculty
1609	pwankhede@stvincentngp.edu.in	pwankhede@stvincentngp.edu.in	scrypt:32768:8:1$j1G4VbRJ564CiM2k$330106a4b1fad886737fdfb3bfcb8a0e5668a53fd2aae197ad28a98418fe996308214db58f31edfab00ce552030b7a6d58f0f0708902c21eb38319abc4691696	faculty
1613	ygolhar@stvincentngp.edu.in	ygolhar@stvincentngp.edu.in	scrypt:32768:8:1$NZ2uPAzYIpSdywPb$38e39a0eba6ea8c543a4a35398619e1c32c0df39de53884a8689462ed423fe4533684c73507d745fb1969d113280297ffbf8b7bdc7d421477b2a642ddb5a0617	faculty
1603	pritibhagat@stvincentngp.edu.in	pritibhagat@stvincentngp.edu.in	scrypt:32768:8:1$iU6i6ZAVWG4k1gdE$dad886ad009cc598961b1d2c05678c857afcf926d1189012e872e46e383554bd513eb93a592201c0e70ee45568ed18015608e14555df1a068d2a2903c05d7e1e	faculty
1601	rroychaudhary@stvincentngp.edu.in	rroychaudhary@stvincentngp.edu.in	scrypt:32768:8:1$ZSGKmXcigRPLAQpV$a81545f99ab9124cff9ba15ec6cddd080d9e57ca65dc6ce98d3f3d4ac90658e1e8b55235692cb63ca6e3ef31c5a1cae937a87a8b2cc659d007c2b034fe60a2b3	faculty
1612	kjaisinghani@stvincentngp.edu.in	kjaisinghani@stvincentngp.edu.in	scrypt:32768:8:1$0Xam5N0SVNuEGHyQ$378d019489a39d577e56566c6a4b46ae477e7b6ca9b571351f790303033221f59fcb1e42cc12d0187820db5d64ca9d8de8db7674ecf018771e9d7a48055f92de	faculty
1614	swanjari@stvincentngp.edu.in	swanjari@stvincentngp.edu.in	scrypt:32768:8:1$NTjS8Z9Xb3Iqqbqk$5a5b506a8e37830f4de351d0083cce81f08ef2488cf7259ff88b55f1a64e4f06b3fe569dcf937baa242f3c02a3f8967124953870006ec8cfd138cb932bd6abdf	faculty
1611	owadhwani@stvincentngp.edu.in	owadhwani@stvincentngp.edu.in	scrypt:32768:8:1$zJWbUc0KOPZMgBbE$a825837ce3d1f462327416af95900ab97c23aff9e47cf291993405b6f839ce9b940580f92a6494da0da4cfb98d431310ce721c09752997b8739f32d6e49d6e85	faculty
1632	apathak@stvincentngp.edu.in	apathak@stvincentngp.edu.in	scrypt:32768:8:1$YYiByf5Qs4eXLbtQ$372a278d760aeb8ecf9aec95b8d2df78a2ca8739aebc86ceafb87f42a98e397ab8dc4169eb7972855283db9d1793fd09d0fc7a8d4a119c0ebb667685914f0c62	faculty
1633	mgudadhe@stvincentngp.edu.in	mgudadhe@stvincentngp.edu.in	scrypt:32768:8:1$nSHuaI4SFGSxJE4Y$387029e012e2dab171598ca8512d09211e368a9355134708cd0094b6eb3eaaeb888e0c1b6372c2818a399e951bccde65d499398a3dd8a81858b5cd6cddf4504d	faculty
1606	asheikh@stvincentngp.edu.in	asheikh@stvincentngp.edu.in	scrypt:32768:8:1$XUaNG2BWzASxHmCc$ce68a9cd3be0b701ab15c97455845cc8e72dde2490a78cb29a6c35a2e6b6b24c1aef32cd6e0dbe17ce4d3f1fed99992ebe0abaa511745fd15fc19cf83c01d34c	faculty
1607	kgupta@stvincentngp.edu.in	kgupta@stvincentngp.edu.in	scrypt:32768:8:1$9jJFXt0iQNxFp59E$9d9b1b0ca9bc2dce290de9fa416d775f8882a9decfb29ff6bd98b814a020a6520716f186ad013c62e2d3eaed8af78702c5ca479e7fb94f266c9a48ffe5899052	faculty
417	23001095	kaushikshahu.23@stvincentngp.edu.in	scrypt:32768:8:1$270fz1kjrcdfcUaF$a88c9b643a0e4fd193a214a8df8fab09075b1c25b59fba8618bef016a7638bc7275f43317ab010201d055ca57bb64db82d79e4ddf2c108a9b02135bdd0b154b2	student
1615	ayazkhan@stvincentngp.edu.in	ayazkhan@stvincentngp.edu.in	scrypt:32768:8:1$EQlQtFOsns1ejJrA$3ab86ed5e36841a1c0fe22632601ac794ccfe546f8fe1a3f2f65df62578ae6000129149ae24031966da8952ad7bad0f44cf5d0da4a28fbf515e3a417f5cd86a3	faculty
1063	23001066	himanshumire.23@stvincentngp.edu.in	scrypt:32768:8:1$rLcrA234gnP05ZBm$1ff2e3c01dd6f295f5dd9b5f64cb4a773a580c22b9e68eb3a09e60dfb54607c6ff575b5e2e51603e657c51522c1920f95c23985b88e0daaf065f671a46aa549d	student
1679	phase3_1771481271712_2289@example.com	\N	$2b$10$BxkuBomcs73sRSVGFJg6keMlINi2rUIcA8.jyCIGuhoQgrOeFl5o2	student
1610	kmeshram@stvincentngp.edu.in	kmeshram@stvincentngp.edu.in	$2b$10$qV6CHw87PsFYacJw3uA5J.af13mlqMOJGpK1nEUlXA1YIqK.rZdge	faculty
\.


--
-- Name: CareerObjective_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CareerObjective_id_seq"', 1, false);


--
-- Name: CoCurricularOrganization_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CoCurricularOrganization_id_seq"', 1, false);


--
-- Name: CoCurricularParticipation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CoCurricularParticipation_id_seq"', 1, false);


--
-- Name: Faculty_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Faculty_id_seq"', 1, false);


--
-- Name: Internship_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Internship_id_seq"', 1, false);


--
-- Name: MentoringMinute_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."MentoringMinute_id_seq"', 1, false);


--
-- Name: PastEducation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PastEducation_id_seq"', 1, false);


--
-- Name: PostAdmissionAcademicRecord_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PostAdmissionAcademicRecord_id_seq"', 1, false);


--
-- Name: Project_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Project_id_seq"', 1, false);


--
-- Name: SWOC_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."SWOC_id_seq"', 1, false);


--
-- Name: Skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Skills_id_seq"', 1, false);


--
-- Name: StudentPersonalInfo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."StudentPersonalInfo_id_seq"', 1, false);


--
-- Name: Student_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Student_id_seq"', 1, false);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, false);


--
-- Name: career_activity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.career_activity_id_seq', 536, true);


--
-- Name: career_dev_activity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.career_dev_activity_id_seq', 1, false);


--
-- Name: career_objective_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.career_objective_id_seq', 407, true);


--
-- Name: co_curricular_organization_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.co_curricular_organization_id_seq', 688, true);


--
-- Name: co_curricular_participation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.co_curricular_participation_id_seq', 703, true);


--
-- Name: faculty_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.faculty_id_seq', 87, true);


--
-- Name: internship_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.internship_id_seq', 496, true);


--
-- Name: mentoring_minute_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mentoring_minute_id_seq', 117, true);


--
-- Name: password_reset_token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.password_reset_token_id_seq', 82, true);


--
-- Name: past_education_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.past_education_id_seq', 3102, true);


--
-- Name: post_admission_academic_record_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.post_admission_academic_record_id_seq', 5811, true);


--
-- Name: project_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.project_id_seq', 1137, true);


--
-- Name: skill_program_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.skill_program_id_seq', 1, false);


--
-- Name: skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.skills_id_seq', 407, true);


--
-- Name: student_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.student_id_seq', 1685, true);


--
-- Name: student_personal_info_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.student_personal_info_id_seq', 830, true);


--
-- Name: swoc_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.swoc_id_seq', 407, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 1909, true);


--
-- Name: CareerObjective CareerObjective_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CareerObjective"
    ADD CONSTRAINT "CareerObjective_pkey" PRIMARY KEY (id);


--
-- Name: CareerObjective CareerObjective_student_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CareerObjective"
    ADD CONSTRAINT "CareerObjective_student_id_key" UNIQUE (student_id);


--
-- Name: CoCurricularOrganization CoCurricularOrganization_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CoCurricularOrganization"
    ADD CONSTRAINT "CoCurricularOrganization_pkey" PRIMARY KEY (id);


--
-- Name: CoCurricularParticipation CoCurricularParticipation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CoCurricularParticipation"
    ADD CONSTRAINT "CoCurricularParticipation_pkey" PRIMARY KEY (id);


--
-- Name: Faculty Faculty_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Faculty"
    ADD CONSTRAINT "Faculty_email_key" UNIQUE (email);


--
-- Name: Faculty Faculty_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Faculty"
    ADD CONSTRAINT "Faculty_pkey" PRIMARY KEY (id);


--
-- Name: Faculty Faculty_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Faculty"
    ADD CONSTRAINT "Faculty_user_id_key" UNIQUE (user_id);


--
-- Name: Internship Internship_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Internship"
    ADD CONSTRAINT "Internship_pkey" PRIMARY KEY (id);


--
-- Name: MentoringMinute MentoringMinute_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MentoringMinute"
    ADD CONSTRAINT "MentoringMinute_pkey" PRIMARY KEY (id);


--
-- Name: PastEducation PastEducation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PastEducation"
    ADD CONSTRAINT "PastEducation_pkey" PRIMARY KEY (id);


--
-- Name: PostAdmissionAcademicRecord PostAdmissionAcademicRecord_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PostAdmissionAcademicRecord"
    ADD CONSTRAINT "PostAdmissionAcademicRecord_pkey" PRIMARY KEY (id);


--
-- Name: Project Project_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_pkey" PRIMARY KEY (id);


--
-- Name: SWOC SWOC_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SWOC"
    ADD CONSTRAINT "SWOC_pkey" PRIMARY KEY (id);


--
-- Name: SWOC SWOC_student_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SWOC"
    ADD CONSTRAINT "SWOC_student_id_key" UNIQUE (student_id);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: Skills Skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Skills"
    ADD CONSTRAINT "Skills_pkey" PRIMARY KEY (id);


--
-- Name: Skills Skills_student_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Skills"
    ADD CONSTRAINT "Skills_student_id_key" UNIQUE (student_id);


--
-- Name: StudentPersonalInfo StudentPersonalInfo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudentPersonalInfo"
    ADD CONSTRAINT "StudentPersonalInfo_pkey" PRIMARY KEY (id);


--
-- Name: StudentPersonalInfo StudentPersonalInfo_student_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudentPersonalInfo"
    ADD CONSTRAINT "StudentPersonalInfo_student_id_key" UNIQUE (student_id);


--
-- Name: Student Student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_pkey" PRIMARY KEY (id);


--
-- Name: Student Student_uid_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_uid_key" UNIQUE (uid);


--
-- Name: Student Student_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_user_id_key" UNIQUE (user_id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: User User_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_username_key" UNIQUE (username);


--
-- Name: career_activity career_activity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.career_activity
    ADD CONSTRAINT career_activity_pkey PRIMARY KEY (id);


--
-- Name: career_dev_activity career_dev_activity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.career_dev_activity
    ADD CONSTRAINT career_dev_activity_pkey PRIMARY KEY (id);


--
-- Name: career_objective career_objective_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.career_objective
    ADD CONSTRAINT career_objective_pkey PRIMARY KEY (id);


--
-- Name: co_curricular_organization co_curricular_organization_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.co_curricular_organization
    ADD CONSTRAINT co_curricular_organization_pkey PRIMARY KEY (id);


--
-- Name: co_curricular_participation co_curricular_participation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.co_curricular_participation
    ADD CONSTRAINT co_curricular_participation_pkey PRIMARY KEY (id);


--
-- Name: faculty faculty_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT faculty_email_key UNIQUE (email);


--
-- Name: faculty faculty_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT faculty_pkey PRIMARY KEY (id);


--
-- Name: internship internship_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.internship
    ADD CONSTRAINT internship_pkey PRIMARY KEY (id);


--
-- Name: mentoring_minute mentoring_minute_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mentoring_minute
    ADD CONSTRAINT mentoring_minute_pkey PRIMARY KEY (id);


--
-- Name: password_reset_token password_reset_token_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_token
    ADD CONSTRAINT password_reset_token_pkey PRIMARY KEY (id);


--
-- Name: password_reset_token password_reset_token_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_token
    ADD CONSTRAINT password_reset_token_token_key UNIQUE (token);


--
-- Name: past_education past_education_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.past_education
    ADD CONSTRAINT past_education_pkey PRIMARY KEY (id);


--
-- Name: post_admission_academic_record post_admission_academic_record_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_admission_academic_record
    ADD CONSTRAINT post_admission_academic_record_pkey PRIMARY KEY (id);


--
-- Name: project project_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_pkey PRIMARY KEY (id);


--
-- Name: skill_program skill_program_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skill_program
    ADD CONSTRAINT skill_program_pkey PRIMARY KEY (id);


--
-- Name: skills skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (id);


--
-- Name: skills skills_student_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_student_id_key UNIQUE (student_id);


--
-- Name: student_personal_info student_personal_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_personal_info
    ADD CONSTRAINT student_personal_info_pkey PRIMARY KEY (id);


--
-- Name: student_personal_info student_personal_info_student_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_personal_info
    ADD CONSTRAINT student_personal_info_student_id_key UNIQUE (student_id);


--
-- Name: student student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pkey PRIMARY KEY (id);


--
-- Name: student student_uid_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_uid_key UNIQUE (uid);


--
-- Name: swoc swoc_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swoc
    ADD CONSTRAINT swoc_pkey PRIMARY KEY (id);


--
-- Name: swoc swoc_student_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swoc
    ADD CONSTRAINT swoc_student_id_key UNIQUE (student_id);


--
-- Name: user user_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: user user_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_username_key UNIQUE (username);


--
-- Name: idx_career_dev_activity_student_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_career_dev_activity_student_id ON public.career_dev_activity USING btree (student_id);


--
-- Name: idx_faculty_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_faculty_user_id ON public.faculty USING btree (user_id);


--
-- Name: idx_mentoring_minute_faculty_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_mentoring_minute_faculty_id ON public.mentoring_minute USING btree (faculty_id);


--
-- Name: idx_mentoring_minute_student_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_mentoring_minute_student_date ON public.mentoring_minute USING btree (student_id, date);


--
-- Name: idx_mentoring_minutes_student_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_mentoring_minutes_student_date ON public."MentoringMinute" USING btree (student_id, date);


--
-- Name: idx_student_mentor_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_student_mentor_id ON public.student USING btree (mentor_id) WHERE (mentor_id IS NOT NULL);


--
-- Name: idx_student_semester_section; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_student_semester_section ON public.student USING btree (semester, section);


--
-- Name: idx_student_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_student_user_id ON public.student USING btree (user_id);


--
-- Name: idx_student_year_of_admission; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_student_year_of_admission ON public.student USING btree (year_of_admission);


--
-- Name: idx_students_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_students_id ON public."Student" USING btree (id);


--
-- Name: idx_students_mentor_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_students_mentor_id ON public."Student" USING btree (mentor_id);


--
-- Name: idx_user_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_role ON public."user" USING btree (role);


--
-- Name: idx_user_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_username ON public."user" USING btree (username);


--
-- Name: CareerObjective CareerObjective_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CareerObjective"
    ADD CONSTRAINT "CareerObjective_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CoCurricularOrganization CoCurricularOrganization_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CoCurricularOrganization"
    ADD CONSTRAINT "CoCurricularOrganization_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CoCurricularParticipation CoCurricularParticipation_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CoCurricularParticipation"
    ADD CONSTRAINT "CoCurricularParticipation_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Faculty Faculty_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Faculty"
    ADD CONSTRAINT "Faculty_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Internship Internship_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Internship"
    ADD CONSTRAINT "Internship_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MentoringMinute MentoringMinute_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MentoringMinute"
    ADD CONSTRAINT "MentoringMinute_faculty_id_fkey" FOREIGN KEY (faculty_id) REFERENCES public."Faculty"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MentoringMinute MentoringMinute_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MentoringMinute"
    ADD CONSTRAINT "MentoringMinute_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PastEducation PastEducation_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PastEducation"
    ADD CONSTRAINT "PastEducation_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PostAdmissionAcademicRecord PostAdmissionAcademicRecord_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PostAdmissionAcademicRecord"
    ADD CONSTRAINT "PostAdmissionAcademicRecord_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Project Project_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SWOC SWOC_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SWOC"
    ADD CONSTRAINT "SWOC_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Skills Skills_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Skills"
    ADD CONSTRAINT "Skills_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentPersonalInfo StudentPersonalInfo_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudentPersonalInfo"
    ADD CONSTRAINT "StudentPersonalInfo_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Student Student_mentor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_mentor_id_fkey" FOREIGN KEY (mentor_id) REFERENCES public."Faculty"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Student Student_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: career_activity career_activity_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.career_activity
    ADD CONSTRAINT career_activity_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- Name: career_dev_activity career_dev_activity_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.career_dev_activity
    ADD CONSTRAINT career_dev_activity_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: career_objective career_objective_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.career_objective
    ADD CONSTRAINT career_objective_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- Name: co_curricular_organization co_curricular_organization_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.co_curricular_organization
    ADD CONSTRAINT co_curricular_organization_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- Name: co_curricular_participation co_curricular_participation_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.co_curricular_participation
    ADD CONSTRAINT co_curricular_participation_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- Name: faculty faculty_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT faculty_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: internship internship_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.internship
    ADD CONSTRAINT internship_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- Name: mentoring_minute mentoring_minute_faculty_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mentoring_minute
    ADD CONSTRAINT mentoring_minute_faculty_id_fkey1 FOREIGN KEY (faculty_id) REFERENCES public.faculty(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: mentoring_minute mentoring_minute_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mentoring_minute
    ADD CONSTRAINT mentoring_minute_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- Name: password_reset_token password_reset_token_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_token
    ADD CONSTRAINT password_reset_token_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: past_education past_education_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.past_education
    ADD CONSTRAINT past_education_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- Name: post_admission_academic_record post_admission_academic_record_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_admission_academic_record
    ADD CONSTRAINT post_admission_academic_record_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- Name: project project_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- Name: skill_program skill_program_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skill_program
    ADD CONSTRAINT skill_program_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: skills skills_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- Name: student student_mentor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_mentor_id_fkey FOREIGN KEY (mentor_id) REFERENCES public.faculty(id);


--
-- Name: student_personal_info student_personal_info_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_personal_info
    ADD CONSTRAINT student_personal_info_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- Name: student student_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: swoc swoc_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swoc
    ADD CONSTRAINT swoc_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict xfNf5YQqRQ1h3EJxxGeo9LLKhbqYBDJEgkmSNkICbepXbkaQWFc6yzZYicXGNli

