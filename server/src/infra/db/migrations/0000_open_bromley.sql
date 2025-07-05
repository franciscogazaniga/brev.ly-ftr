CREATE TABLE "links" (
	"id" text PRIMARY KEY NOT NULL,
	"original_link" text NOT NULL,
	"shortened_link" text NOT NULL,
	"access_count" text DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "links_shortened_link_unique" UNIQUE("shortened_link")
);
