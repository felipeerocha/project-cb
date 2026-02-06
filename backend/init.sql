--
-- PostgreSQL database dump
--

\restrict cugEQBK0pjAEjrzfv1m99SDaZriLXdrCXYwt03Nwy2Accw50xeLyQd2F15b4Tpo

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.reservas DROP CONSTRAINT IF EXISTS reservas_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.reservas DROP CONSTRAINT IF EXISTS reservas_unidade_id_fkey;
DROP INDEX IF EXISTS public.ix_users_id;
DROP INDEX IF EXISTS public.ix_users_email;
DROP INDEX IF EXISTS public.ix_unidades_id;
DROP INDEX IF EXISTS public.ix_reservas_id;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.unidades DROP CONSTRAINT IF EXISTS unidades_pkey;
ALTER TABLE IF EXISTS ONLY public.reservas DROP CONSTRAINT IF EXISTS reservas_pkey;
ALTER TABLE IF EXISTS ONLY public.alembic_version DROP CONSTRAINT IF EXISTS alembic_version_pkc;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.unidades;
DROP TABLE IF EXISTS public.reservas;
DROP TABLE IF EXISTS public.alembic_version;
DROP TYPE IF EXISTS public.statusreserva;
--
-- Name: statusreserva; Type: TYPE; Schema: public; Owner: cb_db
--

CREATE TYPE public.statusreserva AS ENUM (
    'EM_ANALISE',
    'APROVADO',
    'REPROVADO'
);


ALTER TYPE public.statusreserva OWNER TO cb_db;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: cb_db
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO cb_db;

--
-- Name: reservas; Type: TABLE; Schema: public; Owner: cb_db
--

CREATE TABLE public.reservas (
    id uuid NOT NULL,
    data_reserva timestamp without time zone NOT NULL,
    qtd_pessoas integer NOT NULL,
    itens_cardapio json,
    status public.statusreserva,
    motivo_reprovacao character varying,
    created_at timestamp with time zone DEFAULT now(),
    user_id uuid,
    unidade_id uuid,
    horario_reserva character varying NOT NULL
);


ALTER TABLE public.reservas OWNER TO cb_db;

--
-- Name: unidades; Type: TABLE; Schema: public; Owner: cb_db
--

CREATE TABLE public.unidades (
    id uuid NOT NULL,
    nome character varying NOT NULL,
    regiao character varying NOT NULL,
    endereco character varying NOT NULL,
    foto_url character varying,
    latitude double precision,
    longitude double precision,
    cep character varying NOT NULL
);


ALTER TABLE public.unidades OWNER TO cb_db;

--
-- Name: users; Type: TABLE; Schema: public; Owner: cb_db
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    nome character varying NOT NULL,
    email character varying NOT NULL,
    senha_hash character varying NOT NULL,
    is_superuser boolean,
    telefone character varying
);


ALTER TABLE public.users OWNER TO cb_db;

--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: cb_db
--

COPY public.alembic_version (version_num) FROM stdin;
ab0e135ec62b
\.


--
-- Data for Name: reservas; Type: TABLE DATA; Schema: public; Owner: cb_db
--

COPY public.reservas (id, data_reserva, qtd_pessoas, itens_cardapio, status, motivo_reprovacao, created_at, user_id, unidade_id, horario_reserva) FROM stdin;
77daa2c3-fb80-49bc-b408-d4d85a4892e2	2026-02-20 20:00:00	92	["Salada Coco Bambu", "Camar\\u00e3o Capri", "Torta de Ma\\u00e7\\u00e3"]	EM_ANALISE	\N	2026-02-04 21:27:26.982616+00	3711d535-df0a-46f4-9786-d83913dc74f3	86806775-f779-483c-b290-d9bed9d125fb	20:00
b5803aa5-3fa1-4982-839e-b0a0e1d1855c	2026-02-27 21:00:00	2	["Salada Coco Bambu", "Camar\\u00e3o Jurer\\u00ea", "Cocada Mole"]	EM_ANALISE	\N	2026-02-04 21:34:24.162558+00	f99d92fd-0c61-4a38-98ad-3b7b3d1541c2	fdd3615c-fe3d-4e23-99c7-01b27381776a	21:00
ec1b67a0-31ff-4b7e-a238-ddf3618fdf2f	2026-02-18 20:00:00	2	["Salada Caprese", "Camar\\u00e3o Jurer\\u00ea", "Torta de Ma\\u00e7\\u00e3"]	EM_ANALISE	\N	2026-02-06 13:00:48.679507+00	f99d92fd-0c61-4a38-98ad-3b7b3d1541c2	0353f997-a9b4-4c4d-9e90-07c7659490d9	20:00
b1acc240-f23c-4132-b338-e2e1ecf60290	2026-02-18 21:30:00	2	["Bruschettas de tapioca", "Camar\\u00e3o Aruba", "Creme de Papaya"]	APROVADO	\N	2026-02-06 12:37:11.604458+00	f99d92fd-0c61-4a38-98ad-3b7b3d1541c2	333a5181-d4cc-4f99-b05f-a6b626c591c7	21:30
7788b14a-9eb5-4244-b8ed-7a264e59d241	2026-02-17 20:30:00	67	["Salada Coco Bambu", "Camar\\u00e3o Capri", "Torta de Ma\\u00e7\\u00e3"]	REPROVADO	Lotação máxima da unidade excedida	2026-02-06 13:37:13.03213+00	3711d535-df0a-46f4-9786-d83913dc74f3	2b2092e6-cfaf-417d-ba61-5d97705d016e	20:30
4f00ee59-0c9d-498d-8da3-57e791e33e9e	2026-02-26 21:30:00	2	["Salada Costa Azul", "Camar\\u00e3o Jurer\\u00ea", "Torta de Lim\\u00e3o"]	EM_ANALISE	\N	2026-02-06 12:36:31.477488+00	f99d92fd-0c61-4a38-98ad-3b7b3d1541c2	0353f997-a9b4-4c4d-9e90-07c7659490d9	21:30
96043734-0d58-4d3b-829f-28c37e4dda97	2026-02-20 19:30:00	2	["Salada Coco Bambu", "Camar\\u00e3o Jurer\\u00ea", "Torta de Lim\\u00e3o"]	REPROVADO	Lotação máxima da unidade excedida	2026-02-06 13:41:19.577907+00	f99d92fd-0c61-4a38-98ad-3b7b3d1541c2	745c7833-db96-4371-bcdf-aa5404261b2e	19:30
\.


--
-- Data for Name: unidades; Type: TABLE DATA; Schema: public; Owner: cb_db
--

COPY public.unidades (id, nome, regiao, endereco, foto_url, latitude, longitude, cep) FROM stdin;
fee5885b-d87f-4299-b38c-bdf385c7854e	Iguatemi Brasília	Brasília - DF	Quadra CA 4, Setor de Habitações Individuais Norte	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-15.841496	-48.1038167	71503-504
263754b2-77fa-4fe5-94f9-60b17a9950fe	Campinas	Campinas - SP	Avenida Iguatemi, Vila Brandina	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-22.8938651	-47.0298606	13092-902
ff165e40-1e47-4d4b-b20b-ef346f1e5ff1	Araraquara	Araraquara - SP	Acesso Engenheiro Heitor de Souza Pinheiro, Vila Santana	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-21.7869944	-48.2096526	14801-600
607fa78b-54db-42a8-b069-c34b0a62f588	Bourbon	São Paulo - SP	Rua Palestra Itália, Perdizes	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-23.5252463	-46.6825245	05005-030
745c7833-db96-4371-bcdf-aa5404261b2e	Paralela	Salvador - BA	Avenida Luís Viana Filho, Paralela	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-12.9748316	-38.4522869	41730-101
3355a13e-cac7-4228-aae2-8be64223c0d0	DF Plaza Águas Claras	Brasília - DF	Rua Copaíba, Norte (Águas Claras)	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-15.8370573	-48.0438119	71919-540
b11cd5fc-bd3c-4c4c-a7c3-edceddf27278	Conceito Eldorado	São Paulo - SP	Avenida Rebouças, Pinheiros	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-23.5636642	-46.6769083	05402-600
66c42010-4087-48dc-8268-ca4213c445ba	Conceito Patio Paulista	São Paulo - SP	Rua Treze de Maio, Bela Vista	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-23.5641057	-46.6455479	01327-001
dcbdb437-78fb-40fb-aee3-bea92bf74287	Conceito São Bernardo	São Bernardo do Campo - SP	Avenida Kennedy, Jardim do Mar	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-23.6889016	-46.5601839	09726-253
ce22abe6-2202-4258-b5c9-5db37d8b6d3b	Conceito Tivoli	Santa Bárbara D'Oeste - SP	Rua do Ósmio, Jardim Mollon	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-22.7510985	-47.3797263	13456-625
f2aa707c-23ca-4beb-b36d-9467a2adfd7f	Granja Viana	Cotia - SP	Rodovia Raposo Tavares, Lageadinho	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-23.5913132	-46.8123748	06709-015
58166f29-58b3-40e0-944a-fd9ff678c232	Guarulhos	Guarulhos - SP	Avenida Bartholomeu de Carlos, Jardim Flor da Montanha	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-23.439994	-46.5438925	07097-420
76153553-2489-461e-bc76-a03876717eec	J.K	São Paulo - SP	Avenida Antônio Joaquim de Moura Andrade, Vila Nova Conceição	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-23.58576	-46.6674179	04507-000
3690b1dc-b125-48e6-af78-a992c5185181	Lago Sul	Brasília - DF	Trecho SCES Trecho 2, Asa Sul	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-15.8178928	-47.8343037	70200-002
b6627311-d866-44f6-88c5-9d66af761ca6	Bahia	Salvador - BA	Avenida Paulo VI, Pituba	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-12.9884988	-38.4666878	41810-001
8ffb064b-e958-4368-b33f-36ab6e22c5b3	Jundiai	Jundiaí - SP	Avenida Nove de Julho, Anhangabaú	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-23.2060417	-46.894755	13208-056
84d01e0a-b376-483e-88b6-0a5ec8f8694a	Limeira	Limeira - SP	Rua Carlos Gomes, Centro	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-22.5686447	-47.4062463	13480-010
e1dfe5f2-c5c2-4ba8-9a76-ba625bded1db	Parkshopping	Brasília - DF	SMAS, Zona Industrial (Guará)	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-15.8368348	-47.945102	71219-900
9ef83a48-8d79-4a05-baa6-15e39bd92841	Market Place	São Paulo - SP	Avenida Doutor Chucri Zaidan, Vila Cordeiro	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-23.6219386	-46.6991259	04583-110
99c1e389-9e68-40f3-95ce-dcb4428671c9	Morumbi	São Paulo - SP	Avenida Roque Petroni Júnior, Jardim das Acácias	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-23.6205375	-46.6997637	04707-900
fdd3615c-fe3d-4e23-99c7-01b27381776a	Osasco	Osasco - SP	Avenida dos Autonomistas, Vila Yara	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-23.5365441	-46.7806104	06020-010
5b809ae2-a529-42d1-a298-b9ffc5e7d4ec	Plaza Sul	São Paulo - SP	Praça Leonor Kaupa, Bosque da Saúde	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-23.6196492	-46.6276499	04151-100
912ce5b9-94a3-4b80-9cf9-2cdf785c1775	São José do Rio Preto	São José do Rio Preto - SP	Avenida Waldemar Haddad, Residencial Quinta do Golfe	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-20.8548429	-49.4249357	15093-300
333a5181-d4cc-4f99-b05f-a6b626c591c7	Taguatinga	Brasília - DF	Quadra QS 1 Rua 210, Taguatinga	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-15.84351027425042	-48.04443597793579	72036-004
b3dfc0f2-2975-447d-b1c2-282eff183c0c	Ribeirão Preto	Ribeirão Preto - SP	Avenida Luiz Eduardo Toledo Prado, Vila do Golfe	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-21.2480528	-47.8334677	14027-250
39f786e4-ba9b-421b-b52d-8d7df450968b	Santo Andre	Santo André - SP	Avenida Pereira Barreto, Vila Gilda	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-23.6788548	-46.5382616	09190-210
830de5ce-6674-4394-948b-6b098ab118b6	Tatuapé	São Paulo - SP	Rua Domingos Agostim, Cidade Mãe do Céu	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-23.5421254	-46.5761181	03306-010
a3c3b8a9-721a-4d7f-9467-2387d5c95856	São José dos Campos	São José dos Campos - SP	Avenida São João, Jardim das Colinas	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-23.2081342	-45.9082626	12242-000
1383419c-0f2e-46ef-aa0a-bc75e24a6b82	SP Market	São Paulo - SP	Avenida das Nações Unidas, Vila Almeida	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-23.6204519	-46.7006298	04795-000
6398ac46-7abc-4fc7-bd06-5e254bbd529f	Vasto São José dos Campos	São José dos Campos - SP	Avenida São João, Jardim das Colinas	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-23.2081342	-45.9082626	12242-000
6f84fef5-f6e7-40b4-93b6-37780c4d7b96	Vasto Brasília Shopping	Brasília - DF	SCN Quadra 5 Bloco A, Asa Norte	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-15.786585684277249	-47.889447212219245	70715-900
0c1b127a-cadd-45d1-b866-882ef67bdfea	Tiete	São Paulo - SP	Avenida Raimundo Pereira de Magalhães, Jardim Íris	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-23.4525209	-46.7187635	05145-000
4c985f07-2476-4f62-b009-1a152f85c2fd	Tucuruvi	São Paulo - SP	Avenida Doutor Antônio Maria Laet, Parada Inglesa	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-23.4749746	-46.5995286	02240-000
2b2092e6-cfaf-417d-ba61-5d97705d016e	Itaquera	São Paulo - SP	Avenida José Pinheiro Borges, Vila Campanela	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-23.525437	-46.443689	08220-900
7fd73be4-aeed-4520-999e-efa8b7bc522c	Anhembi	São Paulo - SP	Avenida Braz Leme, Casa Verde	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-23.5033823	-46.6358392	02511-000
b4bf0622-d7d6-47fb-ac31-d24499964969	Sorocaba	Votorantim - SP	Avenida Gisele Constantino, Parque Bela Vista	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-23.5393476	-47.466239	18110-650
86806775-f779-483c-b290-d9bed9d125fb	Vasto 108 sul	Brasília - DF	Quadra CLS 108 Bloco E, Asa Sul	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-15.816523543417206	-47.90436029434205	70347-550
560a9f46-7669-41b0-863e-55af5aee13be	Brasília Shopping	Brasília - DF	SCN Quadra 5 Bloco A, Asa Norte	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-15.786283702291582	-47.88946866989136	70715-900
c5fc461f-a403-47d4-9657-1e5e021f5990	Vasto Rio	Rio de Janeiro - RJ	Avenida das Américas, Barra da Tijuca	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-22.9994895	-43.3600888	22640-102
af03436e-e01e-43e0-9f49-91ca7fd87a00	Dom Pastel	Fortaleza - CE	Rua Carlos Vasconcelos, Meireles	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-3.7365036	-38.5119318	60115-170
d6b383ed-cf09-4fb2-b011-ae960e8673a5	Campo Grande	Campo Grande - MS	Avenida Afonso Pena, Santa Fé	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-20.4643409	-54.6178225	79031-900
046966b3-2a92-4811-8714-00307f7360ab	Barra da Tijuca	Rio de Janeiro - RJ	Avenida das Américas, Barra da Tijuca	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-22.9682724	-43.61797	22640-102
db099710-2dd8-4308-8550-e09fc2efcb6e	Botafogo	Rio de Janeiro - RJ	Praia Botafogo, Botafogo	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-22.9454037	-43.180818	22250-040
96a61c53-546a-4e87-8ea2-201c13e6be61	Niterói	Niterói - RJ	Rua Quinze de Novembro, Centro	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-22.8964728	-43.1207942	24020-125
196e5962-b55a-4443-be03-bb655aae6ff1	Conceito Canoas	Canoas - RS	Avenida Farroupilha, Marechal Rondon	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-29.9162692	-51.1658843	92020-475
c413258b-3135-442e-80b4-a1bd69b0cdad	Londrina	Londrina - PR	Rodovia Celso Garcia Cid, Gleba Fazenda Palhano	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-23.4974177	-51.1318548	86050-901
c6d1b5cd-688a-4bc4-bebc-d0e707fb7ad5	Conceito Itau Power	Contagem - MG	Avenida General David Sarnoff, Cidade Industrial	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-19.9490477	-44.0203041	32210-110
88e208ff-cb6e-4685-ae1b-4143020873c5	Cuiaba	Cuiabá - MT	Avenida Miguel Sutil, Santa Rosa	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-15.6017402	-56.0761105	78040-365
06326960-3787-441c-85f0-af5fbce2be02	Del Rey	Belo Horizonte - MG	Avenida Presidente Carlos Luz, Caiçaras	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-19.8696868	-43.973829	31250-010
702e70f7-048b-4776-8ff8-81672862cff7	Conceito Barigui	Curitiba - PR	Rua Professor Pedro Viriato Parigot de Souza, Mossunguê	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-25.436751	-49.3188819	81200-100
38bfb0f5-f488-4bc0-be56-44f4749c5fbd	Derby	Recife - PE	Praça do Derby, Derby	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-8.0563124	-34.8991373	52010-140
56901b00-eef1-458e-8af7-9e48dea12f7c	Estação BH	Belo Horizonte - MG	Avenida Cristiano Machado, Vila Cloris	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-19.8435377	-43.9334678	31744-007
c3532fff-38ae-48ff-9a9a-f7dcdc1ab12b	Iguatemi Fortaleza	Fortaleza - CE	Avenida Washington Soares, Engenheiro Luciano Cavalcante	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-3.7594702	-38.4832259	60810-350
fa07b97e-08d6-49cb-ad47-1a1532c1894d	Florianopolis	Florianópolis - SC	Avenida Prefeito Osmar Cunha, Centro	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-27.5932445	-48.5512692	88015-100
058872f6-202f-404c-aaa6-0c1f3b806f1b	Goiania	Goiânia - GO	Avenida Deputado Jamel Cecílio, Jardim Goiás	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-16.706653	-49.2379047	74810-907
c46a6991-43eb-4ef9-9b6d-0a4b9285c30e	Itaguaçu	São José - SC	Rua Gerôncio Thives, Barreiros	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-27.583194	-48.6149277	88117-900
f8029a62-c71c-44d5-a785-badc73a37697	Curitiba	Curitiba - PR	Rua Brigadeiro Franco, Centro	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-25.4227043	-49.2873868	80250-030
253f2e13-5801-47ac-9730-b78fcd164bd3	Meireles	Fortaleza - CE	Rua Canuto de Aguiar, Meireles	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-3.7322621	-38.4904544	60160-120
57fad660-d518-4f56-84cd-58f89c4297f3	Juiz de Fora	Juiz de Fora - MG	Avenida Presidente Itamar Franco, Cascatinha	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-21.7814402	-43.3663626	36033-318
dfb12406-5cb4-4b71-b37a-c0bdd0e3facd	Maringá	Maringá - PR	Avenida Colombo, Gleba Patrimônio Maringá	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-23.4119007	-51.9849754	87070-000
d095eaf7-3296-400b-8db2-016994136858	Conceito BH Shopping	Belo Horizonte - MG	Rodovia BR-356, Belvedere	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-20.0055545	-43.96442	30320-900
1342d992-0b80-4a12-8eb9-a39d0008d0a7	Belém	Belém - PA	Rodovia dos Trabalhadores, Parque Verde	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-1.388144	-48.4648976	66635-894
9303c805-0f22-418c-ba15-c38f85215f0e	Minas Shopping	Belo Horizonte - MG	Avenida Cristiano Machado, União	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-19.8435377	-43.9334678	31160-900
4726fadb-cb85-4375-98ba-8cae445a57ca	NorthShopping Fortaleza	Fortaleza - CE	Avenida Bezerra de Menezes, Presidente Kennedy	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-3.7320134	-38.5474375	60325-902
faa9b2f7-9e49-4b54-91c3-e9b1fe41b3b2	Passeio das Águas	Goiânia - GO	Avenida Perimetral Norte, Fazenda Caveiras	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-16.6217663	-49.2370358	74445-360
4e316853-8618-4423-aec2-f2a05e35d340	Norte Shopping Rio	Rio de Janeiro - RJ	Avenida Dom Hélder Câmara, Cachambi	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-22.8842166	-43.2911702	20771-001
7f1d43d9-627b-4672-a86f-119eead520a1	Volta Redonda	Volta Redonda - RJ	Rodovia VRD 001 dos Metalúrgicos, São Geraldo	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-22.522537224468326	-44.10412073135377	27253-003
dc617e13-94f6-4d5a-92d7-91cc7ff5357c	Sul Fortaleza	Fortaleza - CE	Rua República da Armênia, Parque Manibura	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-3.7860091	-38.4816563	60821-760
2a7a4c30-21be-4700-a84d-e334a4c7ddfa	Porto Alegre	Porto Alegre - RS	Avenida João Wallig, Passo da Areia	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-30.0125643	-51.1650181	91340-000
2a52c847-7f96-49c4-87e9-e28c9603c27f	Recife	Recife - PE	Rua Padre Carapuceiro, Boa Viagem	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-8.1176077	-34.9006611	51020-900
1b50ef88-a1c6-4f43-ba4c-503d86438dfd	Uberlândia	Uberlândia - MG	Avenida João Naves de Ávila, Tibery	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-18.9389794	-48.2241315	38408-902
deec7d23-1a3e-4410-b9d8-f4e5eb988df6	Vasto Fortaleza	Fortaleza - CE	Avenida Senador Virgílio Távora, Meireles	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-3.7477628	-38.4967013	60170-250
75b5811e-c534-4213-8c09-0b4d1e3181bb	Vasto BH	Belo Horizonte - MG	Rodovia BR-356, Belvedere	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-20.0055545	-43.96442	30320-900
3800d173-2ba4-41a7-9c1e-c8899ef7b51c	Maceió	Maceió - AL	Conjunto Climério Sarmento, Jatiúca	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-9.6518216	-35.71739	57036-810
1e28bb67-751a-46b8-ad45-9418809624be	Carioca Shopping	Rio de Janeiro - RJ	Avenida Vicente de Carvalho, Vila da Penha	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-22.846317	-43.3033755	21210-623
9d16cf2d-ad4a-4f9f-b094-846966475bc3	Grande Rio	São João de Meriti - RJ	Rua Maria Soares Sendas, Venda Velha	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-22.7897502	-43.3702479	25581-325
31962872-fd49-450b-a622-e470cb60d4ff	Beira Mar	Fortaleza - CE	Avenida Beira Mar, Mucuripe	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-3.7257066	-38.4968337	60165-121
94427aca-7a83-4caf-adfe-be4a0377f9a5	AlphaVille	Barueri - SP	Alameda Rio Negro, Alphaville Centro Industrial e Empresarial/Alphaville.	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-23.495563	-46.8488965	06454-000
3b22d8ae-6c59-4e8e-a405-24caf9dfe323	Anália Franco	São Paulo - SP	Avenida Regente Feijó, Vila Regente Feijó	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-23.5627079	-46.5606646	03342-900
aa73cf4f-e702-40c3-b0ac-b6c7119525e2	Recreio Shopping	Rio de Janeiro - RJ	Avenida das Américas, Recreio dos Bandeirantes	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-22.9994895	-43.3600888	22790-703
bfbd0fe5-bb07-4c80-9add-44516eecf7a3	Amazonas Shopping	Manaus - AM	Avenida Djalma Batista, Chapada	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-3.0807379	-60.0244185	69050-010
0353f997-a9b4-4c4d-9e90-07c7659490d9	Anápolis	Anápolis - GO	Avenida Brasil, Vila Santana	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-16.3241211	-48.9478907	75113-570
b4e2c1fa-0fb8-4006-b775-ed84719adb82	BH Anchieta	Belo Horizonte - MG	Rua Francisco Deslandes, Anchieta	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-19.945542	-43.9295322	30310-530
483e8a75-45cd-4398-a192-4886dea2513a	Boa Vista	Boa Vista - RR	Avenida Ville Roy, Caçari	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	2.8276415	-60.667047	69307-725
b8f71848-366b-4f5c-84d3-8b111f3be77d	Manaus	Manaus - AM	Avenida Coronel Teixeira, Ponta Negra	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-3.0854046	-60.0730793	69037-000
df8e8df0-d21d-46f5-a16f-0bbcdf60d670	São Luis	São Luís - MA	Avenida dos Holandeses, Calhau	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-2.491491	-44.2315058	65071-380
e390fce9-5c7a-4cd9-b65c-1003835316e3	Teresina	Teresina - PI	Rua Professor Joca Vieira, Fátima	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-5.0725108	-42.7871016	64049-514
42abf3f9-333d-4333-8501-69e136fad791	Teresina Shop	Teresina - PI	Avenida Raul Lopes, Noivos	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-5.0548226	-42.8043979	64046-902
c42016ca-6f03-4c89-abe2-4f122dc1b8a7	Vila Velha	Vila Velha - ES	Avenida Doutor Olívio Lira, Praia da Costa	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-20.3402705	-40.2884414	29101-950
668b7a26-60b0-4ecb-99ad-1b0516e36a62	Vitoria	Vitória - ES	Avenida Américo Buaiz, Enseada do Suá	/uploads/0b67c581-c43e-4388-b4f6-9387c295c9b2.png	-20.3059172	-40.2919607	29050-902
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: cb_db
--

COPY public.users (id, nome, email, senha_hash, is_superuser, telefone) FROM stdin;
3711d535-df0a-46f4-9786-d83913dc74f3	Coco Bambu - Adm	admin@cocobambu.com	$2b$12$DtbIeEO.BKaXgqRQgf.Kn.ymeKw6ytEw4FP//xrgjdqo4YwNZHGg.	t	6133560000
f99d92fd-0c61-4a38-98ad-3b7b3d1541c2	CB Logística 	cliente@cocobambu.com	$2b$12$nds3paKx3cB0G/YijarPZefKq.zhWujQ3iadZNxrQprG6xQ6GwrG.	f	6199919491
\.


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: cb_db
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: reservas reservas_pkey; Type: CONSTRAINT; Schema: public; Owner: cb_db
--

ALTER TABLE ONLY public.reservas
    ADD CONSTRAINT reservas_pkey PRIMARY KEY (id);


--
-- Name: unidades unidades_pkey; Type: CONSTRAINT; Schema: public; Owner: cb_db
--

ALTER TABLE ONLY public.unidades
    ADD CONSTRAINT unidades_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: cb_db
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ix_reservas_id; Type: INDEX; Schema: public; Owner: cb_db
--

CREATE INDEX ix_reservas_id ON public.reservas USING btree (id);


--
-- Name: ix_unidades_id; Type: INDEX; Schema: public; Owner: cb_db
--

CREATE INDEX ix_unidades_id ON public.unidades USING btree (id);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: cb_db
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: cb_db
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: reservas reservas_unidade_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cb_db
--

ALTER TABLE ONLY public.reservas
    ADD CONSTRAINT reservas_unidade_id_fkey FOREIGN KEY (unidade_id) REFERENCES public.unidades(id);


--
-- Name: reservas reservas_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cb_db
--

ALTER TABLE ONLY public.reservas
    ADD CONSTRAINT reservas_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict cugEQBK0pjAEjrzfv1m99SDaZriLXdrCXYwt03Nwy2Accw50xeLyQd2F15b4Tpo

