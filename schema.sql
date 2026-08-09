--
-- PostgreSQL database dump
--

\restrict dS9irfhcd16HwqEtfK0u7H5Yb92cLoQ2PmVMRzQWPwSsdIUw33IkihWTN9tZnIX

-- Dumped from database version 18.4 (Homebrew)
-- Dumped by pg_dump version 18.4

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
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: himanshumire
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO himanshumire;

--
-- Name: career_activity; Type: TABLE; Schema: public; Owner: himanshumire
--

CREATE TABLE public.career_activity (
    id integer NOT NULL,
    student_id integer NOT NULL,
    activity_name character varying(255) NOT NULL,
    score_rank character varying(50) NOT NULL,
    exam_date date
);


ALTER TABLE public.career_activity OWNER TO himanshumire;

--
-- Name: career_activity_id_seq; Type: SEQUENCE; Schema: public; Owner: himanshumire
--

CREATE SEQUENCE public.career_activity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.career_activity_id_seq OWNER TO himanshumire;

--
-- Name: career_activity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: himanshumire
--

ALTER SEQUENCE public.career_activity_id_seq OWNED BY public.career_activity.id;


--
-- Name: career_objective; Type: TABLE; Schema: public; Owner: himanshumire
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
    expectations_from_institute text
);


ALTER TABLE public.career_objective OWNER TO himanshumire;

--
-- Name: career_objective_id_seq; Type: SEQUENCE; Schema: public; Owner: himanshumire
--

CREATE SEQUENCE public.career_objective_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.career_objective_id_seq OWNER TO himanshumire;

--
-- Name: career_objective_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: himanshumire
--

ALTER SEQUENCE public.career_objective_id_seq OWNED BY public.career_objective.id;


--
-- Name: co_curricular_organization; Type: TABLE; Schema: public; Owner: himanshumire
--

CREATE TABLE public.co_curricular_organization (
    id integer NOT NULL,
    student_id integer NOT NULL,
    name text,
    date date,
    level character varying(100),
    remark text
);


ALTER TABLE public.co_curricular_organization OWNER TO himanshumire;

--
-- Name: co_curricular_organization_id_seq; Type: SEQUENCE; Schema: public; Owner: himanshumire
--

CREATE SEQUENCE public.co_curricular_organization_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.co_curricular_organization_id_seq OWNER TO himanshumire;

--
-- Name: co_curricular_organization_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: himanshumire
--

ALTER SEQUENCE public.co_curricular_organization_id_seq OWNED BY public.co_curricular_organization.id;


--
-- Name: co_curricular_participation; Type: TABLE; Schema: public; Owner: himanshumire
--

CREATE TABLE public.co_curricular_participation (
    id integer NOT NULL,
    student_id integer NOT NULL,
    name text,
    date date,
    level character varying(100),
    awards text
);


ALTER TABLE public.co_curricular_participation OWNER TO himanshumire;

--
-- Name: co_curricular_participation_id_seq; Type: SEQUENCE; Schema: public; Owner: himanshumire
--

CREATE SEQUENCE public.co_curricular_participation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.co_curricular_participation_id_seq OWNER TO himanshumire;

--
-- Name: co_curricular_participation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: himanshumire
--

ALTER SEQUENCE public.co_curricular_participation_id_seq OWNED BY public.co_curricular_participation.id;


--
-- Name: faculty; Type: TABLE; Schema: public; Owner: himanshumire
--

CREATE TABLE public.faculty (
    id integer NOT NULL,
    email character varying(120) NOT NULL,
    first_name character varying(120),
    last_name character varying(120),
    contact_number character varying(20),
    user_id integer
);


ALTER TABLE public.faculty OWNER TO himanshumire;

--
-- Name: faculty_id_seq; Type: SEQUENCE; Schema: public; Owner: himanshumire
--

CREATE SEQUENCE public.faculty_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.faculty_id_seq OWNER TO himanshumire;

--
-- Name: faculty_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: himanshumire
--

ALTER SEQUENCE public.faculty_id_seq OWNED BY public.faculty.id;


--
-- Name: internship; Type: TABLE; Schema: public; Owner: himanshumire
--

CREATE TABLE public.internship (
    id integer NOT NULL,
    student_id integer NOT NULL,
    company_name character varying(255),
    domain character varying(255),
    internship_type character varying(20),
    paid_unpaid character varying(10),
    start_date date,
    end_date date
);


ALTER TABLE public.internship OWNER TO himanshumire;

--
-- Name: internship_id_seq; Type: SEQUENCE; Schema: public; Owner: himanshumire
--

CREATE SEQUENCE public.internship_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.internship_id_seq OWNER TO himanshumire;

--
-- Name: internship_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: himanshumire
--

ALTER SEQUENCE public.internship_id_seq OWNED BY public.internship.id;


--
-- Name: mentoring_minute; Type: TABLE; Schema: public; Owner: himanshumire
--

CREATE TABLE public.mentoring_minute (
    id integer NOT NULL,
    student_id integer NOT NULL,
    faculty_id integer,
    semester integer NOT NULL,
    date date,
    remarks text,
    suggestion text,
    action text,
    faculty_name_snapshot character varying(255),
    faculty_email_snapshot character varying(255)
);


ALTER TABLE public.mentoring_minute OWNER TO himanshumire;

--
-- Name: mentoring_minute_id_seq; Type: SEQUENCE; Schema: public; Owner: himanshumire
--

CREATE SEQUENCE public.mentoring_minute_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mentoring_minute_id_seq OWNER TO himanshumire;

--
-- Name: mentoring_minute_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: himanshumire
--

ALTER SEQUENCE public.mentoring_minute_id_seq OWNED BY public.mentoring_minute.id;


--
-- Name: password_reset_token; Type: TABLE; Schema: public; Owner: himanshumire
--

CREATE TABLE public.password_reset_token (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    used boolean NOT NULL
);


ALTER TABLE public.password_reset_token OWNER TO himanshumire;

--
-- Name: password_reset_token_id_seq; Type: SEQUENCE; Schema: public; Owner: himanshumire
--

CREATE SEQUENCE public.password_reset_token_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.password_reset_token_id_seq OWNER TO himanshumire;

--
-- Name: password_reset_token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: himanshumire
--

ALTER SEQUENCE public.password_reset_token_id_seq OWNED BY public.password_reset_token.id;


--
-- Name: past_education; Type: TABLE; Schema: public; Owner: himanshumire
--

CREATE TABLE public.past_education (
    id integer NOT NULL,
    student_id integer NOT NULL,
    exam_name character varying(100) NOT NULL,
    percentage double precision NOT NULL,
    year_of_passing integer NOT NULL,
    exam_score double precision,
    exam_date date,
    exam_type character varying(50),
    board character varying(100)
);


ALTER TABLE public.past_education OWNER TO himanshumire;

--
-- Name: past_education_id_seq; Type: SEQUENCE; Schema: public; Owner: himanshumire
--

CREATE SEQUENCE public.past_education_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.past_education_id_seq OWNER TO himanshumire;

--
-- Name: past_education_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: himanshumire
--

ALTER SEQUENCE public.past_education_id_seq OWNED BY public.past_education.id;


--
-- Name: post_admission_academic_record; Type: TABLE; Schema: public; Owner: himanshumire
--

CREATE TABLE public.post_admission_academic_record (
    id integer NOT NULL,
    student_id integer NOT NULL,
    semester integer NOT NULL,
    sgpa double precision NOT NULL,
    backlog_subjects text,
    season character varying(10),
    year_of_passing integer,
    college_rank character varying(50),
    academic_awards text
);


ALTER TABLE public.post_admission_academic_record OWNER TO himanshumire;

--
-- Name: post_admission_academic_record_id_seq; Type: SEQUENCE; Schema: public; Owner: himanshumire
--

CREATE SEQUENCE public.post_admission_academic_record_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.post_admission_academic_record_id_seq OWNER TO himanshumire;

--
-- Name: post_admission_academic_record_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: himanshumire
--

ALTER SEQUENCE public.post_admission_academic_record_id_seq OWNED BY public.post_admission_academic_record.id;


--
-- Name: project; Type: TABLE; Schema: public; Owner: himanshumire
--

CREATE TABLE public.project (
    id integer NOT NULL,
    student_id integer NOT NULL,
    title text,
    description text
);


ALTER TABLE public.project OWNER TO himanshumire;

--
-- Name: project_id_seq; Type: SEQUENCE; Schema: public; Owner: himanshumire
--

CREATE SEQUENCE public.project_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_id_seq OWNER TO himanshumire;

--
-- Name: project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: himanshumire
--

ALTER SEQUENCE public.project_id_seq OWNED BY public.project.id;


--
-- Name: skill_program; Type: TABLE; Schema: public; Owner: himanshumire
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


ALTER TABLE public.skill_program OWNER TO himanshumire;

--
-- Name: skill_program_id_seq; Type: SEQUENCE; Schema: public; Owner: himanshumire
--

CREATE SEQUENCE public.skill_program_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.skill_program_id_seq OWNER TO himanshumire;

--
-- Name: skill_program_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: himanshumire
--

ALTER SEQUENCE public.skill_program_id_seq OWNED BY public.skill_program.id;


--
-- Name: skills; Type: TABLE; Schema: public; Owner: himanshumire
--

CREATE TABLE public.skills (
    id integer NOT NULL,
    student_id integer NOT NULL,
    programming_languages text,
    technologies_frameworks text,
    frontend_technologies_frameworks text,
    backend_technologies_databases text,
    domains_of_interest text,
    familiar_tools_platforms text,
    technical_soft_skills_overall text,
    additional_technical_skills text,
    additional_soft_skills text
);


ALTER TABLE public.skills OWNER TO himanshumire;

--
-- Name: skills_id_seq; Type: SEQUENCE; Schema: public; Owner: himanshumire
--

CREATE SEQUENCE public.skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.skills_id_seq OWNER TO himanshumire;

--
-- Name: skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: himanshumire
--

ALTER SEQUENCE public.skills_id_seq OWNED BY public.skills.id;


--
-- Name: student; Type: TABLE; Schema: public; Owner: himanshumire
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
    admission_type character varying(20)
);


ALTER TABLE public.student OWNER TO himanshumire;

--
-- Name: student_id_seq; Type: SEQUENCE; Schema: public; Owner: himanshumire
--

CREATE SEQUENCE public.student_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.student_id_seq OWNER TO himanshumire;

--
-- Name: student_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: himanshumire
--

ALTER SEQUENCE public.student_id_seq OWNED BY public.student.id;


--
-- Name: student_personal_info; Type: TABLE; Schema: public; Owner: himanshumire
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


ALTER TABLE public.student_personal_info OWNER TO himanshumire;

--
-- Name: student_personal_info_id_seq; Type: SEQUENCE; Schema: public; Owner: himanshumire
--

CREATE SEQUENCE public.student_personal_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.student_personal_info_id_seq OWNER TO himanshumire;

--
-- Name: student_personal_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: himanshumire
--

ALTER SEQUENCE public.student_personal_info_id_seq OWNED BY public.student_personal_info.id;


--
-- Name: swoc; Type: TABLE; Schema: public; Owner: himanshumire
--

CREATE TABLE public.swoc (
    id integer NOT NULL,
    student_id integer NOT NULL,
    strengths text,
    weaknesses text,
    opportunities text,
    challenges text
);


ALTER TABLE public.swoc OWNER TO himanshumire;

--
-- Name: swoc_id_seq; Type: SEQUENCE; Schema: public; Owner: himanshumire
--

CREATE SEQUENCE public.swoc_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.swoc_id_seq OWNER TO himanshumire;

--
-- Name: swoc_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: himanshumire
--

ALTER SEQUENCE public.swoc_id_seq OWNED BY public.swoc.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: himanshumire
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    username character varying(120) NOT NULL,
    email character varying(120),
    password_hash character varying(255) NOT NULL,
    role character varying(20) NOT NULL
);


ALTER TABLE public."user" OWNER TO himanshumire;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: himanshumire
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNER TO himanshumire;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: himanshumire
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: career_activity id; Type: DEFAULT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.career_activity ALTER COLUMN id SET DEFAULT nextval('public.career_activity_id_seq'::regclass);


--
-- Name: career_objective id; Type: DEFAULT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.career_objective ALTER COLUMN id SET DEFAULT nextval('public.career_objective_id_seq'::regclass);


--
-- Name: co_curricular_organization id; Type: DEFAULT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.co_curricular_organization ALTER COLUMN id SET DEFAULT nextval('public.co_curricular_organization_id_seq'::regclass);


--
-- Name: co_curricular_participation id; Type: DEFAULT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.co_curricular_participation ALTER COLUMN id SET DEFAULT nextval('public.co_curricular_participation_id_seq'::regclass);


--
-- Name: faculty id; Type: DEFAULT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.faculty ALTER COLUMN id SET DEFAULT nextval('public.faculty_id_seq'::regclass);


--
-- Name: internship id; Type: DEFAULT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.internship ALTER COLUMN id SET DEFAULT nextval('public.internship_id_seq'::regclass);


--
-- Name: mentoring_minute id; Type: DEFAULT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.mentoring_minute ALTER COLUMN id SET DEFAULT nextval('public.mentoring_minute_id_seq'::regclass);


--
-- Name: password_reset_token id; Type: DEFAULT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.password_reset_token ALTER COLUMN id SET DEFAULT nextval('public.password_reset_token_id_seq'::regclass);


--
-- Name: past_education id; Type: DEFAULT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.past_education ALTER COLUMN id SET DEFAULT nextval('public.past_education_id_seq'::regclass);


--
-- Name: post_admission_academic_record id; Type: DEFAULT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.post_admission_academic_record ALTER COLUMN id SET DEFAULT nextval('public.post_admission_academic_record_id_seq'::regclass);


--
-- Name: project id; Type: DEFAULT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.project ALTER COLUMN id SET DEFAULT nextval('public.project_id_seq'::regclass);


--
-- Name: skill_program id; Type: DEFAULT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.skill_program ALTER COLUMN id SET DEFAULT nextval('public.skill_program_id_seq'::regclass);


--
-- Name: skills id; Type: DEFAULT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.skills ALTER COLUMN id SET DEFAULT nextval('public.skills_id_seq'::regclass);


--
-- Name: student id; Type: DEFAULT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.student ALTER COLUMN id SET DEFAULT nextval('public.student_id_seq'::regclass);


--
-- Name: student_personal_info id; Type: DEFAULT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.student_personal_info ALTER COLUMN id SET DEFAULT nextval('public.student_personal_info_id_seq'::regclass);


--
-- Name: swoc id; Type: DEFAULT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.swoc ALTER COLUMN id SET DEFAULT nextval('public.swoc_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: career_activity career_activity_pkey; Type: CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.career_activity
    ADD CONSTRAINT career_activity_pkey PRIMARY KEY (id);


--
-- Name: career_objective career_objective_pkey; Type: CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.career_objective
    ADD CONSTRAINT career_objective_pkey PRIMARY KEY (id);


--
-- Name: co_curricular_organization co_curricular_organization_pkey; Type: CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.co_curricular_organization
    ADD CONSTRAINT co_curricular_organization_pkey PRIMARY KEY (id);


--
-- Name: co_curricular_participation co_curricular_participation_pkey; Type: CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.co_curricular_participation
    ADD CONSTRAINT co_curricular_participation_pkey PRIMARY KEY (id);


--
-- Name: faculty faculty_email_key; Type: CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT faculty_email_key UNIQUE (email);


--
-- Name: faculty faculty_pkey; Type: CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT faculty_pkey PRIMARY KEY (id);


--
-- Name: internship internship_pkey; Type: CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.internship
    ADD CONSTRAINT internship_pkey PRIMARY KEY (id);


--
-- Name: mentoring_minute mentoring_minute_pkey; Type: CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.mentoring_minute
    ADD CONSTRAINT mentoring_minute_pkey PRIMARY KEY (id);


--
-- Name: password_reset_token password_reset_token_pkey; Type: CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.password_reset_token
    ADD CONSTRAINT password_reset_token_pkey PRIMARY KEY (id);


--
-- Name: password_reset_token password_reset_token_token_key; Type: CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.password_reset_token
    ADD CONSTRAINT password_reset_token_token_key UNIQUE (token);


--
-- Name: past_education past_education_pkey; Type: CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.past_education
    ADD CONSTRAINT past_education_pkey PRIMARY KEY (id);


--
-- Name: post_admission_academic_record post_admission_academic_record_pkey; Type: CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.post_admission_academic_record
    ADD CONSTRAINT post_admission_academic_record_pkey PRIMARY KEY (id);


--
-- Name: project project_pkey; Type: CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_pkey PRIMARY KEY (id);


--
-- Name: skill_program skill_program_pkey; Type: CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.skill_program
    ADD CONSTRAINT skill_program_pkey PRIMARY KEY (id);


--
-- Name: skills skills_pkey; Type: CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (id);


--
-- Name: skills skills_student_id_key; Type: CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_student_id_key UNIQUE (student_id);


--
-- Name: student_personal_info student_personal_info_pkey; Type: CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.student_personal_info
    ADD CONSTRAINT student_personal_info_pkey PRIMARY KEY (id);


--
-- Name: student_personal_info student_personal_info_student_id_key; Type: CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.student_personal_info
    ADD CONSTRAINT student_personal_info_student_id_key UNIQUE (student_id);


--
-- Name: student student_pkey; Type: CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pkey PRIMARY KEY (id);


--
-- Name: student student_uid_key; Type: CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_uid_key UNIQUE (uid);


--
-- Name: swoc swoc_pkey; Type: CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.swoc
    ADD CONSTRAINT swoc_pkey PRIMARY KEY (id);


--
-- Name: swoc swoc_student_id_key; Type: CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.swoc
    ADD CONSTRAINT swoc_student_id_key UNIQUE (student_id);


--
-- Name: user user_email_key; Type: CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: user user_username_key; Type: CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_username_key UNIQUE (username);


--
-- Name: idx_faculty_user_id; Type: INDEX; Schema: public; Owner: himanshumire
--

CREATE UNIQUE INDEX idx_faculty_user_id ON public.faculty USING btree (user_id);


--
-- Name: idx_mentoring_minute_faculty_id; Type: INDEX; Schema: public; Owner: himanshumire
--

CREATE INDEX idx_mentoring_minute_faculty_id ON public.mentoring_minute USING btree (faculty_id);


--
-- Name: idx_mentoring_minute_student_date; Type: INDEX; Schema: public; Owner: himanshumire
--

CREATE INDEX idx_mentoring_minute_student_date ON public.mentoring_minute USING btree (student_id, date);


--
-- Name: idx_student_mentor_id; Type: INDEX; Schema: public; Owner: himanshumire
--

CREATE INDEX idx_student_mentor_id ON public.student USING btree (mentor_id) WHERE (mentor_id IS NOT NULL);


--
-- Name: idx_student_semester_section; Type: INDEX; Schema: public; Owner: himanshumire
--

CREATE INDEX idx_student_semester_section ON public.student USING btree (semester, section);


--
-- Name: idx_student_user_id; Type: INDEX; Schema: public; Owner: himanshumire
--

CREATE UNIQUE INDEX idx_student_user_id ON public.student USING btree (user_id);


--
-- Name: idx_student_year_of_admission; Type: INDEX; Schema: public; Owner: himanshumire
--

CREATE INDEX idx_student_year_of_admission ON public.student USING btree (year_of_admission);


--
-- Name: idx_user_role; Type: INDEX; Schema: public; Owner: himanshumire
--

CREATE INDEX idx_user_role ON public."user" USING btree (role);


--
-- Name: idx_user_username; Type: INDEX; Schema: public; Owner: himanshumire
--

CREATE INDEX idx_user_username ON public."user" USING btree (username);


--
-- Name: career_activity career_activity_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.career_activity
    ADD CONSTRAINT career_activity_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- Name: career_objective career_objective_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.career_objective
    ADD CONSTRAINT career_objective_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- Name: co_curricular_organization co_curricular_organization_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.co_curricular_organization
    ADD CONSTRAINT co_curricular_organization_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- Name: co_curricular_participation co_curricular_participation_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.co_curricular_participation
    ADD CONSTRAINT co_curricular_participation_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- Name: faculty faculty_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT faculty_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: internship internship_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.internship
    ADD CONSTRAINT internship_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- Name: mentoring_minute mentoring_minute_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.mentoring_minute
    ADD CONSTRAINT mentoring_minute_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- Name: password_reset_token password_reset_token_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.password_reset_token
    ADD CONSTRAINT password_reset_token_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: past_education past_education_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.past_education
    ADD CONSTRAINT past_education_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- Name: post_admission_academic_record post_admission_academic_record_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.post_admission_academic_record
    ADD CONSTRAINT post_admission_academic_record_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- Name: project project_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- Name: skill_program skill_program_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.skill_program
    ADD CONSTRAINT skill_program_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: skills skills_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- Name: student student_mentor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_mentor_id_fkey FOREIGN KEY (mentor_id) REFERENCES public.faculty(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: student_personal_info student_personal_info_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.student_personal_info
    ADD CONSTRAINT student_personal_info_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- Name: student student_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: himanshumire
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: swoc swoc_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: himanshumire
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

\unrestrict dS9irfhcd16HwqEtfK0u7H5Yb92cLoQ2PmVMRzQWPwSsdIUw33IkihWTN9tZnIX

