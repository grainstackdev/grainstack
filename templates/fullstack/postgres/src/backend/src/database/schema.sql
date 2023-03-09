CREATE SCHEMA IF NOT EXISTS public;

CREATE TABLE public.test_User (
  userId UUID NOT NULL,
  oauth JSON NOT NULL,
  dateUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dateCreated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (userId)
);