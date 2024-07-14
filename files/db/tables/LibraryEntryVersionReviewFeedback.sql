CREATE TABLE [dbo].[LibraryEntryVersionFeedback] (
    [ReviewId] nvarchar(100) NOT NULL,
    [Author] nvarchar(100) NOT NULL,
    [Helpful] bit NOT NULL,
    CONSTRAINT [LibraryEntryVersionFeedback_PK] PRIMARY KEY CLUSTERED ([ReviewId] ASC, [Author] ASC),
    CONSTRAINT [LibraryEntryVersionFeedback_FK_Review] FOREIGN KEY ([ReviewId]) REFERENCES [dbo].[LibraryEntryVersionReviews] ([Id]) ON DELETE CASCADE
)
GO

