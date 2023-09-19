DROP PROCEDURE IF EXISTS [dbo].[Activity_Insert]
GO

CREATE PROCEDURE [dbo].[Activity_Insert]
	@Id [nvarchar](100),
	@Action [nvarchar](100),
	@UserId [nvarchar](100),
	@TopLevelId [nvarchar](100),
	@ObjectId [nvarchar](100) = NULL,
	@VersionId [nvarchar](100) = NULL,
	@Data [nvarchar](MAX) = NULL
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	IF EXISTS(SELECT 1 FROM [dbo].[Activities] WHERE [Id] = @Id)
	BEGIN
		UPDATE [dbo].[Activities]
		SET
			[Action] = @Action,
			[Timestamp] = GETUTCDATE(),
			[UserId] = @UserId,
			[TopLevelId] = @TopLevelId,
			[ObjectId] = @ObjectId,
			[VersionId] = @VersionId,
			[Data] = @Data
		WHERE [Id] = @Id
	END
	ELSE
	BEGIN
		INSERT INTO [dbo].[Activities](
			[Id],
			[Action],
			[Timestamp],
			[UserId],
			[TopLevelId],
			[ObjectId],
			[VersionId],
			[Data]
		) VALUES (
			@Id,
			@Action,
			GETUTCDATE(),
			@UserId,
			@TopLevelId,
			@ObjectId,
			@VersionId,
			@Data
		)
	END
END
