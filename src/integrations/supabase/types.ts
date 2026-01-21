export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      afd_submissions: {
        Row: {
          admin_notes: string | null
          approval_status: string
          budget: string | null
          country_of_origin: string | null
          country_of_production: string | null
          created_at: string
          description: string | null
          director: string | null
          file_type: string
          file_url: string
          format: string | null
          genre: string | null
          id: string
          partners: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          showcase: boolean | null
          tier: string
          title: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          approval_status?: string
          budget?: string | null
          country_of_origin?: string | null
          country_of_production?: string | null
          created_at?: string
          description?: string | null
          director?: string | null
          file_type: string
          file_url: string
          format?: string | null
          genre?: string | null
          id?: string
          partners?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          showcase?: boolean | null
          tier: string
          title: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          approval_status?: string
          budget?: string | null
          country_of_origin?: string | null
          country_of_production?: string | null
          created_at?: string
          description?: string | null
          director?: string | null
          file_type?: string
          file_url?: string
          format?: string | null
          genre?: string | null
          id?: string
          partners?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          showcase?: boolean | null
          tier?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      asset_documents: {
        Row: {
          asset_id: string
          document_type: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id: string
          uploaded_at: string
        }
        Insert: {
          asset_id: string
          document_type?: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id?: string
          uploaded_at?: string
        }
        Update: {
          asset_id?: string
          document_type?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_documents_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_transactions: {
        Row: {
          asset_id: string
          created_at: string
          from_user_id: string | null
          id: string
          price_per_token: number
          to_user_id: string | null
          token_amount: number
          total_amount: number
          transaction_hash: string | null
          transaction_type: string
        }
        Insert: {
          asset_id: string
          created_at?: string
          from_user_id?: string | null
          id?: string
          price_per_token: number
          to_user_id?: string | null
          token_amount: number
          total_amount: number
          transaction_hash?: string | null
          transaction_type: string
        }
        Update: {
          asset_id?: string
          created_at?: string
          from_user_id?: string | null
          id?: string
          price_per_token?: number
          to_user_id?: string | null
          token_amount?: number
          total_amount?: number
          transaction_hash?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_transactions_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_valuations: {
        Row: {
          asset_id: string
          id: string
          notes: string | null
          valuation_amount: number
          valuation_date: string
          valuation_method: string | null
          valuator_id: string | null
        }
        Insert: {
          asset_id: string
          id?: string
          notes?: string | null
          valuation_amount: number
          valuation_date?: string
          valuation_method?: string | null
          valuator_id?: string | null
        }
        Update: {
          asset_id?: string
          id?: string
          notes?: string | null
          valuation_amount?: number
          valuation_date?: string
          valuation_method?: string | null
          valuator_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_valuations_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_watchlist: {
        Row: {
          asset_id: string
          created_at: string
          id: string
          price_alert_above: number | null
          price_alert_below: number | null
          user_id: string
        }
        Insert: {
          asset_id: string
          created_at?: string
          id?: string
          price_alert_above?: number | null
          price_alert_below?: number | null
          user_id: string
        }
        Update: {
          asset_id?: string
          created_at?: string
          id?: string
          price_alert_above?: number | null
          price_alert_below?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_watchlist_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          asset_type: Database["public"]["Enums"]["asset_type"]
          contract_address: string | null
          created_at: string
          description: string | null
          id: string
          location: string | null
          name: string
          status: Database["public"]["Enums"]["token_status"]
          token_price: number | null
          token_supply: number
          token_symbol: string | null
          total_value: number
          updated_at: string
          user_id: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          asset_type: Database["public"]["Enums"]["asset_type"]
          contract_address?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          name: string
          status?: Database["public"]["Enums"]["token_status"]
          token_price?: number | null
          token_supply: number
          token_symbol?: string | null
          total_value: number
          updated_at?: string
          user_id: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          asset_type?: Database["public"]["Enums"]["asset_type"]
          contract_address?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          name?: string
          status?: Database["public"]["Enums"]["token_status"]
          token_price?: number | null
          token_supply?: number
          token_symbol?: string | null
          total_value?: number
          updated_at?: string
          user_id?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: []
      }
      brand_ads: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          image_url: string
          link_url: string | null
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          link_url?: string | null
          position?: number
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          link_url?: string | null
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      connections: {
        Row: {
          connected_user_id: string
          created_at: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          connected_user_id: string
          created_at?: string
          id?: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          connected_user_id?: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "connections_connected_user_id_fkey"
            columns: ["connected_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      film_ip_tokens: {
        Row: {
          available_tokens: number
          contract_address: string | null
          created_at: string
          film_id: string
          id: string
          revenue_share_percentage: number
          token_price: number
          token_symbol: string
          total_supply: number
          updated_at: string
        }
        Insert: {
          available_tokens: number
          contract_address?: string | null
          created_at?: string
          film_id: string
          id?: string
          revenue_share_percentage?: number
          token_price: number
          token_symbol: string
          total_supply: number
          updated_at?: string
        }
        Update: {
          available_tokens?: number
          contract_address?: string | null
          created_at?: string
          film_id?: string
          id?: string
          revenue_share_percentage?: number
          token_price?: number
          token_symbol?: string
          total_supply?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "film_ip_tokens_film_id_fkey"
            columns: ["film_id"]
            isOneToOne: true
            referencedRelation: "films"
            referencedColumns: ["id"]
          },
        ]
      }
      film_purchases: {
        Row: {
          access_expiry: string | null
          created_at: string
          film_id: string
          id: string
          price_paid: number
          purchase_date: string
          purchase_type: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          access_expiry?: string | null
          created_at?: string
          film_id: string
          id?: string
          price_paid: number
          purchase_date?: string
          purchase_type: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          access_expiry?: string | null
          created_at?: string
          film_id?: string
          id?: string
          price_paid?: number
          purchase_date?: string
          purchase_type?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "film_purchases_film_id_fkey"
            columns: ["film_id"]
            isOneToOne: false
            referencedRelation: "films"
            referencedColumns: ["id"]
          },
        ]
      }
      film_reviews: {
        Row: {
          comment: string
          created_at: string
          film_id: string
          helpful_count: number | null
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          film_id: string
          helpful_count?: number | null
          id?: string
          rating: number
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          film_id?: string
          helpful_count?: number | null
          id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "film_reviews_film_id_fkey"
            columns: ["film_id"]
            isOneToOne: false
            referencedRelation: "films"
            referencedColumns: ["id"]
          },
        ]
      }
      filmmaker_profiles: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          portfolio_url: string | null
          profile_image_url: string | null
          show_in_showcase: boolean | null
          skills: Database["public"]["Enums"]["filmmaker_skill"][] | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id: string
          portfolio_url?: string | null
          profile_image_url?: string | null
          show_in_showcase?: boolean | null
          skills?: Database["public"]["Enums"]["filmmaker_skill"][] | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          portfolio_url?: string | null
          profile_image_url?: string | null
          show_in_showcase?: boolean | null
          skills?: Database["public"]["Enums"]["filmmaker_skill"][] | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "filmmaker_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      filmmaker_profiles_extended: {
        Row: {
          created_at: string
          experience: string
          id: string
          image: string
          name: string
          role: string
          skills: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          experience: string
          id: string
          image: string
          name: string
          role: string
          skills?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          experience?: string
          id?: string
          image?: string
          name?: string
          role?: string
          skills?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "filmmaker_profiles_extended_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      films: {
        Row: {
          created_at: string
          description: string | null
          director: string
          film_url: string
          genre: string | null
          id: string
          poster_url: string | null
          price: string
          title: string
          token_id: number | null
          updated_at: string
          user_id: string | null
          video_url: string | null
          views: number | null
          year: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          director: string
          film_url: string
          genre?: string | null
          id?: string
          poster_url?: string | null
          price: string
          title: string
          token_id?: number | null
          updated_at?: string
          user_id?: string | null
          video_url?: string | null
          views?: number | null
          year?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          director?: string
          film_url?: string
          genre?: string | null
          id?: string
          poster_url?: string | null
          price?: string
          title?: string
          token_id?: number | null
          updated_at?: string
          user_id?: string | null
          video_url?: string | null
          views?: number | null
          year?: string | null
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      ip_token_transactions: {
        Row: {
          created_at: string
          film_id: string
          from_user_id: string | null
          id: string
          price_per_token: number
          to_user_id: string
          token_amount: number
          total_amount: number
          transaction_date: string
          transaction_hash: string | null
          transaction_type: string
        }
        Insert: {
          created_at?: string
          film_id: string
          from_user_id?: string | null
          id?: string
          price_per_token: number
          to_user_id: string
          token_amount: number
          total_amount: number
          transaction_date?: string
          transaction_hash?: string | null
          transaction_type: string
        }
        Update: {
          created_at?: string
          film_id?: string
          from_user_id?: string | null
          id?: string
          price_per_token?: number
          to_user_id?: string
          token_amount?: number
          total_amount?: number
          transaction_date?: string
          transaction_hash?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "ip_token_transactions_film_id_fkey"
            columns: ["film_id"]
            isOneToOne: false
            referencedRelation: "films"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_profiles: {
        Row: {
          address: string
          city: string
          country: string
          created_at: string
          date_of_birth: string
          id: string
          identity_document_url: string
          income_range: string
          investment_experience: string
          investment_goals: string
          occupation: string
          phone_number: string
          proof_of_address_url: string
          risk_tolerance: string
          source_of_funds: string
          state: string
          updated_at: string
          user_id: string
          verification_status: string
          zip_code: string
        }
        Insert: {
          address: string
          city: string
          country: string
          created_at?: string
          date_of_birth: string
          id?: string
          identity_document_url: string
          income_range: string
          investment_experience: string
          investment_goals: string
          occupation: string
          phone_number: string
          proof_of_address_url: string
          risk_tolerance: string
          source_of_funds: string
          state: string
          updated_at?: string
          user_id: string
          verification_status?: string
          zip_code: string
        }
        Update: {
          address?: string
          city?: string
          country?: string
          created_at?: string
          date_of_birth?: string
          id?: string
          identity_document_url?: string
          income_range?: string
          investment_experience?: string
          investment_goals?: string
          occupation?: string
          phone_number?: string
          proof_of_address_url?: string
          risk_tolerance?: string
          source_of_funds?: string
          state?: string
          updated_at?: string
          user_id?: string
          verification_status?: string
          zip_code?: string
        }
        Relationships: []
      }
      meetup_attendees: {
        Row: {
          created_at: string
          id: string
          meetup_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          meetup_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          meetup_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetup_attendees_meetup_id_fkey"
            columns: ["meetup_id"]
            isOneToOne: false
            referencedRelation: "meetups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetup_attendees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meetups: {
        Row: {
          created_at: string
          creator_id: string
          description: string
          id: string
          location: string
          meetup_date: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          description: string
          id?: string
          location: string
          meetup_date: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string
          id?: string
          location?: string
          meetup_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetups_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          receiver_id: string
          sender_id: string
          subject: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          receiver_id: string
          sender_id: string
          subject: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          receiver_id?: string
          sender_id?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reactions: {
        Row: {
          created_at: string
          id: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          reaction_type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          attachments: Json | null
          comments_count: number | null
          content: string
          created_at: string
          external_url: string | null
          funding_amount: string | null
          id: string
          image_url: string | null
          job_location: string | null
          job_salary: string | null
          likes_count: number | null
          post_type: Database["public"]["Enums"]["post_type"]
          showcase_submission_id: string | null
          tags: string[] | null
          title: string | null
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          comments_count?: number | null
          content: string
          created_at?: string
          external_url?: string | null
          funding_amount?: string | null
          id?: string
          image_url?: string | null
          job_location?: string | null
          job_salary?: string | null
          likes_count?: number | null
          post_type?: Database["public"]["Enums"]["post_type"]
          showcase_submission_id?: string | null
          tags?: string[] | null
          title?: string | null
          user_id: string
        }
        Update: {
          attachments?: Json | null
          comments_count?: number | null
          content?: string
          created_at?: string
          external_url?: string | null
          funding_amount?: string | null
          id?: string
          image_url?: string | null
          job_location?: string | null
          job_salary?: string | null
          likes_count?: number | null
          post_type?: Database["public"]["Enums"]["post_type"]
          showcase_submission_id?: string | null
          tags?: string[] | null
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_showcase_submission_id_fkey"
            columns: ["showcase_submission_id"]
            isOneToOne: false
            referencedRelation: "afd_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      showcae: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      staking_pools: {
        Row: {
          apy: number
          created_at: string
          description: string | null
          id: string
          lock_period_days: number
          max_capacity: number | null
          min_stake: number
          name: string
          reward_token_address: string | null
          status: string
          total_staked: number
          updated_at: string
        }
        Insert: {
          apy: number
          created_at?: string
          description?: string | null
          id?: string
          lock_period_days?: number
          max_capacity?: number | null
          min_stake?: number
          name: string
          reward_token_address?: string | null
          status?: string
          total_staked?: number
          updated_at?: string
        }
        Update: {
          apy?: number
          created_at?: string
          description?: string | null
          id?: string
          lock_period_days?: number
          max_capacity?: number | null
          min_stake?: number
          name?: string
          reward_token_address?: string | null
          status?: string
          total_staked?: number
          updated_at?: string
        }
        Relationships: []
      }
      team_memberships: {
        Row: {
          id: string
          joined_at: string
          role: Database["public"]["Enums"]["team_role"]
          team_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          role?: Database["public"]["Enums"]["team_role"]
          team_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          role?: Database["public"]["Enums"]["team_role"]
          team_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_memberships_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          responsibilities: string[]
          tagline: string
          team_type: Database["public"]["Enums"]["team_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
          responsibilities?: string[]
          tagline: string
          team_type: Database["public"]["Enums"]["team_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          responsibilities?: string[]
          tagline?: string
          team_type?: Database["public"]["Enums"]["team_type"]
          updated_at?: string
        }
        Relationships: []
      }
      token_holders: {
        Row: {
          asset_id: string
          id: string
          purchase_date: string
          purchase_price: number
          token_amount: number
          user_id: string
        }
        Insert: {
          asset_id: string
          id?: string
          purchase_date?: string
          purchase_price: number
          token_amount: number
          user_id: string
        }
        Update: {
          asset_id?: string
          id?: string
          purchase_date?: string
          purchase_price?: number
          token_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_holders_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_collections: {
        Row: {
          created_at: string | null
          film_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          film_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          film_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_collections_film_id_fkey"
            columns: ["film_id"]
            isOneToOne: false
            referencedRelation: "films"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stakes: {
        Row: {
          created_at: string
          id: string
          last_reward_calculation: string
          pool_id: string
          rewards_claimed: number
          rewards_earned: number
          stake_date: string
          staked_amount: number
          status: string
          transaction_hash: string | null
          unlock_date: string
          updated_at: string
          user_id: string
          wallet_address: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_reward_calculation?: string
          pool_id: string
          rewards_claimed?: number
          rewards_earned?: number
          stake_date?: string
          staked_amount: number
          status?: string
          transaction_hash?: string | null
          unlock_date: string
          updated_at?: string
          user_id: string
          wallet_address: string
        }
        Update: {
          created_at?: string
          id?: string
          last_reward_calculation?: string
          pool_id?: string
          rewards_claimed?: number
          rewards_earned?: number
          stake_date?: string
          staked_amount?: number
          status?: string
          transaction_hash?: string | null
          unlock_date?: string
          updated_at?: string
          user_id?: string
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_stakes_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "staking_pools"
            referencedColumns: ["id"]
          },
        ]
      }
      user_watch_history: {
        Row: {
          created_at: string
          film_id: string
          id: string
          last_watched: string
          user_id: string
          watch_progress: number
        }
        Insert: {
          created_at?: string
          film_id: string
          id?: string
          last_watched?: string
          user_id: string
          watch_progress?: number
        }
        Update: {
          created_at?: string
          film_id?: string
          id?: string
          last_watched?: string
          user_id?: string
          watch_progress?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_watch_history_film_id_fkey"
            columns: ["film_id"]
            isOneToOne: false
            referencedRelation: "films"
            referencedColumns: ["id"]
          },
        ]
      }
      yield_distributions: {
        Row: {
          amount_per_token: number
          asset_id: string
          distribution_amount: number
          distribution_date: string
          id: string
          period_end: string
          period_start: string
          status: string
        }
        Insert: {
          amount_per_token: number
          asset_id: string
          distribution_amount: number
          distribution_date?: string
          id?: string
          period_end: string
          period_start: string
          status?: string
        }
        Update: {
          amount_per_token?: number
          asset_id?: string
          distribution_amount?: number
          distribution_date?: string
          id?: string
          period_end?: string
          period_start?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "yield_distributions_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      filmmaker_showcase: {
        Row: {
          bio: string | null
          created_at: string | null
          experience: string | null
          id: string | null
          name: string | null
          portfolio_url: string | null
          profile_image_url: string | null
          role: string | null
          skills: Database["public"]["Enums"]["filmmaker_skill"][] | null
          updated_at: string | null
          website_url: string | null
        }
        Relationships: [
          {
            foreignKeyName: "filmmaker_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      create_user: {
        Args: { p_email: string; p_username: string }
        Returns: string
      }
      get_current_user_role: { Args: never; Returns: string }
      get_film_average_rating: { Args: { film_id: string }; Returns: number }
      get_user_profiles_for_admin: {
        Args: never
        Returns: {
          created_at: string
          email: string
          id: string
          last_sign_in_at: string
          role: string
        }[]
      }
      is_team_lead: {
        Args: { _team_id: string; _user_id: string }
        Returns: boolean
      }
      is_team_member: {
        Args: { _team_id: string; _user_id: string }
        Returns: boolean
      }
      log_user_creation: { Args: { email: string }; Returns: undefined }
    }
    Enums: {
      asset_type:
        | "real-estate"
        | "art"
        | "commodities"
        | "intellectual-property"
      filmmaker_skill:
        | "directing"
        | "cinematography"
        | "editing"
        | "writing"
        | "producing"
        | "sound_design"
        | "visual_effects"
      post_type: "general" | "news" | "funding" | "jobs" | "showcase"
      team_role: "lead" | "core_member" | "contributor" | "observer"
      team_type:
        | "creator_circle"
        | "tech_builders"
        | "bridge_builders"
        | "stewards"
      token_status: "draft" | "pending" | "active" | "paused" | "completed"
      user_role: "admin" | "user"
      verification_status: "pending" | "in_review" | "verified" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      asset_type: [
        "real-estate",
        "art",
        "commodities",
        "intellectual-property",
      ],
      filmmaker_skill: [
        "directing",
        "cinematography",
        "editing",
        "writing",
        "producing",
        "sound_design",
        "visual_effects",
      ],
      post_type: ["general", "news", "funding", "jobs", "showcase"],
      team_role: ["lead", "core_member", "contributor", "observer"],
      team_type: [
        "creator_circle",
        "tech_builders",
        "bridge_builders",
        "stewards",
      ],
      token_status: ["draft", "pending", "active", "paused", "completed"],
      user_role: ["admin", "user"],
      verification_status: ["pending", "in_review", "verified", "rejected"],
    },
  },
} as const
